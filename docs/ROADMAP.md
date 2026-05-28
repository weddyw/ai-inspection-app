# Product roadmap

**Positioning:** AI inspector assistant — document inspections faster. **Not** a replacement for licensed inspectors or a full CMMS.

**Moat:** Structured reports (Issue · Severity · Recommendation · Photo ref) + templates + PDFs customers actually use.

---

## V1 (current)

- Photo upload: mobile camera, gallery, drag/drop (5–20)
- Inspection templates: apartment, equipment, roof, vehicle
- AI vision analysis (OpenAI)
- Editable structured findings table
- PDF export with timestamps and photo embeds

---

## V2 — add later

| Feature | Why it matters |
|--------|----------------|
| **Video inspection analysis** | Upload a walkthrough video; AI flags issues across frames |
| **AI voice notes** | e.g. “Add note: rust on left support beam” while walking the site |
| **Before/after comparisons** | Side-by-side or diff-style reports — high value for turnover and insurance |
| **QR equipment tagging** | Scan asset tag → open history of past inspections for that unit |
| **Recurring scheduled inspections** | Calendar reminders + repeat templates per property/asset |
| **GPS + timestamp logging** | Prove when/where photos were taken (audit trail) |
| **Multi-user teams** | Shared library, roles, customer orgs (Supabase + auth) |

### Suggested V2 build order

1. **GPS + timestamp** on each photo (low complexity, high trust)
2. **Save reports** (Supabase) — unlocks history and QR later
3. **Before/after** — pair two inspections on same property
4. **Video walkthrough** — extract key frames → same structured report
5. **Voice notes** — speech-to-text appended to report or issues list
6. **QR asset tags** — needs saved reports + stable asset IDs
7. **Scheduled inspections** — needs auth + notifications
8. **Teams** — Stripe + org billing

---

## Do not build yet

Avoid scope that turns this into enterprise / field-service software:

| Avoid | Why |
|-------|-----|
| **Massive CMMS** | Work orders, inventory, PM scheduling at plant scale — different product |
| **Contractor bidding** | Marketplace / RFP flows — not inspection docs |
| **Accounting** | Invoicing, payroll, GL — out of scope |
| **Dispatch systems** | Truck routing, technician GPS dispatch — out of scope |
| **Custom computer vision training** | Per-client models are expensive; use general vision + templates |

Stay focused: **photos (and later video) → structured findings → PDF**.

---

## Tech stack (planned growth)

| Layer | V1 | V2+ |
|-------|-----|-----|
| Frontend | Next.js, Tailwind | Same |
| AI | OpenAI vision | + video frames, Whisper for voice |
| PDF | pdf-lib | Same |
| DB / auth | — | Supabase |
| Payments | — | Stripe (teams tier) |
| Hosting | Vercel | Vercel |

---

## Monetization (ideas)

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | Limited inspections / month |
| Pro | ~$29/mo | Unlimited reports, PDF branding |
| Team | ~$79/mo | Multi-user, shared assets, QR history |

Align with FieldFlow portfolio pricing when billing ships.

---

## FieldFlow hub

When live on Vercel, add solution page on [fieldflowautomation.ai](https://fieldflowautomation.ai) linking to the app (same pattern as junk quote + SOP builder).
