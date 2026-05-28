# Product strategy

**One-liner:** Fastest path from field photos → structured report → PDF. **Workflow beats raw AI.**

**Positioning:** AI-assisted inspection only — not licensed inspection, not compliance certification.

---

## Why this product works

### Strengths

1. **AI vision is actually useful** — Unlike many “AI” apps, photo → findings is a genuine use case inspectors and property managers already do manually.
2. **Huge market** — Every industry inspects things (property, fleet, equipment, roofs, facilities).
3. **Strong recurring revenue** — Inspections repeat constantly (turnover, PM walks, insurance, compliance cycles).
4. **Easy to demo** — Upload photos → instant structured report. Value is obvious in 60 seconds.

### What makes this app win

**Not** “advanced AI.”

**Yes:**

- Fastest workflow
- Best reports (clear Issue · Severity · Recommendation · Photo #)
- Easiest mobile upload
- Easiest sharing (PDF + saved history)

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| **AI can miss problems** | Unavoidable. Disclaimer: *AI-assisted inspection only.* Human must verify on site. |
| **False positives** | AI may flag harmless issues. Editable findings table + review before export. |
| **Liability** | No legal guarantees. Extra care for safety, structural, and compliance use cases — we document, not certify. |
| **Industry-specific complexity** | Each vertical wants custom workflows. **Start narrow**, expand templates later. |

Copy lives in `src/lib/disclaimer.ts` and on every PDF export.

---

## Smartest MVP strategy

### Start with: **Apartment turnover inspections**

| Why | Detail |
|-----|--------|
| Easy to validate visually | Stains, trash, wall damage, broken fixtures |
| Common problems | High volume, repeatable checklist |
| Lower legal risk | vs structural / safety certification |
| Simple workflow | Photos → table → PDF |
| Large market | Property management, make-ready vendors |

**AI can already identify (achievable today):** stains, trash, wall damage, broken fixtures, debris, water marks, cleanliness issues.

Other templates (equipment, roof, vehicle) stay available but **sales and demos lead with apartment turnover**.

---

## Build first (only this)

Ship and sell before adding V2 scope:

1. Upload inspection photos (mobile-first)
2. AI generates findings (structured, editable)
3. Generate PDF report
4. **Save inspection history** (Supabase — next engineering milestone)

That’s enough for paid pilots.

See [ROADMAP.md](./ROADMAP.md) for what to defer (video, CMMS, etc.).

---

## Monetization

| Model | Price | Best for |
|-------|-------|----------|
| **Subscription — Basic** | ~$29/mo | Solo inspectors / small PM shops |
| **Subscription — Pro** | ~$99/mo | Teams, branding, higher volume |
| **Pay per report** | $5–20/report | Low-volume users, try-before-subscribe |
| **Hybrid** (eventually) | Base sub + overage reports | Likely best long-term |

Avoid promising “unlimited accuracy” — sell **speed and documentation**, not certification.

---

## Portfolio context (FieldFlow)

Among the first three apps (junk quote, maintenance SOP, inspection assistant), **this one has the largest expansion potential**:

- Maintenance platform adjacency (pairs with SOP builder)
- Inspection SaaS for multiple verticals
- Property ops / compliance tooling

**Do not** chase that vision in V1. Win turnover workflow first, then expand.

---

## Demo script (60 seconds)

1. Open `/inspect` on phone.
2. Snap 5–10 unit photos.
3. Choose **Apartment turnover**.
4. Run analysis → show table.
5. Download PDF.

Message: *“Same walk you already do — documented in minutes, not hours.”*

---

## Anti-goals (reminder)

- No licensed inspection claims
- No structural / safety guarantees
- No CMMS, dispatch, accounting, bidding (see ROADMAP)
