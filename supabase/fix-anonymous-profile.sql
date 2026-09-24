-- Fixes anonymous Supabase Auth sign-up when the existing profile trigger
-- inserts a profile without a full_name value.

update public.profiles
set full_name = 'Anonymous User'
where full_name is null;

alter table public.profiles
  alter column full_name drop not null;
