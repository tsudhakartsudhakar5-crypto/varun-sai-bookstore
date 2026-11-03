# VARUN SAI BOOKSTORE: how it works

## The big picture
- **Website (GitHub Pages):** plain HTML, CSS and JavaScript files in the repo root. Anyone can see these files, so they never contain secrets.
- **Backend (Supabase):** the database, logins and file storage. Security rules inside the database decide who can read or change what.

## Files
| File | What it does |
|---|---|
| index.html, books.html, about.html, contact.html | Public pages |
| book.html + book.js | One page per book (`book.html?b=the-time-changes`) |
| review.js | Reader sign-in and reviews on the book page |
| script.js | Menu, catalogue, search. Has a backup book list at the top |
| contact.js | Sends contact messages to the database |
| config.js | Public Supabase address and publishable key (safe to be public) |
| admin.html, admin.js, admin-extras.js | Author dashboard |
| style.css | All styling (charcoal #171717, gold #D4AF37) |
| robots.txt, sitemap.xml, favicon.svg | Search engines and browser icon |
| supabase/001_schema.sql | Database tables and security rules (already applied) |

## Everyday tasks
- **Add or edit a book:** sign in at `/admin.html`, Books tab. Tick "Published" to show it on the site.
- **Add a retailer link:** edit the book in the dashboard and fill in the Amazon or Pothi field.
- **Approve a review:** Reviews tab, Approve (shows on the site) or Hide.
- **Read messages:** Messages tab.

## Security rules (important)
1. Only the **publishable** key may appear in website files. Never the service-role key, never a password.
2. Only accounts listed in the `admins` table can change books, read messages or moderate reviews. The database enforces this, not just the page.
3. Paid eBooks go in the private `ebooks` bucket only. Never upload them to GitHub.
4. Reviews stay hidden until approved.

## Not built yet
- Payments, orders and secure eBook downloads. These need a server function that verifies each payment with the gateway. **Do not switch on real payments without a parent or guardian's approval.**
- Newsletter (needs a real email service).
- Pothi link for *Learn It. Build It. Master It.* (waiting for the exact link).
