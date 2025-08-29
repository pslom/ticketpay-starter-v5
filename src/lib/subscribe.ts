export type SubscribeArgs = {
  state: string
  plate: string
  channel: 'sms' | 'email'
  contact: string
  alsoEmail?: boolean
  email?: string
}
export type SubscribeResp = { ok:boolean; created?:boolean; duplicate?:boolean; emailCreated?:boolean; error?:string }

export async function subscribeOnce(args: SubscribeArgs): Promise<SubscribeResp> {
  const r = await fetch('/api/subscription', {
    method: 'POST',
    headers: { 'content-type':'application/json' },
    body: JSON.stringify(args)
  })
  try { return await r.json() } catch { return { ok:false, error:'bad_json' } }
}
