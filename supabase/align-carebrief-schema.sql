-- Adds CareBrief-specific patient and generated-content fields to older or partially migrated Supabase instances.
-- Run after the existing profiles/anonymous-user fix.

alter table public.patients
  add column if not exists mrn text,
  add column if not exists name text,
  add column if not exists age integer,
  add column if not exists gender text default '',
  add column if not exists primary_diagnosis text default '',
  add column if not exists preferred_language text default 'English',
  add column if not exists reading_level text default 'Standard',
  add column if not exists whatsapp_number text default '',
  add column if not exists room_number text default '',
  add column if not exists admission_date date,
  add column if not exists discharge_date date,
  add column if not exists attending_physician text default '';

-- Older versions used these columns as required fields. The current app uses
-- mrn/name instead, so keep the legacy columns nullable during migration.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'patients' and column_name = 'patient_code'
  ) then
    alter table public.patients alter column patient_code drop not null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'patients' and column_name = 'full_name'
  ) then
    alter table public.patients alter column full_name drop not null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'patients' and column_name = 'created_by'
  ) then
    alter table public.patients alter column created_by drop not null;
  end if;
end $$;

alter table public.discharge_summaries
  add column if not exists patient_name text,
  add column if not exists whatsapp_number text default '',
  add column if not exists condition text,
  add column if not exists language text,
  add column if not exists reading_level text,
  add column if not exists format text,
  add column if not exists sections_included jsonb default '{}'::jsonb,
  add column if not exists content jsonb default '{}'::jsonb,
  add column if not exists verification jsonb default '{}'::jsonb,
  add column if not exists original_fkgl numeric default 0,
  add column if not exists simplified_fkgl numeric default 0,
  add column if not exists readability_improvement_pct numeric default 0,
  add column if not exists reviewed_by text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists clinician_notes text,
  add column if not exists pdf_url text,
  add column if not exists delivery_status text default 'pending',
  add column if not exists delivery_error text,
  add column if not exists released_at timestamptz;

-- Replace the older status vocabulary with the clinician approval and release lifecycle.
alter table public.discharge_summaries
  drop constraint if exists discharge_summaries_status_check;

update public.discharge_summaries
set status = 'draft'
where status is null
   or status not in ('draft', 'awaiting_review', 'edited', 'approved', 'released');

alter table public.discharge_summaries
  add constraint discharge_summaries_status_check
  check (status in ('draft', 'awaiting_review', 'edited', 'approved', 'released'));

alter table public.discharge_summaries
  drop constraint if exists discharge_summaries_delivery_status_check;

update public.discharge_summaries
set delivery_status = 'pending'
where delivery_status is null
   or delivery_status not in ('pending', 'ready_to_send', 'sending', 'sent', 'delivery_failed');

alter table public.discharge_summaries
  add constraint discharge_summaries_delivery_status_check
  check (delivery_status in ('pending', 'ready_to_send', 'sending', 'sent', 'delivery_failed'));
