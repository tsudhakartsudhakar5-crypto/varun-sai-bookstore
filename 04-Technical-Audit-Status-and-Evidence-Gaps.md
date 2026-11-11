# VARUN SAI BOOKSTORE — Technical Audit Status & Evidence Gaps

**Date:** 11 November 2026  
**Source archive available:** `varun-sai-bookstore-main (1).zip`  
**Audit type:** Limited source/context review, not a live security audit.

## Confirmed from available project context/source
- Public browsing is intended to work without visitor registration.
- The contact form JavaScript inserts `name`, `email` and `body` into Supabase `messages`.
- The project includes an admin panel and Supabase configuration.
- A previous public review feature was reported removed from the current site; re-check the deployed source before relying on this.
- External retailer links are used.

## Not established
- Current live RLS status and policy expressions.
- Actual grants on `messages`, `orders`, `customers`, `payments`, `reviews` or other active tables.
- Whether all listed tables remain active or are unused legacy schema.
- RPC function definitions, ownership and EXECUTE permissions.
- Admin membership protections.
- Storage bucket permissions and upload restrictions.
- Whether checkout, payment processing, order creation, customer accounts or secure direct ebook downloads are active in the deployed version.
- Backup, log and deletion retention.
- Live contact-form delivery and admin access behavior.

## Required next audit evidence
1. Export current table inventory and RLS-enabled status.
2. Retrieve `pg_policies` output for the bookstore project.
3. Retrieve table grants for every active public table.
4. Inspect all exposed RPC function definitions, owners and EXECUTE ACLs.
5. Inspect admin membership and helper functions.
6. Inspect storage buckets and policies.
7. Confirm whether payment/order/customer functionality is active in deployed source.
8. Run disposable contact submission and verify admin receipt.
9. Test anonymous and non-admin direct access denial.
10. Verify deletion, backups and provider retention.

## Conclusion
This package is a preliminary privacy documentation set. It does not certify the bookstore's database security or legal compliance. Do not copy the author website's Supabase findings into the bookstore report: the two projects are separate and require separate evidence.
