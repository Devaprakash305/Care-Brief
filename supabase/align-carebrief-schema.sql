-- Adds CareBrief-specific generated content fields to the existing tables.
-- Run after the existing profiles/anonymous-user fix.

alter table public.discharge_summaries
  add column if not exists patient_name text,
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
  add column if not exists clinician_notes text;
