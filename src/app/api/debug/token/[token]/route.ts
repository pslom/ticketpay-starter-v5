import { NextResponse } from 'next/server';
import { verifyMagic } from '@/lib/magic';
export async function GET(_: Request, { params }: { params: { token: string }}) {
  const p = verifyMagic(params.token);
  return NextResponse.json({ payload: p });
}
