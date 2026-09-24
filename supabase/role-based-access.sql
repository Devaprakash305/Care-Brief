-- CareBrief role-based portal migration.
-- Run after schema.sql and align-carebrief-schema.sql.

alter table public.user_profiles
  add column if not exists auth_user_id uuid references auth.users(id) on delete cascade,
  add column if not exists role text default 'clinician';

alter table public.patients
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

alter table public.discharge_summaries
  add column if not exists clinician_id uuid references auth.users(id) on delete set null,
  add column if not exists doctor_id uuid references auth.users(id) on delete set null,
  add column if not exists patient_user_id uuid references auth.users(id) on delete set null,
  add column if not exists rejection_reason text;

create table if not exists public.patient_summary_adaptations (
  id uuid primary key default gen_random_uuid(),
  summary_id uuid not null references public.discharge_summaries(id) on delete cascade,
  patient_user_id uuid not null references auth.users(id) on delete cascade,
  language text not null,
  reading_level text not null,
  content jsonb not null default '{}'::jsonb,
  verification jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

drop index if exists public.user_profiles_auth_user_id_key;
create unique index user_profiles_auth_user_id_key on public.user_profiles(auth_user_id);
create index if not exists patients_auth_user_id_idx on public.patients(auth_user_id);
create index if not exists discharge_summaries_doctor_id_idx on public.discharge_summaries(doctor_id);
create index if not exists discharge_summaries_patient_user_id_idx on public.discharge_summaries(patient_user_id);

alter table public.user_profiles drop constraint if exists user_profiles_role_check;
alter table public.user_profiles add constraint user_profiles_role_check check (role in ('clinician', 'doctor', 'patient', 'admin'));

create or replace function public.current_carebrief_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.user_profiles where auth_user_id = auth.uid() limit 1;
$$;

revoke all on function public.current_carebrief_role() from public;
grant execute on function public.current_carebrief_role() to authenticated;

alter table public.user_profiles enable row level security;
alter table public.patients enable row level security;
alter table public.clinical_notes enable row level security;
alter table public.discharge_summaries enable row level security;
alter table public.activity_logs enable row level security;
alter table public.patient_summary_adaptations enable row level security;

drop policy if exists "authenticated users can access care brief data" on public.user_profiles;
drop policy if exists "authenticated users can access patients" on public.patients;
drop policy if exists "authenticated users can access clinical notes" on public.clinical_notes;
drop policy if exists "authenticated users can access summaries" on public.discharge_summaries;
drop policy if exists "authenticated users can access activity logs" on public.activity_logs;

drop policy if exists "users can view own profile" on public.user_profiles;
create policy "users can view own profile" on public.user_profiles
  for select to authenticated using (auth_user_id = auth.uid() or public.current_carebrief_role() = 'admin');

drop policy if exists "staff and patients can access patients" on public.patients;
create policy "staff and patients can access patients" on public.patients
  for select to authenticated using (
    public.current_carebrief_role() in ('clinician', 'doctor', 'admin')
    or auth_user_id = auth.uid()
  );
create policy "staff can create patients" on public.patients
  for insert to authenticated with check (public.current_carebrief_role() in ('clinician', 'doctor', 'admin'));
create policy "staff can update patients" on public.patients
  for update to authenticated using (public.current_carebrief_role() in ('clinician', 'doctor', 'admin')) with check (public.current_carebrief_role() in ('clinician', 'doctor', 'admin'));

drop policy if exists "staff and patients can access clinical notes" on public.clinical_notes;
create policy "staff and patients can access clinical notes" on public.clinical_notes
  for select to authenticated using (
    public.current_carebrief_role() in ('clinician', 'doctor', 'admin')
    or patient_id in (select id from public.patients where auth_user_id = auth.uid())
  );
create policy "staff can create clinical notes" on public.clinical_notes
  for insert to authenticated with check (public.current_carebrief_role() in ('clinician', 'doctor', 'admin'));
create policy "staff can update clinical notes" on public.clinical_notes
  for update to authenticated using (public.current_carebrief_role() in ('clinician', 'doctor', 'admin')) with check (public.current_carebrief_role() in ('clinician', 'doctor', 'admin'));

drop policy if exists "staff and patients can access summaries" on public.discharge_summaries;
create policy "staff and patients can access summaries" on public.discharge_summaries
  for select to authenticated using (
    public.current_carebrief_role() in ('clinician', 'doctor', 'admin')
    or (patient_user_id = auth.uid() and status in ('approved', 'released'))
  );
create policy "clinicians can create summaries" on public.discharge_summaries
  for insert to authenticated with check (public.current_carebrief_role() in ('clinician', 'doctor', 'admin'));
create policy "staff can update summaries" on public.discharge_summaries
  for update to authenticated using (public.current_carebrief_role() in ('clinician', 'doctor', 'admin')) with check (public.current_carebrief_role() in ('clinician', 'doctor', 'admin'));

drop policy if exists "staff can access activity logs" on public.activity_logs;
create policy "staff can access activity logs" on public.activity_logs
  for all to authenticated using (public.current_carebrief_role() in ('clinician', 'doctor', 'admin')) with check (public.current_carebrief_role() in ('clinician', 'doctor', 'admin'));

drop policy if exists "patients can access own adaptations" on public.patient_summary_adaptations;
create policy "patients can access own adaptations" on public.patient_summary_adaptations
  for select to authenticated using (patient_user_id = auth.uid() or public.current_carebrief_role() in ('doctor', 'admin'));
create policy "patients can create own adaptations" on public.patient_summary_adaptations
  for insert to authenticated with check (patient_user_id = auth.uid() and public.current_carebrief_role() = 'patient');
