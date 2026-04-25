create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_settings (
  id integer primary key,
  opening_balance numeric not null default 0,
  updated_at timestamptz not null default now(),
  check (id = 1)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('in', 'out')),
  amount numeric not null check (amount > 0),
  category text not null,
  note text default '',
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.finance_settings enable row level security;
alter table public.transactions enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "Allow approved admins to read admin emails" on public.admin_users;
drop policy if exists "Allow approved admins to read settings" on public.finance_settings;
drop policy if exists "Allow approved admins to upsert settings" on public.finance_settings;
drop policy if exists "Allow approved admins to read transactions" on public.transactions;
drop policy if exists "Allow approved admins to insert transactions" on public.transactions;
drop policy if exists "Allow approved admins to update transactions" on public.transactions;
drop policy if exists "Allow approved admins to delete transactions" on public.transactions;
drop policy if exists "Allow approved admins to read activity logs" on public.activity_logs;
drop policy if exists "Allow approved admins to insert activity logs" on public.activity_logs;
drop policy if exists "Allow approved admins to delete activity logs" on public.activity_logs;

create policy "Allow approved admins to read admin emails"
on public.admin_users
for select
using (lower(auth.jwt() ->> 'email') = lower(email));

create policy "Allow approved admins to read settings"
on public.finance_settings
for select
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to upsert settings"
on public.finance_settings
for all
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to read transactions"
on public.transactions
for select
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to insert transactions"
on public.transactions
for insert
with check (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to update transactions"
on public.transactions
for update
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to delete transactions"
on public.transactions
for delete
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to read activity logs"
on public.activity_logs
for select
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to insert activity logs"
on public.activity_logs
for insert
with check (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Allow approved admins to delete activity logs"
on public.activity_logs
for delete
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

insert into public.admin_users (email)
values ('joanterer57@gmail.com')
on conflict (email) do nothing;

insert into public.finance_settings (id, opening_balance)
values (1, 0)
on conflict (id) do nothing;
