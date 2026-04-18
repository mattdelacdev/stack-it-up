-- Profiles table: one row per auth.users, stores role + editable name fields.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Split a Google full_name like "Ada Lovelace" into first/last.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  full_name text := coalesce(new.raw_user_meta_data->>'full_name', '');
  first_part text;
  last_part text;
begin
  first_part := split_part(full_name, ' ', 1);
  last_part := nullif(trim(substring(full_name from position(' ' in full_name))), '');
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, nullif(first_part, ''), last_part)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync when auth.users email changes (confirmation flow).
create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_update on auth.users;
create trigger on_auth_user_email_update
  after update of email on auth.users
  for each row execute function public.handle_user_email_update();

-- Admin check helper used by policies on other tables.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles policies
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Role is immutable by the user; only admins may change it.
    and (role = (select role from public.profiles where id = auth.uid()) or public.is_admin())
  );

-- Lock down subscribers: public can insert (newsletter), only admins can read/update/delete.
alter table public.subscribers enable row level security;

drop policy if exists "subscribers public insert" on public.subscribers;
create policy "subscribers public insert" on public.subscribers
  for insert with check (true);

drop policy if exists "subscribers admin read" on public.subscribers;
create policy "subscribers admin read" on public.subscribers
  for select using (public.is_admin());

drop policy if exists "subscribers admin update" on public.subscribers;
create policy "subscribers admin update" on public.subscribers
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "subscribers admin delete" on public.subscribers;
create policy "subscribers admin delete" on public.subscribers
  for delete using (public.is_admin());

-- Supplements: public read (library), admin write.
alter table public.supplements enable row level security;

drop policy if exists "supplements public read" on public.supplements;
create policy "supplements public read" on public.supplements
  for select using (true);

drop policy if exists "supplements admin insert" on public.supplements;
create policy "supplements admin insert" on public.supplements
  for insert with check (public.is_admin());

drop policy if exists "supplements admin update" on public.supplements;
create policy "supplements admin update" on public.supplements
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "supplements admin delete" on public.supplements;
create policy "supplements admin delete" on public.supplements
  for delete using (public.is_admin());
