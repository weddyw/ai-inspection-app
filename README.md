# AI Inspection Assistant

Upload 5–20 photos → select inspection type → AI analysis → PDF report with issues, severity, photo notes, and timestamps.

**Positioning:** AI inspector assistant — not a replacement for licensed human inspectors.

## V1 must-haves

| Feature | Status |
|---------|--------|
| **Photo upload** | Mobile camera, gallery, drag & drop (5–20 photos) |
| **AI vision** | Debris, water damage, rust, drywall, dumpsters, ceiling tiles, etc. |
| **Structured report** | Issue · Severity · Recommendation · Photo reference |
| **PDF export** | Timestamped PDF with findings + embedded photos |
| **Templates** | Apartment, equipment, roof, vehicle |

## Workflow

1. Upload photos (5–20)
2. Select inspection template
3. AI vision analysis
4. Review structured table → download PDF

## Local dev

```bash
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY
npm run dev
```

- Home: http://localhost:3000
- Inspect: http://localhost:3000/inspect

## Deploy

Push to GitHub → import on [Vercel](https://vercel.com) → set `OPENAI_API_KEY`.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js · TypeScript · Tailwind |
| AI | OpenAI API (vision + structured JSON prompts) |
| PDF (V1) | pdf-lib — client export |
| PDF (V2+) | React PDF or Puppeteer → Supabase storage |
| Database | Supabase — auth, storage, inspections, findings, reports |
| Hosting | Vercel |
| Payments (V2) | Stripe |

**Database:** run [`supabase/schema.sql`](supabase/schema.sql) — `profiles`, `inspections`, `photos`, `findings`, `reports`.

## Docs

- **[docs/STRATEGY.md](docs/STRATEGY.md)** — market, risks, apartment turnover MVP, monetization, what wins
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — stack, OpenAI flow, PDF options, security
- **[docs/ROADMAP.md](docs/ROADMAP.md)** — V2 features and do-not-build list
