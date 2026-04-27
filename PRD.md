# Product Requirements Document — ClauseGuard MVP

**Product:** ClauseGuard Africa — *Protect your work. Get paid.*  
**Version:** 1.0  
**Status:** Draft  
**Author:** Princewill  
**Last Updated:** April 2026

---

## 1. Product Overview

### 1.1 Problem Statement

Legal protection in Africa is expensive, slow, and inaccessible. A freelance designer in Lagos has no template for a client contract that references Nigerian law. A founder in Nairobi doesn't know what a shareholder agreement should contain under Kenyan company law. A creator in Accra signs brand deals with no understanding of what they're agreeing to.

The alternatives are:
- Hire a lawyer (₦50,000–₦200,000+ per document in Nigeria alone)
- Use a Western template that references US/UK law with no local compliance
- Sign nothing and hope for the best

### 1.2 Solution

ClauseGuard is a legal document generation platform that uses AI to produce plain-language, jurisdiction-aware legal documents for three underserved African segments: freelancers, startups/SMEs, and content creators. Users answer a guided questionnaire and receive a professional, downloadable, e-signable document in minutes.

### 1.3 Target Markets (MVP)

| Market | Country | Regulatory Reference |
|---|---|---|
| Nigeria | NG | FCCPC, NDPR 2019, CAMA 2020 |
| Kenya | KE | CAK, DPA 2019, Companies Act 2015 |
| Ghana | GH | NCA, DPA 2012, Companies Act 2019 |
| South Africa | ZA | CIPC, POPIA 2013, Companies Act 2008 |

### 1.4 Success Metrics (MVP — 90 days post-launch)

| Metric | Target |
|---|---|
| Registered users | 500 |
| Documents generated | 1,500 |
| Document completion rate | ≥ 65% (started → downloaded) |
| Average time to generate | < 4 minutes |
| User-reported satisfaction | ≥ 4.0 / 5.0 |

---

## 2. User Personas

### Persona A — Temi (Freelancer)

- **Who:** 27-year-old UX designer, Lagos. Works with Nigerian and international clients via direct referrals.
- **Pain:** Clients ghost after delivery. No contract means no recourse. Has been burned twice.
- **Goal:** A quick client agreement that protects her IP and sets payment terms she can enforce.
- **Tech comfort:** High. Uses Figma, Notion, Paystack daily.
- **Willingness to pay:** ₦2,000–₦5,000 per document or a monthly plan.

### Persona B — Kofi (Founder)

- **Who:** 32-year-old co-founder of a Ghanaian fintech startup. Raised a pre-seed round.
- **Pain:** Needs a shareholder agreement before the next funding conversation but can't afford GH₵8,000 per lawyer engagement.
- **Goal:** Investor-grade documents that won't embarrass him in due diligence.
- **Tech comfort:** High. Uses React, Linear, Notion.
- **Willingness to pay:** $20–$50/month for the startup plan.

### Persona C — Amara (Creator)

- **Who:** 24-year-old lifestyle creator, Nairobi. 180k TikTok followers. First brand deals in the KES 80,000–200,000 range.
- **Pain:** Brands send her contracts she doesn't understand. She's signed away usage rights she didn't intend to.
- **Goal:** Understand what she's signing, generate her own contract when brands don't provide one.
- **Tech comfort:** Medium. Very comfortable on mobile.
- **Willingness to pay:** KES 500–1,500 per document.

---

## 3. User Stories

### 3.1 Authentication & Onboarding

**US-001 — Sign up**
As a new user, I want to create an account with my email and password so that my documents are saved to my profile.

**Acceptance Criteria:**
- [ ] Email + password signup via Supabase Auth
- [ ] On success → redirect to dashboard
- [ ] Duplicate email shows a clear non-technical error
- [ ] Password ≥ 8 characters enforced client-side and server-side

---

**US-002 — Log in**
As a returning user, I want to log in with my email and password so that I can access my saved documents.

**Acceptance Criteria:**
- [ ] Login form with email + password
- [ ] Failed login: "Incorrect email or password" (no field enumeration)
- [ ] Success → redirect to dashboard
- [ ] Session persists across page reloads

---

**US-003 — Log out**
As a logged-in user, I want to log out so that my account is secure on shared devices.

**Acceptance Criteria:**
- [ ] Logout option in navbar
- [ ] Clears session → redirect to login

---

**US-004 — Track selection**
As a new user, I want to identify which track fits me so that I see only relevant document types.

**Acceptance Criteria:**
- [ ] After first login: three track cards shown (Freelancer, Startup/SME, Creator)
- [ ] Selected track saved to user profile in Supabase
- [ ] Track changeable from profile settings
- [ ] No track pre-selected — user must actively choose

---

### 3.2 Document Creation — All Tracks

**US-010 — Browse document types**
As a user, I want to see all available document types for my track so that I can pick the one I need.

**Acceptance Criteria:**
- [ ] Doc types shown as labelled cards grouped by track
- [ ] Each card shows: name, one-sentence description, estimated completion time
- [ ] User can switch tracks to browse other types
- [ ] Clicking a type starts the questionnaire wizard

---

**US-011 — Select jurisdiction**
As a user, I want to specify which country governs this document so that it is locally compliant.

**Acceptance Criteria:**
- [ ] Jurisdiction shown as first step of every questionnaire
- [ ] Options: Nigeria 🇳🇬, Kenya 🇰🇪, Ghana 🇬🇭, South Africa 🇿🇦
- [ ] Stored with the document record
- [ ] Changing jurisdiction after generation requires starting over (with warning)

---

**US-012 — Complete the questionnaire wizard**
As a user, I want to answer plain-language questions so that the AI generates a document tailored to me.

**Acceptance Criteria:**
- [ ] One question (or small logical group) per step
- [ ] Progress bar shows current step / total
- [ ] Back button returns to previous step without losing answers
- [ ] Required fields validated before advancing
- [ ] Answers saved to Supabase draft on each step (not lost on refresh)
- [ ] Final step shows a full summary before generation

---

**US-013 — Generate the document**
As a user, I want to submit my answers and have AI generate my legal document quickly.

**Acceptance Criteria:**
- [ ] Generation triggered by "Generate Document" CTA on final wizard step
- [ ] Loading state shown while AI streams the response
- [ ] Document streams in and displays as formatted text in the preview pane
- [ ] Generation starts within 3 seconds, completes within 30 seconds
- [ ] On failure: error message shown, answers not lost, "Try Again" option available
- [ ] Generated content saved to `documents` table with status `generated`

---

**US-014 — Preview the document**
As a user, I want to read my generated document before downloading so that I can check it.

**Acceptance Criteria:**
- [ ] Document rendered as clean formatted text (not raw Markdown)
- [ ] AI disclaimer shown at the top (ClauseGuard is not a law firm)
- [ ] Jurisdiction badge and document type shown in header
- [ ] "Download PDF" and "Sign Document" CTAs visible without excessive scrolling

---

**US-015 — Download as PDF**
As a user, I want to download my document as a professional PDF so that I can share it.

**Acceptance Criteria:**
- [ ] PDF generated server-side via `@react-pdf/renderer`
- [ ] PDF includes: title, parties, date, jurisdiction, all clauses, signature block, disclaimer footer
- [ ] ClauseGuard branding (logo + footer) on every page
- [ ] PDF stored in Supabase Storage, linked to document record
- [ ] Download triggers file save — filename: `[doc-type]-[date].pdf`
- [ ] Unsigned documents have empty signature block labelled "Signature pending"

---

**US-016 — E-sign the document**
As a user, I want to sign my document digitally so that it is ready to send to the other party.

**Acceptance Criteria:**
- [ ] Signature canvas rendered in browser (react-signature-canvas)
- [ ] User can clear and redraw
- [ ] On confirm: signature saved as base64 PNG, document status → `signed`, `signed_at` recorded
- [ ] Signed PDF generated with signature embedded in signature block
- [ ] Confirmation screen with download link for signed PDF

---

**US-017 — Access document library**
As a user, I want to see all my documents in one place so that I can find and re-download them.

**Acceptance Criteria:**
- [ ] Dashboard shows documents as cards, sorted by `created_at` descending
- [ ] Each card shows: title, doc type, jurisdiction flag, status badge, date
- [ ] Clicking a card opens the document viewer
- [ ] Empty state with CTA when no documents exist
- [ ] Documents paginated (10 per page)

---

### 3.3 Freelancer Track

**US-100 — Generate a service agreement**
As Temi the freelancer, I want to generate a service agreement for a new client so that I have legal protection before I start work.

**Questionnaire fields:**
- Your full name or business name
- Client name / company
- Description of services
- Total fee amount + currency + payment schedule
- Project start date + expected end date (optional)
- Governing jurisdiction

**Acceptance Criteria:**
- [ ] Document covers: Parties, Scope of Services, Fees & Payment, IP, Confidentiality, Termination, Governing Law
- [ ] NG jurisdiction: references CAMA 2020 and includes NDPR note if client data is handled
- [ ] IP clause defaults to "work product owned by client upon full payment"

---

**US-101 — Generate a client NDA**
As Temi, I want a mutual NDA for sharing project briefs with a client so that confidential information is protected.

**Questionnaire fields:** Disclosing party, Receiving party, Purpose, Duration, Jurisdiction

**Acceptance Criteria:**
- [ ] Covers: Definition of Confidential Information, Obligations, Exclusions, Term, Remedies
- [ ] Jurisdiction-appropriate governing law clause

---

**US-102 — Generate a dispute / demand letter**
As Temi, I want to send a formal demand letter to a non-paying client so that I have written evidence of my request.

**Questionnaire fields:** Your name, Client name, Invoice number, Amount outstanding, Currency, Original due date, Days overdue, Final payment deadline, Preferred resolution

**Acceptance Criteria:**
- [ ] Formal but not aggressive tone
- [ ] References original service agreement date if provided
- [ ] States consequences of non-payment
- [ ] References correct small claims court / tribunal for the jurisdiction

---

### 3.4 Startup / SME Track

**US-200 — Generate a shareholder agreement**
As Kofi the founder, I want a shareholder agreement for my co-founders so that equity and decision-making are clearly defined.

**Questionnaire fields:** Company name, Registration number (optional), Jurisdiction, Shareholders (up to 5: name, role, equity %), Decision thresholds, Drag-along, Tag-along, Right of first refusal

**Acceptance Criteria:**
- [ ] Equity percentages must sum to 100% — validated before generation
- [ ] Covers: Share Capital, Shareholder Rights, Board Composition, Voting, Transfer Restrictions, Drag-along, Tag-along, Dispute Resolution
- [ ] NG: CAMA 2020 · KE: Companies Act 2015 · ZA: Companies Act 2008 · GH: Companies Act 2019
- [ ] Flagged as "suitable for pre-seed stage"

---

**US-201 — Generate a founder vesting schedule**
As Kofi, I want a vesting agreement for co-founders so that equity is earned over time.

**Questionnaire fields:** Company name, Founder name, Equity amount, Vesting period, Cliff period, Vesting frequency, Acceleration on acquisition

**Acceptance Criteria:**
- [ ] Includes: Vesting Schedule table, Cliff clause, Good Leaver / Bad Leaver provisions, Acceleration
- [ ] Vesting table auto-calculated from inputs

---

**US-202 — Generate an employment contract**
As Kofi, I want an employment contract for my first hire so that the role and compensation are legally documented.

**Questionnaire fields:** Employer name, Employee name, Job title, Employment type, Start date, Salary + currency + frequency, Probation period, Notice period, Working hours, Remote/on-site/hybrid, Non-compete (yes/no)

**Acceptance Criteria:**
- [ ] Covers: Role, Compensation, Hours, Leave, Confidentiality, IP Assignment, Termination, Governing Law
- [ ] Leave entitlement defaults to jurisdiction statutory minimum: NG 6 days · KE 21 days · GH 15 days · ZA 15 days
- [ ] Non-compete clause includes enforceability disclaimer

---

**US-203 — Generate a privacy policy**
As Kofi, I want a privacy policy for my app so that I comply with data protection law before launch.

**Questionnaire fields:** Company/product name, URL, Data types collected, Purpose, Third-party sharing, Retention period, Contact email, Jurisdiction

**Acceptance Criteria:**
- [ ] Covers: Data Collected, Purpose, Legal Basis, Retention, Third Parties, User Rights, Contact, Governing Law
- [ ] NG: NDPR 2019 section · ZA: POPIA 2013 + Information Officer note · KE: DPA 2019 + ODPC · GH: DPA 2012
- [ ] Output ready to paste into website footer or app settings

---

### 3.5 Creator / Influencer Track

**US-300 — Generate a brand deal contract**
As Amara the creator, I want a brand deal contract so that my deliverables, payment, and content rights are clearly defined.

**Questionnaire fields:** Creator name/handle, Brand name, Campaign/product, Deliverables, Platforms, Campaign period, Fee + currency + payment terms, Exclusivity (yes/no: category + duration), Content approval required (yes/no), Usage rights granted to brand (yes/no: platforms + duration + paid ads allowed?)

**Acceptance Criteria:**
- [ ] Covers: Parties, Deliverables, Schedule, Fees, Exclusivity, Content Approval, Usage Rights, FTC Disclosure, Termination, Governing Law
- [ ] FTC/sponsored content disclosure clause included by default
- [ ] Usage rights: "Brand may not use Creator's content for paid ads without separate written agreement" unless explicitly granted
- [ ] Exclusivity scoped to category only (not blanket) unless user selected "all categories"

---

**US-301 — Generate a content licensing agreement**
As Amara, I want to license existing content to a brand so that I control how and where it gets used.

**Questionnaire fields:** Licensor name, Licensee name, Content description, License type (exclusive/non-exclusive), Permitted platforms, Territory, Duration, Permitted uses, License fee + currency

**Acceptance Criteria:**
- [ ] Covers: Grant of License, Scope, Territory, Term, Restrictions, Moral Rights, Royalties, Termination
- [ ] Moral rights clause: creator's name must appear in all uses unless explicitly waived

---

**US-302 — Generate a collaboration agreement**
As Amara, I want a collab agreement for a joint content project so that revenue split and ownership are agreed upfront.

**Questionnaire fields:** Creator names (up to 4), Project description, Content type, Platforms, Revenue split (must sum to 100%), Revenue sources, Credit/attribution, Content ownership, Decision-making, Exit clause

**Acceptance Criteria:**
- [ ] Revenue percentages validated to sum to 100% before generation
- [ ] Covers: Project Scope, Roles, Revenue Share, IP Ownership, Publishing Rights, Decision-Making, Exit, Dispute Resolution
- [ ] Joint ownership clause: both parties must consent to third-party licensing

---

## 4. Non-Functional Requirements

### 4.1 Performance
- AI streaming must begin within 3 seconds of submission
- PDF generation completes within 10 seconds
- Dashboard loads in under 2 seconds on 4G

### 4.2 Security
- All API routes require a valid Supabase session
- Row-level security enforced at DB level
- `OPENROUTER_API_KEY` never exposed to the client
- All file access via signed Supabase Storage URLs (not public URLs)

### 4.3 Accessibility
- WCAG 2.1 AA for all interactive elements
- Keyboard-navigable wizard
- All form inputs have visible labels (no placeholder-only labels)

### 4.4 Responsive Design
- Full functionality: mobile 375px+, tablet 768px+, desktop 1280px+
- Signature canvas works on touch devices
- PDF download works on iOS Safari and Android Chrome

---

## 5. Out of Scope (MVP)

| Feature | Reason Deferred |
|---|---|
| Payment / billing (Paystack) | Post-MVP monetisation sprint |
| Admin dashboard | Not needed at MVP volume |
| Multi-user / team accounts | Single-user only for MVP |
| Document version history | Complexity vs value tradeoff |
| Attorney review marketplace | Partnership work required |
| WhatsApp / SMS delivery | Post-MVP channel expansion |
| Swahili / French / Pidgin localisation | Post-MVP i18n sprint |
| Mobile apps (iOS / Android) | Web-first; native app post-PMF |
| Rwanda, Tanzania, Senegal jurisdictions | Post-MVP market expansion |

---

## 6. Open Questions

| # | Question | Decision Needed By |
|---|---|---|
| OQ-1 | Should unsigned documents expire after 30 days? | Before dev sprint 2 |
| OQ-2 | Free tier (e.g. 2 free docs) or paid from day 1? | Before launch |
| OQ-3 | Which law firms to partner with per jurisdiction for "Review with a lawyer" upsell? | Pre-launch |
| OQ-4 | Should brand deal contracts include FTC disclosure notes tailored for NG/KE/GH/ZA where influencer marketing regulation is still evolving? | Before creator track ships |
| OQ-5 | Store raw AI text OR PDF only? Affects re-generation / edit UX. | Before dev sprint 1 |

---

## 7. Appendix — Document Type Reference

### Freelancer Track (6 types)

| Doc Type | Questions | Est. Time |
|---|---|---|
| Service agreement | 9 | ~20s |
| Client NDA | 5 | ~15s |
| Invoice + payment terms | 7 | ~12s |
| Dispute / demand letter | 8 | ~18s |
| IP ownership clause | 6 | ~14s |
| Cross-border contract | 10 | ~25s |

### Startup / SME Track (6 types)

| Doc Type | Questions | Est. Time |
|---|---|---|
| Shareholder agreement | 12 | ~28s |
| Founder vesting schedule | 8 | ~20s |
| Employment contract | 12 | ~25s |
| Vendor / SLA agreement | 9 | ~20s |
| Privacy policy | 9 | ~22s |
| Investment term sheet | 11 | ~26s |

### Creator / Influencer Track (6 types)

| Doc Type | Questions | Est. Time |
|---|---|---|
| Brand deal contract | 13 | ~28s |
| Exclusivity clause | 6 | ~14s |
| Content licensing agreement | 9 | ~20s |
| UGC usage rights | 7 | ~16s |
| Talent / manager split | 8 | ~18s |
| Collaboration agreement | 10 | ~22s |
