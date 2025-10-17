-- Supabase Orders schema
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  user_id text not null,
  email text not null,
  amount_minor integer not null,
  currency text not null default 'NGN',
  status text not null default 'pending', -- pending | paid | failed | canceled
  items jsonb not null,
  provider text not null default 'paystack',
  provider_ref text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- Helpful index
create index if not exists idx_orders_reference on public.orders(reference);


