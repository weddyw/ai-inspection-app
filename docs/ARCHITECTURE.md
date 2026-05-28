# Architecture & tech stack

Modern AI stack: Next.js on Vercel, Supabase for data and files, OpenAI vision for analysis, Stripe for teams billing (V2).

---

## Frontend

| Layer | Choice |
|-------|--------|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |

**V1 flow:** `/inspect` wizard — upload photos → pick template → AI analyze → edit table → download PDF (client-side, no login).

---

## Backend / database — Supabase

| Use case | Supabase feature |
|----------|------------------|
| **Auth** | Email magic link / OAuth → `auth.users` + `profiles` |
| **Storage** | Photo uploads + generated PDFs |
| **Inspections** | `inspections` table |
| **Reports** | `reports` row + `pdf_url` in storage |

Schema: **[supabase/schema.sql](../supabase/schema.sql)**  
Storage buckets to create in dashboard:

- `inspection-photos` — original uploads (private; signed URLs)
- `inspection-reports` — exported PDFs (private; signed URLs)

---

## AI vision — OpenAI API

**Input per request:**

- Images (base64 or URLs after storage upload)
- Inspection type / template (`apartment_turnover`, `equipment_inspection`, etc.)
- Structured system + user prompts (template-specific targets)

**Example prompt intent:**

> Analyze these apartment turnover photos and identify maintenance issues.

The app builds prompts from `src/lib/niches.ts` (`visionTargets`) and returns JSON: issues with severity, recommendation, and `photoRef` (1-based index).

**Model:** `gpt-4o-mini` with vision (configurable in `src/lib/aiAnalyze.ts`).

**Rule:** AI output is a **draft** — user edits the table before export; disclaimer on every PDF.

---

## PDF reports

| Option | When to use |
|--------|-------------|
| **pdf-lib** (current V1) | Fast server/client PDFs, embedded photos, no headless Chrome |
| **@react-pdf/renderer** | React components → PDF; good for branded multi-page layouts |
| **Puppeteer** | HTML template → PDF; heaviest, best for pixel-perfect print CSS |

**V2 path:** Generate PDF → upload to `inspection-reports` bucket → save `reports.pdf_url` in Supabase.

V1 keeps **pdf-lib** so deploy stays simple; migrate when you need saved PDFs in storage or shared links.

---

## Hosting

**Vercel** — connect `weddyw/ai-inspection-app`, set env vars, production on each push to `main`.

Required V1: `OPENAI_API_KEY`

---

## Payments — Stripe (V2)

Pro / Team tiers (see [ROADMAP.md](./ROADMAP.md)):

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Checkout → webhook → enable org features (multi-user, saved history).

---

## Data model (logical)

```
profiles (users)
  └── inspections
        ├── photos
        ├── findings
        └── reports
```

| Table | Key fields |
|-------|------------|
| **profiles** | `id`, `email`, `company_name` |
| **inspections** | `title`, `inspection_type`, `status`, `created_at` |
| **photos** | `inspection_id`, `image_url` |
| **findings** | `issue_type`, `severity`, `recommendation`, `photo_reference` |
| **reports** | `pdf_url`, `generated_at` |

App types in `src/lib/types.ts` map to DB columns:

| TypeScript | Database |
|------------|----------|
| `issue` | `issue_type` |
| `photoRef` | `photo_reference` |
| `niche` | `inspection_type` |

---

## API routes (V1)

| Route | Purpose |
|-------|---------|
| `POST /api/analyze` | Photos + niche → OpenAI → structured JSON |

**V2 routes (planned):**

- `POST /api/inspections` — create draft, upload photos to storage
- `GET /api/inspections/[id]` — load inspection + findings + report URL
- `POST /api/reports/[id]/pdf` — generate PDF, upload, insert `reports` row

---

## Security

- Never expose `OPENAI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the client
- Row Level Security: users only see their own inspections (see schema policies)
- Photos/reports: private buckets + short-lived signed URLs

---

## Per-customer deployments (FieldFlow)

Same pattern as other portfolio apps:

1. New Supabase project + Vercel project per customer (optional)
2. Customer `OPENAI_API_KEY` or agency key with usage caps
3. Branding via env (`NEXT_PUBLIC_BUSINESS_NAME` when added)

Track credentials in FieldFlow ops sheet — not in git.
