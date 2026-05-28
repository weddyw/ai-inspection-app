# Product roadmap

**Positioning:** AI inspector assistant — document inspections faster. **Not** a replacement for licensed inspectors or a full CMMS.

**Strategy:** [STRATEGY.md](./STRATEGY.md) — why apartment turnover first, risks, monetization, what wins.

**Moat:** Workflow + reports — not “advanced AI.” Structured findings + fast mobile upload + PDF customers share.

---

## Build first (MVP bar for revenue)

1. Upload inspection photos  
2. AI generates findings (human review)  
3. Generate PDF report  
4. Save inspection history (Supabase — in progress)

Everything else is V2+.

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

## Tech stack

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for full detail.

| Layer | V1 | V2+ |
|-------|-----|-----|
| Frontend | Next.js, TypeScript, Tailwind | Same |
| AI | OpenAI vision + structured prompts | + video frames, Whisper for voice |
| PDF | pdf-lib (download in browser) | React PDF or Puppeteer → `reports.pdf_url` in Supabase |
| DB / auth | — | Supabase (`supabase/schema.sql`) |
| Payments | — | Stripe (Pro / Team) |
| Hosting | Vercel | Vercel |

---

## Monetization

| Tier | Price | Includes |
|------|-------|----------|
| Free / trial | $0 | Limited inspections (demo) |
| Basic | ~$29/mo | Core workflow + PDF export |
| Pro | ~$99/mo | Volume, branding, teams, saved history |
| Pay per report | $5–20/report | Low-volume users |
| **Hybrid** (later) | Sub + per-report overage | Likely best long-term |

Sell **speed and documentation** — not certification or legal guarantees.

---

## FieldFlow hub

When live on Vercel, add solution page on [fieldflowautomation.ai](https://fieldflowautomation.ai) linking to the app (same pattern as junk quote + SOP builder).
