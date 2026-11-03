/* VARUN SAI BOOKSTORE — Admin dashboard
   Uses the existing Supabase tables and their existing RLS policies.
   No service-role key belongs in browser code.
*/
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const loginSection = $("#login");
  const appSection = $("#app");
  const loginForm = $("#lf");
  const emailInput = $("#em");
  const passwordInput = $("#pw");
  const messageBox = $("#msg");
  const view = $("#view");
  const signOutButton = $("#out");

  let db = null;
  let activeTab = "books";
  let editingBookId = null;

  function showMessage(message, type = "info") {
    messageBox.hidden = false;
    messageBox.textContent = message;
    messageBox.dataset.type = type;
    messageBox.classList.toggle("error", type === "error");
    messageBox.classList.toggle("success", type === "success");
  }

  function clearMessage() {
    messageBox.hidden = true;
    messageBox.textContent = "";
    messageBox.classList.remove("error", "success");
    delete messageBox.dataset.type;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
  }

  function setLoggedIn(isLoggedIn) {
    loginSection.hidden = isLoggedIn;
    appSection.hidden = !isLoggedIn;
    signOutButton.hidden = !isLoggedIn;
  }

  async function verifyAdmin() {
    const { data: { session }, error: sessionError } = await db.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) return false;

    const { data, error } = await db.rpc("is_admin");
    if (error) {
      throw new Error("Could not verify administrator permission: " + error.message);
    }
    return data === true;
  }

  async function handleSession() {
    clearMessage();
    try {
      const isAdmin = await verifyAdmin();
      if (!isAdmin) {
        setLoggedIn(false);
        showMessage("This account is signed in but is not authorized as a bookstore administrator. Check the admin record and try again.", "error");
        return;
      }
      setLoggedIn(true);
      await loadTab(activeTab);
    } catch (error) {
      setLoggedIn(false);
      showMessage(error.message || "Unable to verify your administrator session.", "error");
    }
  }

  async function signIn(event) {
    event.preventDefault();
    clearMessage();

    if (!db) {
      showMessage(window.supabaseConfigError || "Supabase is not configured. Check config.js.", "error");
      return;
    }

    const button = loginForm.querySelector('button[type="submit"], button:not([type])');
    if (button) {
      button.disabled = true;
      button.textContent = "Signing in…";
    }

    try {
      const { error } = await db.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passwordInput.value
      });
      if (error) throw error;

      const isAdmin = await verifyAdmin();
      if (!isAdmin) {
        await db.auth.signOut();
        throw new Error("Login succeeded, but this account does not have administrator permission.");
      }

      passwordInput.value = "";
      setLoggedIn(true);
      showMessage("Signed in successfully.", "success");
      await loadTab(activeTab);
    } catch (error) {
      showMessage(error.message || "Sign-in failed.", "error");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Sign in";
      }
    }
  }

  async function signOut() {
    if (!db) return;
    const { error } = await db.auth.signOut();
    if (error) {
      showMessage("Sign-out failed: " + error.message, "error");
      return;
    }
    view.innerHTML = "";
    setLoggedIn(false);
    loginForm.reset();
    showMessage("You have signed out.", "success");
  }

  async function loadTab(tab) {
    activeTab = tab;
    clearMessage();
    view.innerHTML = '<p class="note">Loading…</p>';

    document.querySelectorAll("[data-t]").forEach(button => {
      const selected = button.dataset.t === tab;
      button.classList.toggle("ghost", !selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    try {
      if (tab === "books") await renderBooks();
      else if (tab === "messages") await renderMessages();
      else if (tab === "reviews") await renderReviews();
      else view.textContent = "Unknown dashboard section.";
    } catch (error) {
      view.innerHTML = "";
      showMessage("Could not load " + tab + ": " + (error.message || error), "error");
    }
  }

  async function getCategories() {
    const { data, error } = await db.from("categories").select("id,name").order("name");
    if (error) throw error;
    return data || [];
  }

  async function renderBooks() {
    const [{ data: books, error }, categories] = await Promise.all([
      db.from("books").select("*").order("created_at", { ascending: false }),
      getCategories()
    ]);
    if (error) throw error;

    const categoryOptions = categories.map(category =>
      `<option value="${category.id}">${escapeHtml(category.name)}</option>`
    ).join("");

    view.innerHTML = `
      <section class="admin-panel">
        <h2 id="book-form-heading">${editingBookId ? "Edit book" : "Add a book"}</h2>
        <form id="book-form">
          <label for="b-title">Title *</label>
          <input id="b-title" name="title" required maxlength="200">
          <label for="b-slug">Slug *</label>
          <input id="b-slug" name="slug" required maxlength="200" placeholder="my-book">
          <label for="b-subtitle">Subtitle</label>
          <input id="b-subtitle" name="subtitle">
          <label for="b-description">Description</label>
          <textarea id="b-description" name="description" rows="5"></textarea>
          <label for="b-category">Category</label>
          <select id="b-category" name="category_id">
            <option value="">No category</option>${categoryOptions}
          </select>
          <label for="b-pages">Pages</label>
          <input id="b-pages" name="pages" type="number" min="1">
          <label for="b-price">Price (₹)</label>
          <input id="b-price" name="price" type="number" min="0" step="0.01">
          <label for="b-cover">Cover path / image URL</label>
          <input id="b-cover" name="cover_path" placeholder="https://… or storage path">
          <label for="b-ebook">eBook path / file URL</label>
          <input id="b-ebook" name="ebook_path" placeholder="Storage path or URL">
          <label for="b-amazon">Amazon URL</label>
          <input id="b-amazon" name="amazon_url" type="url">
          <label for="b-pothi">Pothi URL</label>
          <input id="b-pothi" name="pothi_url" type="url">
          <label><input name="published" type="checkbox"> Published (visible to public)</label>
          <p>
            <button class="btn" type="submit">${editingBookId ? "Save changes" : "Add book"}</button>
            <button class="btn ghost" type="button" id="cancel-book-edit" ${editingBookId ? "" : "hidden"}>Cancel edit</button>
          </p>
        </form>
      </section>
      <section class="admin-panel">
        <h2>Books (${books.length})</h2>
        ${books.length ? `<div class="admin-list">${books.map(book => `
          <article class="admin-item">
            <h3>${escapeHtml(book.title)}</h3>
            <p>${escapeHtml(book.slug)} · ${book.published ? "Published" : "Draft"} · ${book.price_paise == null ? "No price" : "₹" + (book.price_paise / 100).toFixed(2)}</p>
            <button class="btn ghost" data-edit-book="${book.id}" type="button">Edit</button>
            <button class="btn ghost" data-toggle-book="${book.id}" data-published="${book.published}" type="button">${book.published ? "Unpublish" : "Publish"}</button>
            <button class="btn ghost" data-delete-book="${book.id}" type="button">Delete</button>
          </article>`).join("")}</div>` : "<p>No books found.</p>"}
      </section>`;

    const form = $("#book-form");
    form.addEventListener("submit", saveBook);
    $("#cancel-book-edit").addEventListener("click", () => {
      editingBookId = null;
      renderBooks().catch(showRenderError);
    });

    view.querySelectorAll("[data-edit-book]").forEach(button => {
      button.addEventListener("click", () => {
        const book = books.find(item => item.id === button.dataset.editBook);
        if (book) fillBookForm(book);
      });
    });
    view.querySelectorAll("[data-toggle-book]").forEach(button => {
      button.addEventListener("click", () => toggleBook(button.dataset.toggleBook, button.dataset.published === "true"));
    });
    view.querySelectorAll("[data-delete-book]").forEach(button => {
      button.addEventListener("click", () => deleteBook(button.dataset.deleteBook));
    });

    if (editingBookId) {
      const selected = books.find(item => item.id === editingBookId);
      if (selected) fillBookForm(selected);
      else editingBookId = null;
    }
  }

  function fillBookForm(book) {
    editingBookId = book.id;
    const form = $("#book-form");
    if (!form) return;
    $("#book-form-heading").textContent = "Edit book";
    form.elements.title.value = book.title || "";
    form.elements.slug.value = book.slug || "";
    form.elements.subtitle.value = book.subtitle || "";
    form.elements.description.value = book.description || "";
    form.elements.category_id.value = book.category_id ?? "";
    form.elements.pages.value = book.pages ?? "";
    form.elements.price.value = book.price_paise == null ? "" : (book.price_paise / 100).toFixed(2);
    form.elements.cover_path.value = book.cover_path || "";
    form.elements.ebook_path.value = book.ebook_path || "";
    form.elements.amazon_url.value = book.amazon_url || "";
    form.elements.pothi_url.value = book.pothi_url || "";
    form.elements.published.checked = !!book.published;
    form.querySelector('button[type="submit"]').textContent = "Save changes";
    $("#cancel-book-edit").hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveBook(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const f = form.elements;
    const rupees = f.price.value.trim();
    const payload = {
      title: f.title.value.trim(),
      slug: f.slug.value.trim(),
      subtitle: f.subtitle.value.trim() || null,
      description: f.description.value.trim() || null,
      category_id: f.category_id.value ? Number(f.category_id.value) : null,
      pages: f.pages.value ? Number(f.pages.value) : null,
      price_paise: rupees === "" ? null : Math.round(Number(rupees) * 100),
      cover_path: f.cover_path.value.trim() || null,
      ebook_path: f.ebook_path.value.trim() || null,
      amazon_url: f.amazon_url.value.trim() || null,
      pothi_url: f.pothi_url.value.trim() || null,
      published: f.published.checked
    };

    if (!payload.title || !payload.slug) {
      showMessage("Title and slug are required.", "error");
      return;
    }
    if (payload.pages !== null && (!Number.isInteger(payload.pages) || payload.pages < 1)) {
      showMessage("Pages must be a positive whole number.", "error");
      return;
    }
    if (payload.price_paise !== null && (!Number.isFinite(payload.price_paise) || payload.price_paise < 0)) {
      showMessage("Enter a valid non-negative price.", "error");
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    try {
      const query = editingBookId
        ? db.from("books").update(payload).eq("id", editingBookId)
        : db.from("books").insert(payload);
      const { error } = await query;
      if (error) throw error;
      editingBookId = null;
      showMessage("Book saved successfully.", "success");
      await renderBooks();
    } catch (error) {
      showMessage("Could not save book: " + error.message, "error");
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  async function toggleBook(id, currentlyPublished) {
    const { error } = await db.from("books").update({ published: !currentlyPublished }).eq("id", id);
    if (error) return showMessage("Could not update publication status: " + error.message, "error");
    showMessage(currentlyPublished ? "Book unpublished." : "Book published.", "success");
    await renderBooks();
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book? This cannot be undone.")) return;
    const { error } = await db.from("books").delete().eq("id", id);
    if (error) return showMessage("Could not delete book: " + error.message, "error");
    showMessage("Book deleted.", "success");
    await renderBooks();
  }

  async function renderMessages() {
    const { data, error } = await db.from("messages").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    view.innerHTML = `<section class="admin-panel"><h2>Messages (${data.length})</h2>
      ${data.length ? `<div class="admin-list">${data.map(item => `
        <article class="admin-item">
          <h3>${escapeHtml(item.name)} ${item.read ? '<small>· Read</small>' : '<small>· Unread</small>'}</h3>
          <p><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a> · ${escapeHtml(formatDate(item.created_at))}</p>
          <p>${escapeHtml(item.body).replace(/\n/g, "<br>")}</p>
          ${!item.read ? `<button class="btn ghost" data-read-message="${item.id}" type="button">Mark as read</button>` : ""}
        </article>`).join("")}</div>` : "<p>No messages yet.</p>"}
      </section>`;
    view.querySelectorAll("[data-read-message]").forEach(button => {
      button.addEventListener("click", async () => {
        const { error: updateError } = await db.from("messages").update({ read: true }).eq("id", button.dataset.readMessage);
        if (updateError) return showMessage("Could not mark message as read: " + updateError.message, "error");
        showMessage("Message marked as read.", "success");
        await renderMessages();
      });
    });
  }

  async function renderReviews() {
    const { data, error } = await db.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    view.innerHTML = `<section class="admin-panel"><h2>Reviews (${data.length})</h2>
      ${data.length ? `<div class="admin-list">${data.map(item => `
        <article class="admin-item">
          <h3>${"★".repeat(Math.max(0, Math.min(5, Number(item.rating) || 0)))} · ${escapeHtml(item.status)}</h3>
          <p>Book ID: ${escapeHtml(item.book_id)} · User ID: ${escapeHtml(item.user_id)}</p>
          <p>${escapeHtml(item.body || "No written review")}</p>
          <label for="reply-${item.id}">Author reply</label>
          <textarea id="reply-${item.id}" rows="3">${escapeHtml(item.author_reply || "")}</textarea>
          <p>
            <button class="btn ghost" data-review-status="${item.id}" data-status="approved" type="button">Approve</button>
            <button class="btn ghost" data-review-status="${item.id}" data-status="rejected" type="button">Reject</button>
            <button class="btn" data-review-reply="${item.id}" type="button">Save reply</button>
            <button class="btn ghost" data-delete-review="${item.id}" type="button">Delete</button>
          </p>
        </article>`).join("")}</div>` : "<p>No reviews yet.</p>"}
      </section>`;

    view.querySelectorAll("[data-review-status]").forEach(button => {
      button.addEventListener("click", async () => {
        const { error: updateError } = await db.from("reviews")
          .update({ status: button.dataset.status }).eq("id", button.dataset.reviewStatus);
        if (updateError) return showMessage("Could not moderate review: " + updateError.message, "error");
        showMessage("Review status updated.", "success");
        await renderReviews();
      });
    });

    view.querySelectorAll("[data-review-reply]").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.reviewReply;
        const reply = $("#reply-" + CSS.escape(id)).value.trim();
        const { error: updateError } = await db.from("reviews").update({ author_reply: reply || null }).eq("id", id);
        if (updateError) return showMessage("Could not save reply: " + updateError.message, "error");
        showMessage("Author reply saved.", "success");
        await renderReviews();
      });
    });

    view.querySelectorAll("[data-delete-review]").forEach(button => {
      button.addEventListener("click", async () => {
        if (!window.confirm("Delete this review permanently?")) return;
        const { error: deleteError } = await db.from("reviews").delete().eq("id", button.dataset.deleteReview);
        if (deleteError) return showMessage("Could not delete review: " + deleteError.message, "error");
        showMessage("Review deleted.", "success");
        await renderReviews();
      });
    });
  }

  function showRenderError(error) {
    showMessage(error.message || String(error), "error");
  }

  function init() {
    if (window.supabaseConfigError) {
      showMessage(window.supabaseConfigError, "error");
      return;
    }
    if (!window.supabaseClient) {
      showMessage("Supabase client is missing. Check config.js and the Supabase CDN script.", "error");
      return;
    }

    db = window.supabaseClient;
    loginForm.addEventListener("submit", signIn);
    signOutButton.addEventListener("click", signOut);
    document.querySelectorAll("[data-t]").forEach(button => {
      button.addEventListener("click", () => loadTab(button.dataset.t));
    });

    db.auth.onAuthStateChange((_event, _session) => {
      // Defer database work until after the auth callback completes.
      window.setTimeout(() => handleSession(), 0);
    });
     document.head.appendChild(Object.assign(document.createElement("script"), { src: "admin-extras.js" }));

    handleSession();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
