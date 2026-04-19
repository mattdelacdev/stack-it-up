-- Per-caller request log for AI endpoint rate limiting.

create table if not exists public.ai_rate_limit_hits (
  id bigserial primary key,
  identifier text not null,
  endpoint text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_rate_limit_hits_lookup_idx
  on public.ai_rate_limit_hits (identifier, endpoint, created_at desc);

alter table public.ai_rate_limit_hits enable row level security;
-- No policies: the table is only reachable via check_ai_rate_limit() below.

-- Atomic check + record used by API routes.
-- Runs as the function owner (security definer) so the public/anon client
-- cannot read or forge hit rows directly.
create or replace function public.check_ai_rate_limit(
  p_identifier text,
  p_endpoint text,
  p_hour_limit int,
  p_day_limit int
)
returns table (
  allowed boolean,
  retry_after_sec int,
  remaining_hour int,
  remaining_day int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_hour_count int;
  v_day_count int;
  v_oldest_hour timestamptz;
  v_oldest_day timestamptz;
  v_retry int := 0;
  v_allowed boolean;
begin
  if p_identifier is null or length(p_identifier) = 0 then
    raise exception 'identifier required';
  end if;
  if p_endpoint is null or length(p_endpoint) = 0 then
    raise exception 'endpoint required';
  end if;

  select
    count(*) filter (where created_at > v_now - interval '1 hour'),
    count(*) filter (where created_at > v_now - interval '24 hours'),
    min(created_at) filter (where created_at > v_now - interval '1 hour'),
    min(created_at) filter (where created_at > v_now - interval '24 hours')
  into v_hour_count, v_day_count, v_oldest_hour, v_oldest_day
  from public.ai_rate_limit_hits
  where identifier = p_identifier
    and endpoint = p_endpoint
    and created_at > v_now - interval '24 hours';

  v_allowed := v_hour_count < p_hour_limit and v_day_count < p_day_limit;

  if v_allowed then
    insert into public.ai_rate_limit_hits (identifier, endpoint)
    values (p_identifier, p_endpoint);
    v_hour_count := v_hour_count + 1;
    v_day_count := v_day_count + 1;
  else
    if v_hour_count >= p_hour_limit and v_oldest_hour is not null then
      v_retry := greatest(
        v_retry,
        extract(epoch from (v_oldest_hour + interval '1 hour' - v_now))::int
      );
    end if;
    if v_day_count >= p_day_limit and v_oldest_day is not null then
      v_retry := greatest(
        v_retry,
        extract(epoch from (v_oldest_day + interval '24 hours' - v_now))::int
      );
    end if;
    if v_retry < 1 then
      v_retry := 60;
    end if;
  end if;

  return query
    select
      v_allowed,
      v_retry,
      greatest(p_hour_limit - v_hour_count, 0),
      greatest(p_day_limit - v_day_count, 0);
end;
$$;

revoke all on function public.check_ai_rate_limit(text, text, int, int) from public;
grant execute on function public.check_ai_rate_limit(text, text, int, int)
  to anon, authenticated, service_role;
