CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL,
  plate_normalized text NOT NULL,
  state text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('sms','email')),
  value text NOT NULL,
  city text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_uni
  ON public.subscriptions (plate_normalized, state, channel, value, city);

CREATE TABLE IF NOT EXISTS public.citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  plate text NOT NULL,
  plate_normalized text NOT NULL,
  state text NOT NULL,
  citation_number text NOT NULL,
  status text NOT NULL,
  amount_cents integer NOT NULL,
  issued_at timestamptz NOT NULL,
  location text,
  violation text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS citations_uni
  ON public.citations (plate_normalized, state, citation_number, city);

CREATE INDEX IF NOT EXISTS citations_lookup_idx
  ON public.citations (plate_normalized, state, city);
