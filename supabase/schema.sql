-- ============================================================
-- K2 Contractors LLC — Supabase schema
-- Run this whole file in: Supabase Dashboard -> SQL Editor
-- ============================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- SERVICES ----------
create table if not exists public.services (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  price_range text not null default '',
  duration text not null default '',
  active boolean not null default true,
  sort_order int not null default 0
);

-- ---------- BOOKINGS ----------
create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  service_slug text not null,
  booking_date date not null,
  time_slot text not null,
  property_type text not null default '',
  option_1 text not null default '',
  option_2 text not null default '',
  address text not null default '',
  phone text not null default '',
  details text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'declined')),
  admin_note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists bookings_user_idx on public.bookings (user_id);

-- ---------- PORTFOLIO ----------
create table if not exists public.portfolio (
  id bigint generated always as identity primary key,
  category text not null check (category in ('bath', 'kitchen', 'repairs')),
  title text not null,
  description text not null default '',
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- CONTACT MESSAGES ----------
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.portfolio enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = 'customer');

drop policy if exists "services: public read" on public.services;
create policy "services: public read" on public.services
  for select using (true);

drop policy if exists "services: admin write" on public.services;
create policy "services: admin write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bookings: read own or admin" on public.bookings;
create policy "bookings: read own or admin" on public.bookings
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings: create own" on public.bookings;
create policy "bookings: create own" on public.bookings
  for insert with check (auth.uid() = user_id);

drop policy if exists "bookings: customer cancel own" on public.bookings;
create policy "bookings: customer cancel own" on public.bookings
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and status = 'cancelled');

drop policy if exists "bookings: admin manage" on public.bookings;
create policy "bookings: admin manage" on public.bookings
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bookings: admin delete" on public.bookings;
create policy "bookings: admin delete" on public.bookings
  for delete using (public.is_admin());

drop policy if exists "portfolio: public read" on public.portfolio;
create policy "portfolio: public read" on public.portfolio
  for select using (true);

drop policy if exists "portfolio: admin write" on public.portfolio;
create policy "portfolio: admin write" on public.portfolio
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages: anyone insert" on public.messages;
create policy "messages: anyone insert" on public.messages
  for insert with check (true);

drop policy if exists "messages: admin read" on public.messages;
create policy "messages: admin read" on public.messages
  for select using (public.is_admin());

drop policy if exists "messages: admin manage" on public.messages;
create policy "messages: admin manage" on public.messages
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages: admin delete" on public.messages;
create policy "messages: admin delete" on public.messages
  for delete using (public.is_admin());

-- ============================================================
-- VERIFIED PUBLIC SERVICE COPY
-- No prices, completion times, licensing claims, warranties,
-- emergency availability, or fake customer projects are seeded.
-- ============================================================
insert into public.services
  (slug, name, tagline, description, price_range, duration, sort_order)
values
  (
    'repair',
    'Repairs & Handyman',
    'No job too big or small',
    'Electrical, plumbing, carpentry, flooring, painting, drywall, window and door work, AC/HVAC, alarms/CCTV, furniture assembly, and handyman services.',
    'Free estimate',
    'Based on project scope',
    1
  ),
  (
    'remodel',
    'Remodeling & Interior Work',
    'Kitchens, bathrooms, basements and more',
    'Kitchen remodeling, bathroom remodeling, finished basements, tile and brick work, concrete, flooring, painting, and drywall.',
    'Free estimate',
    'Based on project scope',
    2
  ),
  (
    'addition',
    'Exterior & Property Work',
    'Build, improve and maintain',
    'Landscaping, fencing, ponds, decking, sprinklers, concrete, carpentry, and other residential or commercial property improvements.',
    'Free estimate',
    'Based on project scope',
    3
  )
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  price_range = excluded.price_range,
  duration = excluded.duration,
  sort_order = excluded.sort_order;

-- Portfolio intentionally starts empty.
-- Add only verified K2 project photos through Admin -> Portfolio.
