# README: DPDP update install guide
## Package layout
- `UPLOAD-TO-GITHUB/` : only the files that changed or are new. Copy them into the **root** of the repository, replacing files with the same name.
- `KEEP-PRIVATE-DOCS/` : these five documents. **Do not upload them to the public repository** (they describe weaknesses).

## Files
**New:** `terms.html`, `data-rights.html`
**Replaced:** `privacy.html`, `contact.html`, `contact.js`, `review.js`, `script.js`, `style.css`, `sitemap.xml`, `index.html`, `about.html`, `books.html`, `book.html` (the last four only gain a footer line of policy links).
**Unchanged:** `config.js`, `admin.html`, `admin.js`, `admin-extras.js`, `book.js`, all images and docs.

## Deploying
1. In the GitHub repository choose Add file → Upload files, drag the contents of `UPLOAD-TO-GITHUB/` (not the folder itself), commit to `main`.
2. Wait about a minute for GitHub Pages, hard-refresh, then run the checklist below.
3. The repository is the source of truth: keep a copy of the old files (Git history keeps them).

## Reader accounts: decision needed
Today `book.html` does not load the Supabase library, so sign-up and reviews do not run. To switch them on later, after the backend checks, add `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4"></script>` (copy the exact tag from `contact.html`) before `config.js` in `book.html`. To pause them at any time set `ACCOUNTS_OPEN=false` at the top of `review.js`.

## Testing checklist and results
| # | Test | Result |
|---|---|---|
| 1 | Homepage loads | NOT TESTED (no browser available) |
| 2 | Book listings load | NOT TESTED (needs network/Supabase) |
| 3 | Book pages load | NOT TESTED |
| 4 | Contact validation | PASSED in logic test (fake page) |
| 5 | Contact submission | NOT TESTED against real Supabase; logic test confirmed only `name,email,body` are sent to `messages` |
| 6 | Privacy page opens | Static check only: file exists, links resolve; not opened in a browser |
| 7 | Terms page opens | Static check only |
| 8 | Data-rights page opens | Static check only; email-draft script not run in a browser |
| 9 | Registration restrictions | PASSED in logic test (blocked without 18+ and privacy ticks; generic errors). Not live: see "Reader accounts" |
| 10 | Approved reviews display | Logic test shows hostile text rendered as plain text; real display NOT TESTED |
| 11 | Review submission restrictions | Logic test: sends `status:'pending'`. **Server enforcement NOT VERIFIED** |
| 12 | Admin intact | Admin files unchanged (not run) |
| 13 | Navigation and footer links | Static check PASSED for all local links; footer policy links present on all 8 public pages |
| 14 | Mobile layout | NOT TESTED |
| 15 | Missing JS/CSS files | Static check PASSED: no missing local references; all JS passes `node --check` |
| 16 | Console errors | NOT TESTED |
| 17 | No secrets introduced | Scanned: only the publishable key; no service-role key. No `innerHTML` outside admin |
Your own tests after upload: open every page on a phone; send a test message from the contact page and see it in the admin Messages tab; confirm the unticked box blocks sending; click each footer link.

## Supabase tasks needing the parent's approval (not done by me)
- B1 Row Level Security **on** for every table (`messages`, `reviews`, `books`, categories, admin list).
- B2 `reviews`: readers may insert only with `user_id = auth.uid()`, `status = 'pending'`, rating 1 to 5; no reader update/delete; public can read only `approved` rows and never emails.
- B3 `messages`: public insert only; **no** select/update/delete except admins. Add length limits on columns if missing.
- B4 Admin-only tables and functions (`is_admin`): confirm only the intended accounts are admins; turn on two-step verification for them.
- B5 Auth: email confirmation on; password strength/leaked-password check; rate limits or CAPTCHA for sign-up and sign-in.
- B6 Decide: keep Auth sign-ups enabled or disabled while accounts are off (they can be called without the website).
- B7 Dashboard access list: only the parent and authorised family member.
- B8 Storage buckets: public or private; no personal files in public buckets.
- B9 Note the project region (cross-border transfer) and backup/log retention.
- B10 Check whether deleting a user also removes their reviews.
Also recommended later: a Content-Security-Policy and an integrity hash on the jsDelivr script (not done: untested and could break the site).
