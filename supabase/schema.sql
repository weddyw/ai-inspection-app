-- AI Inspection Assistant — Supabase schema (V2)
-- Run in Supabase SQL Editor after creating project.
--
-- Storage buckets (create in Dashboard → Storage):
--   inspection-photos   (private)
--   inspection-reports  (private)

create extension if not exists "pgcrypto";

-- Users (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  email text not null default '',
  company_name text not null default ''
);

-- Inspections
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  inspection_type text not null,
  status text not null default 'draft',
  property_label text not null default '',
  inspector_name text not null default '',
  unit_notes text not null default '',
  summary text not null default '',
  overall_assessment text not null default '',
  turnover_ready text not null default 'n/a',
  recommended_actions jsonb not null default '[]'::jsonb
);

alter table public.inspections
  add constraint inspections_type_check
  check (inspection_type in (
    'apartment_turnover',
    'equipment_inspection',
    'roof_inspection',
    'vehicle_inspection'
  ));

alter table public.inspections
  add constraint inspections_status_check
  check (status in ('draft', 'analyzing', 'complete', 'archived'));

create index if not exists inspections_user_id_idx on public.inspections(user_id);
create index if not exists inspections_created_at_idx on public.inspections(created_at desc);

-- Photos
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  file_name text not null default '',
  image_url text not null default '',
  storage_bucket text not null default 'inspection-photos',
  storage_path text not null default '',
  note text not null default ''
);

create index if not exists photos_inspection_id_idx on public.photos(inspection_id);

-- Findings (structured issues)
create table if not exists public.findings (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  issue_type text not null,
  severity text not null default 'medium',
  recommendation text not null default '',
  photo_reference int not null default 1,
  location text not null default '',
  category text not null default ''
);

alter table public.findings
  add constraint findings_severity_check
  check (severity in ('low', 'medium', 'high', 'critical'));

create index if not exists findings_inspection_id_idx on public.findings(inspection_id);

-- Reports (generated PDFs)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  generated_at timestamptz not null default now(),
  pdf_url text not null default '',
  storage_bucket text not null default 'inspection-reports',
  storage_path text not null default ''
);

create index if not exists reports_inspection_id_idx on public.reports(inspection_id);
create index if not exists reports_user_id_idx on public.reports(user_id);

-- Touch updated_at on inspections
create or replace function public.set_inspection_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inspections_updated_at on public.inspections;
create trigger inspections_updated_at
  before update on public.inspections
  for each row execute function public.set_inspection_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, company_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'company_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.inspections enable row level security;
alter table public.photos enable row level security;
alter table public.findings enable row level security;
alter table public.reports enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "inspections_all_own" on public.inspections
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Child rows: access via parent inspection ownership
create policy "photos_all_via_inspection" on public.photos
  for all using (
    exists (
      select 1 from public.inspections i
      where i.id = photos.inspection_id and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.inspections i
      where i.id = photos.inspection_id and i.user_id = auth.uid()
    )
  );

create policy "findings_all_via_inspection" on public.findings
  for all using (
    exists (
      select 1 from public.inspections i
      where i.id = findings.inspection_id and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.inspections i
      where i.id = findings.inspection_id and i.user_id = auth.uid()
    )
  );

create policy "reports_all_own" on public.reports
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
