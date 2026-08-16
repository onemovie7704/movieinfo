export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes("your-project") &&
    !supabasePublishableKey.includes("your-publishable-key")
);
