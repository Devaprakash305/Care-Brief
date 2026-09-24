create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  department text not null default '',
  hospital text not null default '',
  email text not null default '',
  avatar_url text
);

create table if not exists public.patients (
  id text primary key,
  mrn text not null,
  name text not null,
  age integer not null,
  gender text not null,
  primary_diagnosis text not null default '',
  preferred_language text not null default 'English',
  reading_level text not null default 'Standard',
  room_number text not null default '',
  admission_date date,
  discharge_date date,
  attending_physician text not null default ''
);

create table if not exists public.clinical_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  patient_name text not null,
  author text not null default '',
  note_type text not null default 'Clinical Note',
  created_at timestamptz not null default now(),
  raw_content text not null,
  sections jsonb not null default '{}'::jsonb
);

create table if not exists public.discharge_summaries (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references public.clinical_notes(id) on delete set null,
  patient_id text not null,
  patient_name text not null,
  condition text not null default '',
  language text not null default 'English',
  reading_level text not null default 'Standard',
  format text not null default 'Text',
  sections_included jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  original_fkgl numeric not null default 0,
  simplified_fkgl numeric not null default 0,
  readability_improvement_pct numeric not null default 0,
  content jsonb not null default '{}'::jsonb,
  verification jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_by text,
  reviewed_at timestamptz,
  clinician_notes text
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  summary_id uuid references public.discharge_summaries(id) on delete cascade,
  patient_name text not null,
  action text not null,
  timestamp timestamptz not null default now(),
  actor text not null default ''
);

alter table public.user_profiles enable row level security;
alter table public.patients enable row level security;
alter table public.clinical_notes enable row level security;
alter table public.discharge_summaries enable row level security;
alter table public.activity_logs enable row level security;

create policy "authenticated users can access care brief data" on public.user_profiles for all to authenticated using (true) with check (true);
create policy "authenticated users can access patients" on public.patients for all to authenticated using (true) with check (true);
create policy "authenticated users can access clinical notes" on public.clinical_notes for all to authenticated using (true) with check (true);
create policy "authenticated users can access summaries" on public.discharge_summaries for all to authenticated using (true) with check (true);
create policy "authenticated users can access activity logs" on public.activity_logs for all to authenticated using (true) with check (true);
