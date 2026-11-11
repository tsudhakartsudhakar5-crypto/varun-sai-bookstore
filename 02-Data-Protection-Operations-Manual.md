# VARUN SAI BOOKSTORE
## Data Protection & Privacy Operations Manual

**Version:** 1.0 — internal draft  
**Prepared:** 11 November 2026  
**Privacy contact:** tsudhakartsudhakar5@gmail.com

## 1. Scope
This manual covers the separate VARUN SAI BOOKSTORE website and its contact-message workflow. Do not combine its records, credentials or registers with the author website.

## 2. Roles
- **Responsible operator:** parent/guardian or authorised business representative managing the bookstore.
- **Administrator:** individually authorised person with access to the admin panel and backend.
- **Service providers:** hosting and backend providers.

Limit private-message access to authorised administrators. Do not share passwords or service-role credentials.

## 3. Current data inventory

| Feature | Known/possible data | Purpose | Verification |
|---|---|---|---|
| Public browsing | Technical request/provider metadata | Deliver pages, security, troubleshooting | Provider logs not inspected |
| Contact form | Name, email, message/body | Respond to enquiries | Source code reviewed |
| Admin panel | Authentication/session data | Manage catalogue/content/messages | Live auth not tested |
| Catalogue | Book metadata and cover assets | Display books | Source archive reviewed |
| External retailer links | Data collected by external retailer | Retailer transaction | Outside bookstore backend; provider policy applies |
| Orders/payments | Not established as active | Do not claim checkout/payment collection | Must verify before adding feature |

## 4. Contact workflow
The reviewed contact form JavaScript submits `name`, `email` and `body` to the Supabase `messages` table. Operational procedure:
1. Receive and review the message through the authorised admin workflow.
2. Use the email only to respond to the enquiry.
3. Avoid copying message content into unrelated documents or spreadsheets.
4. Mark the enquiry resolved when complete.
5. Review old records for deletion under the adopted retention schedule.

The current RLS policy expressions and table grants were not supplied for this bookstore audit. Do not assume that author-site controls also apply to the bookstore.

## 5. Proposed retention schedule
These are internal proposed review targets, not statutory deadlines:
- Resolved contact messages: review for deletion within 12 months.
- Unresolved messages: retain while needed to resolve the request.
- Spam/test messages: delete as soon as practical.
- Security/provider logs: confirm provider retention and document it.

Check backups and provider-side retention before promising permanent or immediate deletion.

## 6. Privacy requests
1. Receive request at tsudhakartsudhakar5@gmail.com.
2. Record date and request category.
3. Verify enough information to locate the message without excessive identity collection.
4. Locate the record in the admin/backend system.
5. Assess legal and operational retention needs.
6. Carry out correction/deletion where appropriate, or explain the reason it cannot be done.
7. Record the outcome.

Suggested internal targets: acknowledge within 3 working days and aim to resolve within 30 days. These are proposed service targets, not statutory deadlines.

## 7. Security incident response
- Preserve relevant evidence and timestamps.
- Restrict compromised accounts or credentials.
- Notify the responsible operator.
- Identify systems and data categories potentially affected.
- Obtain provider and legal advice on applicable notifications.
- Document containment, remediation and lessons learned.
- Do not delete incident evidence prematurely.

## 8. Administrator security
- Use individual administrator accounts.
- Use strong unique passwords and MFA where available.
- Remove former administrators promptly.
- Do not expose service-role keys or database credentials in frontend code.
- Review RLS, table grants, RPC functions, storage policies and admin membership.
- Test that anonymous and non-admin users cannot read or modify private messages or admin data.

## 9. Provider register
Known providers include GitHub Pages and Supabase. Verify whether the deployed website uses additional analytics, email, embeds, CDN, font or other third-party services. Record service, purpose, data, account owner, terms/privacy link, region if known, retention and review date.

## 10. Change control
Before introducing customer accounts, checkout, payments, order history, direct downloads, reviews, newsletter or analytics:
- map the new data flow;
- identify provider and access controls;
- update the privacy policy and notices;
- assess child-data implications;
- test security and deletion;
- obtain parent/operator and legal approval as appropriate.

## 11. Review schedule
Review after any material feature/provider change, incident or policy update, and at least annually.

**Approval record:** Leave unsigned until the responsible operator reviews and adopts this manual.
