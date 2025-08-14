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
