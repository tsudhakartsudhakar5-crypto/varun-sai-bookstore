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

// Upcoming publications on public pages: shows the list managed in the admin panel
// (Upcoming tab). If the list is empty or cannot be loaded, the page is left as it is.
document.addEventListener("DOMContentLoaded", () => {
  const h = [].filter.call(document.querySelectorAll("h2"), x => /upcoming/i.test(x.textContent))[0];
  if (!h) return;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 6000);
  fetch(SB_URL + "/rest/v1/upcoming_books?select=*&published=eq.true&order=sort_order.asc,created_at.asc",
    { headers: { apikey: SB_KEY }, signal: ac.signal })
    .then(r => { clearTimeout(tm); return r.ok ? r.json() : []; })
    .then(rows => {
      if (!rows.length) return;
      while (h.nextSibling) h.nextSibling.remove();
      const g = el("div", "grid");
      rows.forEach(b => {
        const a = el("article", "card"), body = el("div", "body");
        if (/^https?:\/\//.test(b.cover_url || "")) {
          const i = el("img"); i.src = b.cover_url; i.alt = "Cover of " + b.title + " by Varun Sai"; i.loading = "lazy";
          i.style.cssText = "width:100%;aspect-ratio:3/4;object-fit:cover;display:block;border-bottom:3px solid #D4AF37";
          a.append(i);
        } else {
          const c = el("div", "cover"); c.setAttribute("role", "img"); c.setAttribute("aria-label", "Cover of " + b.title + " by Varun Sai");
          c.append(el("small", 0, b.subtitle || "Coming soon"), el("b", 0, b.title), el("small", 0, "Varun Sai")); a.append(c);
        }
        body.append(el("h3", 0, b.title), el("p", "tag", b.series || "Coming soon"));
        if (b.subtitle) body.append(el("p", 0, b.subtitle));
        const d = b.release_date ? new Date(b.release_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
        body.append(el("p", 0, d ? "Releasing " + d : "Release date to be announced"));
        if (b.description) { const p = el("p", "muted", b.description); p.style.whiteSpace = "pre-line"; body.append(p); }
        a.append(body); g.append(a);
      });
      h.after(g);
    })
    .catch(() => {});
});
