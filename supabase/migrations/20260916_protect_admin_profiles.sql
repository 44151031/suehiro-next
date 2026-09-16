-- Existing admin identity and profile rows are retained.
begin;
alter table public.profiles enable row level security;
revoke all on public.profiles from public, anon, authenticated;
grant select (id, is_admin) on public.profiles to authenticated;
create policy profiles_read_own_admin_flag on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
commit;
