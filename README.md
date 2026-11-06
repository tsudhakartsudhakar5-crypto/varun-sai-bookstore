# VARUN SAI BOOKSTORE

The official digital bookstore of author Varun Sai. Quality defeats quantity.

**Live site:** https://tsudhakartsudhakar5-crypto.github.io/varun-sai-bookstore/

## What it does today
- Shows the author's books with covers, descriptions and links to buy on Amazon and Pothi
- Search and category filter, and a detail page for each book
- Reader accounts and reviews (reviews appear only after the author approves them)
- Contact form that sends messages to the author's private inbox
- Author dashboard (`admin.html`) for books, uploads, messages and review moderation
- Privacy Policy page

## What it does not do yet
Direct eBook sales and payments are not built. They are planned for later.

## Built with
Plain HTML, CSS and JavaScript on GitHub Pages, with Supabase for the database, sign-in and file storage. Design: charcoal `#171717`, gold `#D4AF37`, Playfair Display and DM Sans.

## Security
- Only the public (publishable) Supabase key is in this repo. Never add a service-role key, password or paid eBook file.
- Database security rules decide who can read or change data. Only the admin account can manage books, messages and reviews.

## More
See `DOCUMENTATION.md` for how the files work and everyday tasks.

Operated by Thipparapu Sujatha on behalf of the author, Varun Sai.
