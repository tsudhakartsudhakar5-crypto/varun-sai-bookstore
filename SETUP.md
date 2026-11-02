# VARUN SAI BOOKSTORE: setup guide

## 1. Put the site online (works today)
1. Upload every file in this folder to the **root** of your `varun-sai-bookstore` repo (keep `style.css` and `script.js` next to the HTML files). Replace the old files.
2. Settings > Pages > Deploy from a branch > `main` > `/ (root)`.
3. Open https://tsudhakartsudhakar5-crypto.github.io/varun-sai-bookstore/

## 2. Things only you can confirm
- **Pothi link for The Time Changes:** I used the link from your brief (`.../ebook-thipparapu-varun-sai-the-time-changes/`). Your personal site uses a different one (`.../thipparapu-varun-sai-the-time-changes-1/`). Open both, keep the one that works.
- **Amazon link** (`amzn.in/d/0bx8LoKo`): confirm it opens the right book.
- **Learn It. Build It. Master It.:** Amazon and Pothi buttons show "coming soon" until you send the exact links. Edit them in `script.js` (the `BOOKS` list at the top).
- Add page counts, descriptions and prices only when confirmed.

## 3. Backend (not connected yet, so nothing below works live)
1. Create a free project at supabase.com.
2. SQL Editor > paste `supabase/001_schema.sql` > Run.
3. Authentication > create your own user (email + strong password; turn on 2-step login if offered).
4. Make yourself the admin: run `insert into admins(user_id) select id from auth.users where email='YOUR EMAIL';`
5. Only the **anon/public** key may ever go in website files. **Never** put the service-role key in this repo.

## 4. Still to build (needs the backend first)
Admin dashboard pages, book detail pages, reviews and message screens, and payments. Payments need a server function that verifies each payment with the gateway before marking an order paid and creating a short-lived download link for the private eBook. Do not switch on real payments without your parent or guardian's approval.

## 5. Admin dashboard (admin.html)
Open `/admin.html` on your site. Sign in with the Supabase user you created. Only accounts listed in the `admins` table can use it; every action is also enforced by database security rules, not just by this page.
- Contact form now saves messages to the database; only the admin can read them.
- The publishable key in `config.js` is meant to be public. Never add the service-role key.
- Not built yet: showing database books on the public Books page, orders and payments.
