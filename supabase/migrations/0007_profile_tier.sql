-- Billing tier on profiles. Kept separate from `role` so admin permissions
-- and paid subscription status stay independent.
alter table public.profiles
  add column if not exists tier text not null default 'free'
  check (tier in ('free','pro'));

-- Users cannot change their own tier; only admins (or the service role via
-- Stripe webhook, later) may set it. Extend the self-update policy.
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (role = (select role from public.profiles where id = auth.uid()) or public.is_admin())
    and (tier = (select tier from public.profiles where id = auth.uid()) or public.is_admin())
  );
