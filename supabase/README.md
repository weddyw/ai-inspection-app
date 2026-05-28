# Supabase setup (V2)

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste and run `schema.sql`.
3. **Storage** → create buckets:
   - `inspection-photos` (private)
   - `inspection-reports` (private)
4. **Authentication** → enable Email (or your preferred provider).
5. Copy **Project URL** and **anon key** into Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

V1 works without Supabase (in-memory flow + client PDF). Wire save/load when you ship auth and history.
