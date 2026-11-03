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

    new MutationObserver(enhance).observe(view, { childList: true, subtree: true });
    enhance();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
