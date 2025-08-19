create extension if not exists "pgcrypto";
create table if not exists subscriptions (
id uuid primary key default gen_random_uuid(),
plate text not null,
plate_normalized text not null,
state text not null,
channel text not null check (channel in ('sms','email')),
value text not null,
city text default 'SF',
created_at timestamptz not null default now()
);
create table if not exists citations (
id uuid primary key default gen_random_uuid(),
city text not null default 'SF',
plate text not null,
plate_normalized text not null,
state text not null,
citation_number text not null,
status text not null default 'unpaid',
amount_cents integer not null,
issued_at timestamptz not null,
location text,
violation text,
source text default 'seed',
created_at timestamptz not null default now()
);
create unique index if not exists citations_unique_key on citations (plate_normalized, state, citation_number, city);
create index if not exists idx_citations_plate_state on citations (plate_normalized, state);
create index if not exists idx_subscriptions_plate_state on subscriptions (plate_normalized, state);

-- events for product analytics
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  session_id text,
  user_ref text,
  event text not null,
  payload jsonb
);

create index if not exists events_ts_idx on events(ts);
create index if not exists events_event_idx on events(event);

-- scheduleable alerts per subscription
create table if not exists public.subscription_alerts (
  id            bigserial primary key,
  subscription_id text not null,
  alert_type    text not null,
  scheduled_at  timestamptz not null,
  sent_at       timestamptz,
  channel       text,
  payload       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists subscription_alerts_due_idx
  on public.subscription_alerts (scheduled_at)
  where sent_at is null;

create index if not exists subscription_alerts_sub_idx
  on public.subscription_alerts (subscription_id);
