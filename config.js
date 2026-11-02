/*
  VARUN SAI BOOKSTORE — Supabase configuration
  Replace the placeholder below with your Supabase PROJECT URL and
  publishable key (the key beginning with sb_publishable_).
  Never put a service_role key or secret key in this file.
*/
(() => {
  const SUPABASE_URL = "https://vdcdtildrgdsszqnecgl.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Vy3aV6UkEZNdbKzn-htlhw_DM2AXm5M";

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase JS library did not load.");
    window.supabaseConfigError = "The Supabase library did not load. Check your internet connection and CDN script.";
    return;
  }

  if (!SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY.includes("PASTE_")) {
    window.supabaseConfigError = "Add your Supabase publishable key in config.js.";
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );
})();
