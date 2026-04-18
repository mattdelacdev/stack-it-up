-- Allow admins to update any profile (role, name). Complements the existing self-update policy.
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());
