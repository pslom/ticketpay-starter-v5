import type { NextRequest } from 'next/server';

export function readAdminToken(req: NextRequest): string {
  const q = req.nextUrl?.searchParams?.get('token')?.trim() || '';
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const bearer = h.toLowerCase().startsWith('bearer ') ? h.slice(7).trim() : '';
  const h2 = req.headers.get('x-admin-token')?.trim() || '';
  return bearer || h2 || q || '';
}

export function isValidAdmin(req: NextRequest): boolean {
  const token = readAdminToken(req);
  return Boolean(process.env.ADMIN_TOKEN && token && token === process.env.ADMIN_TOKEN);
}
