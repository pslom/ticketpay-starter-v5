import { NextRequest, NextResponse } from 'next/server';

export function jsonResponse(status: number, body: unknown, headers?: Record<string,string>) {
  return new NextResponse(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...(headers || {}) } });
}

export function parseAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || '';
  if (!raw) return [
    'https://www.ticketpay.us.com',
    'https://ticketpay.us.com',
    'http://localhost:3000',
    'http://localhost:3010'
  ];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export function corsHeaders(origin?: string) {
  const ORIGINS = parseAllowedOrigins();
  const allow = origin && ORIGINS.includes(origin) ? origin : ORIGINS[0];
  return {
    'content-type': 'application/json',
    'access-control-allow-origin': allow,
    'access-control-allow-headers': 'content-type, authorization, x-admin-token',
    'access-control-allow-methods': 'OPTIONS, POST, GET',
  } as Record<string,string>;
}

export function j(req?: NextRequest, status = 200, body: unknown = {}) {
  const h = req ? corsHeaders(req.headers.get('origin') || undefined) : { 'content-type': 'application/json' };
  return new NextResponse(JSON.stringify(body), { status, headers: h });
}
