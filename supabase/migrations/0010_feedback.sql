-- Visitor feedback: public insert, admin read/delete.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  message text not null check (char_length(message) between 1 and 4000),
  page text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "feedback public insert" on public.feedback;
create policy "feedback public insert" on public.feedback
  for insert with check (true);

drop policy if exists "feedback admin read" on public.feedback;
create policy "feedback admin read" on public.feedback
  for select using (public.is_admin());

drop policy if exists "feedback admin delete" on public.feedback;
create policy "feedback admin delete" on public.feedback
  for delete using (public.is_admin());
