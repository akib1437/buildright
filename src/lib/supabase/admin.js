import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. SERVER ONLY — never import in a client component.
// Bypasses RLS; used for admin promotion and availability lookups.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
