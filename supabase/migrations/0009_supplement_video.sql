-- Optional YouTube review video for each supplement.
alter table public.supplements
  add column if not exists video_url text;
