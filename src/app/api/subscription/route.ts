import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'

type Channel = 'sms'|'email'

function normalizePlate(p: string) {
  return (p || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}
function normalizeState(s: string) {
  return (s || '').toUpperCase().slice(0, 2)
}
function maskContact(c: string, channel: Channel) {
  if (channel === 'sms') return c.replace(/\D/g, '').replace(/.(?=....)/g, '•')
  const [u, d] = c.split('@'); if (!d) return '••••'
  return `${u?.slice(0,1) || '•'}•••@${d}`
}

export async function POST(req: Request) {
  try {
    const s = getSupabaseServer()
    const body = await req.json().catch(()=> ({}))

    // required
    const channel: Channel = (body.channel === 'sms' ? 'sms' : 'email')
    const contactRaw: string = String(body.contact || '')
    const plate = normalizePlate(String(body.plate || ''))
    const state = normalizeState(String(body.state || 'CA'))

    if (!plate || plate.length < 2 || plate.length > 8) {
      return NextResponse.json({ ok:false, error:'invalid_plate' }, { status: 400 })
    }
    if (!contactRaw) {
      return NextResponse.json({ ok:false, error:'missing_contact' }, { status: 400 })
    }

    // server-side duplicate prevention: (state,plate,contact,channel)
    const { data: existing } = await s.from('subscriptions')
      .select('id')
      .eq('state', state)
      .eq('plate', plate)
      .eq('channel', channel)
      .eq('contact', contactRaw)
      .maybeSingle()

    let created = false
    if (!existing) {
      const { error: insErr } = await s.from('subscriptions').insert({
        state, plate, channel, contact: contactRaw, verified: false
      })
      if (insErr && insErr.code !== '23505') {
        return NextResponse.json({ ok:false, error: insErr.message }, { status: 500 })
      }
      created = !insErr
    }

    // optional: also send to email (when user chose SMS + email)
    let emailCreated = false
    if (body.alsoEmail && body.email) {
      const email = String(body.email || '').trim()
      if (email) {
        const { data: existsEmail } = await s.from('subscriptions')
          .select('id')
          .eq('state', state).eq('plate', plate)
          .eq('channel', 'email').eq('contact', email).maybeSingle()

        if (!existsEmail) {
          const { error: eIns } = await s.from('subscriptions').insert({
            state, plate, channel: 'email', contact: email, verified: false
          })
          if (!eIns || eIns.code === '23505') emailCreated = !eIns
        }
      }
    }

    // minimal event (optional; ignore failures)
    try {
      await s.from('events').insert({
        event: 'subscribe_submit',
        props: { channel, masked_contact: maskContact(contactRaw, channel), plate_len: plate.length, state }
      })
    } catch {}

    return NextResponse.json({
      ok: true,
      created,
      duplicate: !!existing,
      emailCreated
    })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e?.message || e) }, { status: 500 })
  }
}
