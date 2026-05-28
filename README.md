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

Next.js 16 · TypeScript · Tailwind · OpenAI vision · pdf-lib

## Roadmap

See **[docs/ROADMAP.md](docs/ROADMAP.md)** for V2 (video, voice notes, before/after, QR tags, schedules, teams) and what **not** to build (CMMS, bidding, accounting, dispatch, custom CV training).
