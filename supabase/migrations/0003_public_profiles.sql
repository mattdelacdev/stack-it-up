-- Public profile fields: username, bio, avatar (Google or uploaded), socials, visibility.
alter table public.profiles
  add column if not exists username text,
  add column if not exists bio text,
  add column if not exists website text,
  add column if not exists avatar_url text,
  add column if not exists avatar_uploaded_path text,
  add column if not exists instagram text,
  add column if not exists tiktok text,
  add column if not exists twitter text,
  add column if not exists youtube text,
  add column if not exists location text,
  add column if not exists is_public boolean not null default true;

-- Username: 3–30 chars, a–z, 0–9, underscore. Case-insensitive unique via lower() index.
alter table public.profiles
  drop constraint if exists profiles_username_format;
alter table public.profiles
  add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9_]{3,30}$');

alter table public.profiles
  drop constraint if exists profiles_bio_length;
alter table public.profiles
  add constraint profiles_bio_length check (bio is null or char_length(bio) <= 280);

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;

-- Reserved usernames: block squatting of route-like names.
create or replace function public.check_username_not_reserved()
returns trigger
language plpgsql
as $$
begin
  if new.username is not null and lower(new.username) in (
    'admin','api','account','auth','login','logout','signup','signout',
    'quiz','results','optimize','supplements','u','me','profile','settings',
    'about','help','support','privacy','terms','www','root','system','null'
  ) then
    raise exception 'Username "%" is reserved', new.username;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_username_reserved on public.profiles;
create trigger profiles_username_reserved
  before insert or update of username on public.profiles
  for each row execute function public.check_username_not_reserved();

-- Default avatar_url to the Google picture on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  full_name text := coalesce(new.raw_user_meta_data->>'full_name', '');
  picture text := new.raw_user_meta_data->>'avatar_url';
  first_part text;
  last_part text;
begin
  first_part := split_part(full_name, ' ', 1);
  last_part := nullif(trim(substring(full_name from position(' ' in full_name))), '');
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (new.id, new.email, nullif(first_part, ''), last_part, picture)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Anonymous users can read public profiles (for /u/[username]).
drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles
  for select using (is_public = true and username is not null);

-- Avatars storage bucket: public read, owner write to their own folder.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars owner insert" on storage.objects;
create policy "avatars owner insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars owner delete" on storage.objects;
create policy "avatars owner delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
