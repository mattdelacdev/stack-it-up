-- Map Stripe customers/subscriptions back to profiles so webhooks can update tier.
alter table public.profiles
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text unique;

create index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id);
