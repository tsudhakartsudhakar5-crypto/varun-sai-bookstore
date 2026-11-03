/*
  VARUN SAI BOOKSTORE — Supabase configuration
  Public values only (project URL + publishable key starting sb_publishable_).
  Never put a service_role key or secret key in this file.
*/
// Used by the public pages (Books, book details, contact, reviews).
window.SB_URL = "https://vdcdtildrgdsszqnecgl.supabase.co";
window.SB_KEY = "sb_publishable_Vy3aV6UkEZNdbKzn-htlhw_DM2AXm5M";

// Used by the admin panel (unchanged from your upgraded version).
(() => {
  const SUPABASE_URL = window.SB_URL;
  const SUPABASE_PUBLISHABLE_KEY = window.SB_KEY;

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    // On public pages the library loads after this file, so this is expected there.
    window.supabaseConfigError = "The Supabase library did not load. Check your internet connection and CDN script.";
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
