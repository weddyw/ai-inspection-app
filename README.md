# AI Inspection Assistant

Upload 5–20 photos → select inspection type → AI analysis → PDF report with issues, severity, photo notes, and timestamps.

**Positioning:** AI inspector assistant — not a replacement for licensed human inspectors.

## V1 workflow

1. **Upload photos** (5–20)
2. **Inspection type** — apartment turnover, equipment, roof, or vehicle
3. **AI analysis** — issues, severity, recommendations
4. **Report** — PDF + printable issue list with photo notes

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
