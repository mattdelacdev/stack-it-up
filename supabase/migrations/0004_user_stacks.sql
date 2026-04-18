-- Per-user favorites and morning/evening stacks shown on public profiles.

create table if not exists public.profile_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  supplement_id text not null references public.supplements(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, supplement_id)
);

create index if not exists profile_favorites_user_idx
  on public.profile_favorites (user_id, created_at desc);

create table if not exists public.profile_stacks (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('morning', 'evening')),
  supplement_id text not null references public.supplements(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, supplement_id)
);

create index if not exists profile_stacks_user_kind_position_idx
  on public.profile_stacks (user_id, kind, position);

alter table public.profile_favorites enable row level security;
alter table public.profile_stacks enable row level security;

-- Public read: visible when the owning profile is public + has a username.
-- (Profiles RLS already restricts which rows are readable; we mirror that here.)
drop policy if exists "profile_favorites public read" on public.profile_favorites;
create policy "profile_favorites public read" on public.profile_favorites
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_favorites.user_id
        and p.is_public = true
        and p.username is not null
    )
    or auth.uid() = user_id
  );

drop policy if exists "profile_favorites owner write" on public.profile_favorites;
create policy "profile_favorites owner write" on public.profile_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "profile_stacks public read" on public.profile_stacks;
create policy "profile_stacks public read" on public.profile_stacks
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_stacks.user_id
        and p.is_public = true
        and p.username is not null
    )
    or auth.uid() = user_id
  );

drop policy if exists "profile_stacks owner write" on public.profile_stacks;
create policy "profile_stacks owner write" on public.profile_stacks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
