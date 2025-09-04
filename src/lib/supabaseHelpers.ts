import { supabase, supabaseAdmin } from "./supabase";

export function getSupabaseServer(){
  return supabase;
}

export function getSupabaseAdmin(){
  return supabaseAdmin;
}

export function createServiceClient(){
  // fallback to admin client if available
  if (!supabaseAdmin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  return supabaseAdmin;
}
