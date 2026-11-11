# VARUN SAI BOOKSTORE
## Notices, Registers & Implementation Checklist

**Prepared:** 11 November 2026

## A. Contact form notice
When you submit the bookstore contact form, the website collects your name, email address and message so the operator can respond to your enquiry. Do not include passwords, payment-card details or sensitive personal information. Privacy questions: tsudhakartsudhakar5@gmail.com.

## B. External retailer notice
Book links may take you to external retailers or publishing platforms. Any purchase, payment, delivery, refund or account information you provide there is handled under that provider's terms and privacy policy, not this website's contact-form workflow.

## C. Registers

### Contact-message register
Fields: reference/message ID; received date; category; status; assigned administrator; response date; review/deletion date; minimal operational notes.

### Privacy request register
Fields: reference; received date; request type; verification status; action taken; response date; closure date.

### Grievance register
Fields: reference; receipt date; category; acknowledgement date; assigned reviewer; outcome; closure date.

### Incident register
Fields: incident ID; detection date; affected system; data potentially affected; containment; assessment; notifications/legal advice; remediation; closure.

### Provider register
Fields: provider; service; purpose; data categories; account owner; terms/privacy link; region if known; retention; security controls; review date.

## D. Implementation checklist

### Public site
- [ ] Confirm contact form fields match the privacy policy.
- [ ] Confirm no hidden visitor registration or tracking feature is active.
- [ ] Verify external retailer links and identify destinations.
- [ ] Confirm whether any checkout, payments, orders, downloads or review feature is actually active.
- [ ] Ensure privacy policy and contact notice are easy to find.

### Supabase and admin
- [ ] Inspect RLS status and policy expressions for all active tables.
- [ ] Inspect table grants for anon/authenticated/service_role.
- [ ] Verify contact messages are not publicly readable.
- [ ] Verify only authorised admins can read/update/delete messages.
- [ ] Inspect RPC function definitions, owners and EXECUTE grants.
- [ ] Confirm admin membership cannot be self-assigned.
- [ ] Confirm no service-role key or database password is in public files.
- [ ] Verify backups, logs and deletion behavior.

### Operations
- [ ] Use individual admin accounts and MFA where available.
- [ ] Establish a retention/deletion review routine.
- [ ] Maintain privacy request, grievance, incident and provider registers.
- [ ] Test contact submission and admin receipt with disposable data.
- [ ] Test anonymous/non-admin access denial.
- [ ] Review mobile display and accessibility.

### Legal/publication
- [ ] Confirm responsible operator and privacy email.
- [ ] Confirm current features and provider list.
- [ ] Obtain Indian privacy/technology lawyer review.
- [ ] Approve policy version and effective date before publication.

## E. Approval record
Policy version: __________  
Responsible operator approval: __________  
Date: __________  
Legal review (if obtained): __________  
Publication date: __________  
Next review: __________

Do not mark a control complete without evidence of implementation or testing.
