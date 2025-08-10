import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL ?? "";
const ANON = process.env.SUPABASE_ANON_KEY ?? "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE ?? "";

export function supabaseAnon(): SupabaseClient {
  return createClient(URL, ANON, { auth: { persistSession: false } });
}

// ¡Solo en servidor (API/acciones), nunca en cliente!
export function supabaseService(): SupabaseClient {
  return createClient(URL, SERVICE, { auth: { persistSession: false } });
}
