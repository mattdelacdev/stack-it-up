-- Allow authenticated users to subscribe to the newsletter too (not just anon).
drop policy if exists "authenticated can subscribe" on public.subscribers;
create policy "authenticated can subscribe" on public.subscribers
  for insert to authenticated with check (true);
