/* Admin add-on. Works with your admin.js without changing it.
   Adds: cover/eBook uploads (type + size checked), slug check, "Add category", and fixes the Reject button. */
(() => {
  const start = () => {
    const view = document.getElementById("view"), msg = document.getElementById("msg");
    if (!view || !msg) return;
    const say = t => { msg.hidden = false; msg.textContent = t; };
    const db = () => window.supabaseClient;

    function enhance() {
      // The reviews table only allows pending / approved / hidden, so "rejected" would fail.
      view.querySelectorAll('[data-status="rejected"]').forEach(b => { b.dataset.status = "hidden"; b.textContent = "Hide"; });

      const f = document.getElementById("book-form");
      if (!f || f.dataset.x) return;
      f.dataset.x = "1";
      const addFile = (after, id, label, accept) => {
        const l = document.createElement("label"); l.htmlFor = id; l.textContent = label;
        const i = document.createElement("input"); i.type = "file"; i.id = id; i.accept = accept;
        after.after(l, i);
      };
      addFile(f.elements.cover_path, "up-cover", "Or upload a cover (JPG, PNG or WebP, max 2 MB)", "image/jpeg,image/png,image/webp");
      addFile(f.elements.ebook_path, "up-ebook", "Or upload the eBook (PDF or EPUB, max 50 MB, kept private)", ".pdf,.epub");

      const sel = f.elements.category_id, inp = document.createElement("input"), btn = document.createElement("button");
      inp.placeholder = "New category name"; inp.maxLength = 60;
      inp.addEventListener("keydown", e => { if (e.key === "Enter") e.preventDefault(); });
      btn.type = "button"; btn.className = "btn ghost"; btn.textContent = "Add category";
      btn.addEventListener("click", async () => {
        const name = inp.value.trim(); if (!name) return;
        const r = await db().from("categories").insert({ name }).select().single();
        if (r.error) return say("Could not add category: " + r.error.message);
        sel.add(new Option(r.data.name, r.data.id)); sel.value = r.data.id; inp.value = ""; say("Category added.");
      });
      sel.after(inp, btn);
    }

    // Runs before your admin.js save handler: checks the slug, uploads files, then lets the save continue.
    view.addEventListener("submit", async e => {
      const f = e.target;
      if (f.id !== "book-form" || f.dataset.go) return;
      e.preventDefault(); e.stopImmediatePropagation();
      const slug = f.elements.slug.value.trim();
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return say("Slug may only use lowercase letters, numbers and single dashes, like the-time-changes.");
      const cf = document.getElementById("up-cover").files[0], ef = document.getElementById("up-ebook").files[0];
      const btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
      try {
        if (cf) {
          if (!["image/jpeg", "image/png", "image/webp"].includes(cf.type) || cf.size > 2097152) throw new Error("Cover must be a JPG, PNG or WebP image under 2 MB.");
          const p = `${slug}-${Date.now()}.${cf.type.split("/")[1].replace("jpeg", "jpg")}`;
          const r = await db().storage.from("covers").upload(p, cf, { contentType: cf.type }); if (r.error) throw r.error;
          f.elements.cover_path.value = db().storage.from("covers").getPublicUrl(p).data.publicUrl;
        }
        if (ef) {
          const ext = ef.name.split(".").pop().toLowerCase();
          if (!["pdf", "epub"].includes(ext) || ef.size > 52428800) throw new Error("eBook must be a PDF or EPUB under 50 MB.");
          const p = `${slug}-${Date.now()}.${ext}`;
          const r = await db().storage.from("ebooks").upload(p, ef, { contentType: ext === "pdf" ? "application/pdf" : "application/epub+zip" }); if (r.error) throw r.error;
          f.elements.ebook_path.value = p; // stays in the private bucket; never made public
        }
        f.dataset.go = "1"; f.requestSubmit(); delete f.dataset.go;
      } catch (err) { say("Upload failed: " + err.message); }
      finally { btn.disabled = false; }
    }, true);

    // ---- 4th tab: Upcoming publications ----
    const mk = (t, p, k) => { const e = document.createElement(t); Object.assign(e, p || {}); [].concat(k || []).forEach(c => e.append(c)); return e; };
    const tabs = document.querySelectorAll("[data-t]");
    if (tabs.length && !document.getElementById("tab-upcoming")) {
      const tb = mk("button", { id: "tab-upcoming", type: "button", className: "btn ghost", textContent: "Upcoming" });
      tb.dataset.u = "1"; tabs[tabs.length - 1].after(tb);
      let editing = null;
      const up = async () => {
        document.querySelectorAll("[data-t]").forEach(b => { const on = b.id === "tab-upcoming"; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", String(on)); });
        msg.hidden = true; view.replaceChildren(mk("p", { className: "note", textContent: "Loading…" }));
        const r = await db().from("upcoming_books").select("*").order("sort_order").order("created_at");
        if (r.error) { view.replaceChildren(); return say("Could not load upcoming publications: " + r.error.message); }
        const rows = r.data || [], F = mk("form", { id: "up-form" }), v = {};
        F.append(mk("h2", { textContent: editing ? "Edit upcoming book" : "Add an upcoming book" }));
        const fld = (k, label, tag, attrs) => { const i = mk(tag || "input", Object.assign({ id: "u-" + k }, attrs || {})); v[k] = i; F.append(mk("label", { htmlFor: "u-" + k, textContent: label }), i); };
        fld("title", "Title *", "input", { maxLength: 200, required: true });
        fld("subtitle", "Subtitle", "input", { maxLength: 200 });
        fld("series", "Series line (for example: Part 2 of The Unknown Truth)", "input", { maxLength: 200 });
        fld("release_date", "Release date", "input", { type: "date" });
        fld("description", "Description", "textarea", { rows: 4, maxLength: 3000 });
        fld("cover_url", "Cover image URL (optional)", "input", { maxLength: 1000 });
        fld("cover_file", "Or upload a cover (JPG, PNG or WebP, max 2 MB)", "input", { type: "file", accept: "image/jpeg,image/png,image/webp" });
        fld("sort_order", "Order on the page (0 shows first)", "input", { type: "number", value: "0" });
        v.published = mk("input", { type: "checkbox", checked: true }); F.append(mk("label", {}, [v.published, " Show on the website"]));
        const save = mk("button", { className: "btn", type: "submit", textContent: editing ? "Save changes" : "Add upcoming book" });
        F.append(mk("p", {}, [save, " ", editing ? mk("button", { className: "btn ghost", type: "button", textContent: "Cancel edit", onclick: () => { editing = null; up(); } }) : ""]));
        if (editing) { const e = rows.find(x => x.id === editing); if (e) { ["title", "subtitle", "series", "release_date", "description", "cover_url"].forEach(k => v[k].value = e[k] || ""); v.sort_order.value = e.sort_order; v.published.checked = e.published; } }
        F.addEventListener("submit", async ev => {
          ev.preventDefault(); save.disabled = true;
          try {
            let cover = v.cover_url.value.trim() || null; const cf = v.cover_file.files[0];
            if (cf) {
              if (!["image/jpeg", "image/png", "image/webp"].includes(cf.type) || cf.size > 2097152) throw new Error("Cover must be a JPG, PNG or WebP image under 2 MB.");
              const p = `upcoming-${Date.now()}.${cf.type.split("/")[1].replace("jpeg", "jpg")}`;
              const u = await db().storage.from("covers").upload(p, cf, { contentType: cf.type }); if (u.error) throw u.error;
              cover = db().storage.from("covers").getPublicUrl(p).data.publicUrl;
            }
            if (cover && !/^https?:\/\//.test(cover)) throw new Error("Cover URL must start with https://");
            const d = { title: v.title.value.trim(), subtitle: v.subtitle.value.trim() || null, series: v.series.value.trim() || null,
              release_date: v.release_date.value || null, description: v.description.value.trim() || null, cover_url: cover,
              sort_order: parseInt(v.sort_order.value, 10) || 0, published: v.published.checked };
            if (!d.title) throw new Error("Title is required.");
            const q = editing ? db().from("upcoming_books").update(d).eq("id", editing) : db().from("upcoming_books").insert(d), x = await q;
            if (x.error) throw x.error;
            editing = null; await up(); say("Saved. The website shows it within a minute.");
          } catch (er) { say("Could not save: " + er.message); save.disabled = false; }
        });
        const L = mk("div");
        rows.forEach(b => L.append(mk("div", { className: "note", style: "margin-bottom:12px" }, [
          mk("b", { textContent: b.title + (b.published ? " (shown)" : " (hidden)") }),
          mk("p", { className: "muted", textContent: [b.series, b.release_date].filter(Boolean).join(" · ") }),
          mk("button", { className: "btn ghost", type: "button", textContent: "Edit", onclick: () => { editing = b.id; up().then(() => scrollTo(0, 0)); } }), " ",
          mk("button", { className: "btn ghost", type: "button", textContent: b.published ? "Hide" : "Show", onclick: async () => { await db().from("upcoming_books").update({ published: !b.published }).eq("id", b.id); up(); } }), " ",
          mk("button", { className: "btn ghost", type: "button", textContent: "Delete", onclick: async () => { if (!confirm("Delete this upcoming book? This cannot be undone.")) return; const x = await db().from("upcoming_books").delete().eq("id", b.id); x.error ? say("Could not delete: " + x.error.message) : up(); } })
        ])));
        view.replaceChildren(mk("h2", { textContent: "Upcoming publications (" + rows.length + ")" }), rows.length ? L : mk("p", { className: "muted", textContent: "None yet." }), F);
      };
      tb.addEventListener("click", up);
    }

    new MutationObserver(enhance).observe(view, { childList: true, subtree: true });
    enhance();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
