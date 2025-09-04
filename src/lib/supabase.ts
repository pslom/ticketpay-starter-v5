// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Create Supabase clients lazily to avoid throwing during build when env vars
// are not set in the environment used by the bundler.
let _supabase: ReturnType<typeof createClient> | null = null;
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function supabase() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Return a thin stub that throws when used, avoiding immediate crash at import.
    throw new Error('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not configured');
  }
  _supabase = createClient(url, anon, { auth: { persistSession: false } });
  return _supabase;
}

export function supabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not configured');
  }
  _supabaseAdmin = createClient(url, key, { auth: { persistSession: false } });
  return _supabaseAdmin;
}

// Compatibility helpers
export function getSupabaseServer() {
  return supabase();
}

export function getSupabaseAdmin() {
  return supabaseAdmin();
}

export function createServiceClient() {
  return supabaseAdmin();
}
