import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client factory (for use in API routes / server components)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
