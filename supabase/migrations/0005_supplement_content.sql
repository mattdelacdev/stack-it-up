-- Rich content for supplement detail pages: benefits, mechanism, FAQ, sources, etc.
alter table public.supplements
  add column if not exists content jsonb not null default '{}'::jsonb;
