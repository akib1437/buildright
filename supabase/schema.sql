-- ============================================================
-- BuildRight — Supabase schema
-- Run this whole file once in: Supabase Dashboard -> SQL Editor
-- ============================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a user signs up
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

-- Helper used by RLS policies (security definer avoids recursive RLS)
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
  option_1 text not null default '',   -- service-specific (repair type / room / addition type)
  option_2 text not null default '',   -- service-specific (urgency / budget / sqft)
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
alter table public.profiles  enable row level security;
alter table public.services  enable row level security;
alter table public.bookings  enable row level security;
alter table public.portfolio enable row level security;
alter table public.messages  enable row level security;

-- profiles
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = 'customer'); -- can't self-promote

-- services (public catalog; admin writes)
drop policy if exists "services: public read" on public.services;
create policy "services: public read" on public.services
  for select using (true);

drop policy if exists "services: admin write" on public.services;
create policy "services: admin write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- bookings
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

-- portfolio (public read; admin writes)
drop policy if exists "portfolio: public read" on public.portfolio;
create policy "portfolio: public read" on public.portfolio
  for select using (true);

drop policy if exists "portfolio: admin write" on public.portfolio;
create policy "portfolio: admin write" on public.portfolio
  for all using (public.is_admin()) with check (public.is_admin());

-- messages (anyone can send; admin reads/manages)
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
-- SEED DATA
-- ============================================================
insert into public.services (slug, name, tagline, description, price_range, duration, sort_order)
values
  ('repair',  'Schedule a Repair', 'Fast fixes, done right',
   'Electrical, plumbing, carpentry, flooring, painting, drywall, windows & doors, AC/HVAC, alarms/CCTV, furniture assembly and handyman services. Same-week visits for most jobs.',
   '$90 – $600', '1 – 4 hours', 1),
  ('remodel', 'Remodel a Space', 'Reimagine a room',
   'Full kitchen, bathroom and finished-basement remodels plus tile, brick and concrete work — design, demolition, build and finish under one contract.',
   '$8,000 – $60,000', '2 – 8 weeks', 2),
  ('addition','Plan an Addition', 'Grow your home',
   'Room additions, second floors, garages, decks, fencing, ponds, landscaping and sprinklers. We handle drawings, permits and construction end to end.',
   '$25,000 – $180,000+', '6 – 20 weeks', 3)
on conflict (slug) do nothing;

insert into public.portfolio (category, title, description, image_url, sort_order) values
  ('kitchen','Maple Street kitchen','Full gut renovation with quartz counters and custom oak cabinetry.','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=70',1),
  ('kitchen','Galley refresh','Opened a closed galley into the dining room; new island and lighting.','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=70',2),
  ('kitchen','Farmhouse rework','Shaker fronts, apron sink and reclaimed shelving.','https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=70',3),
  ('kitchen','Compact condo kitchen','Storage-first layout for a 40 m² condo.','https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=70',4),
  ('kitchen','White-on-white classic','Handleless cabinetry with warm brass accents.','https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=70',5),
  ('kitchen','Open-plan conversion','Removed a load-bearing wall; beam concealed in the ceiling.','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=70',6),
  ('bath','Spa primary bath','Freestanding tub, heated floors, walk-in rain shower.','https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=70',1),
  ('bath','Terrazzo guest bath','Compact guest bath with terrazzo tile and black fittings.','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=70',2),
  ('bath','Hotel-style ensuite','Double vanity and frameless glass enclosure.','https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=70',3),
  ('bath','Light & bright refit','Skylight added over the shower; full re-tile.','https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=70',4),
  ('bath','Modern half bath','Floating vanity and backlit mirror in 3 m².','https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=70',5),
  ('bath','Accessible remodel','Curbless shower and grab bars without the clinical look.','https://images.unsplash.com/photo-1620626012053-9d5a9b1cdbf5?auto=format&fit=crop&w=1200&q=70',6),
  ('repairs','Deck board replacement','Rot repair and refinish on a 12-year-old cedar deck.','https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=70',1),
  ('repairs','Electrical panel upgrade','100A to 200A service upgrade with permit.','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=70',2),
  ('repairs','Drywall & paint','Water-damage repair, skim coat and repaint.','https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=70',3),
  ('repairs','Leak trace & fix','Found and fixed a slow leak behind the laundry wall.','https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=70',4),
  ('repairs','Door & trim tune-up','Re-hung five doors, replaced casing throughout.','https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=1200&q=70',5),
  ('repairs','Fence post reset','Six posts reset in concrete after storm damage.','https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=70',6)
on conflict do nothing;

-- ============================================================
-- Done. Next steps (see README):
-- 1. In Authentication -> Providers -> Email, you may disable
--    "Confirm email" for instant sign-in during development.
-- 2. Create your admin account at /signup/admin using the
--    ADMIN_SIGNUP_CODE from your .env.local.
-- ============================================================
