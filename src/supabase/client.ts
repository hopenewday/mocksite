import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error("Supabase URL and anonymous key are required.");
}

export const supabase: SupabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
