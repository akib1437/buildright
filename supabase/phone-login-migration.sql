-- ============================================================
-- BuildRight phone-login migration
-- Run once in Supabase Dashboard -> SQL Editor on the existing project.
-- ============================================================

-- Normalize US phone numbers to E.164. International numbers must already
-- include a leading + and country code.
create or replace function public.normalize_login_phone(input_phone text)
returns text
language plpgsql
immutable
as $$
declare
  raw text := btrim(coalesce(input_phone, ''));
  digits text := regexp_replace(btrim(coalesce(input_phone, '')), '[^0-9]', '', 'g');
begin
  if raw like '+%' and char_length(digits) between 8 and 15 then
    return '+' || digits;
  end if;

  if char_length(digits) = 10 then
    return '+1' || digits;
  end if;

  if char_length(digits) = 11 and left(digits, 1) = '1' then
    return '+' || digits;
  end if;

  return '';
end;
$$;

-- New signups put phone into auth metadata; copy it into profiles automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    public.normalize_login_phone(new.raw_user_meta_data ->> 'phone')
  );
  return new;
end;
$$;

-- Normalize phone values already stored in profiles.
update public.profiles
set phone = public.normalize_login_phone(phone)
where coalesce(phone, '') <> ''
  and public.normalize_login_phone(phone) <> '';

-- Backfill from auth metadata where available.
update public.profiles p
set phone = public.normalize_login_phone(u.raw_user_meta_data ->> 'phone')
from auth.users u
where p.id = u.id
  and coalesce(p.phone, '') = ''
  and public.normalize_login_phone(u.raw_user_meta_data ->> 'phone') <> '';

-- Backfill older customer accounts from their latest booking phone.
with latest_booking_phone as (
  select distinct on (b.user_id)
    b.user_id,
    public.normalize_login_phone(b.phone) as phone
  from public.bookings b
  where public.normalize_login_phone(b.phone) <> ''
  order by b.user_id, b.created_at desc
)
update public.profiles p
set phone = lbp.phone
from latest_booking_phone lbp
where p.id = lbp.user_id
  and coalesce(p.phone, '') = '';

-- Phone login must map to one account only. Stop with a clear message if
-- existing data assigns the same normalized number to multiple profiles.
do $$
begin
  if exists (
    select phone
    from public.profiles
    where phone ~ '^\+[1-9][0-9]{7,14}$'
    group by phone
    having count(*) > 1
  ) then
    raise exception 'Duplicate profile phone numbers found. Make each login phone unique, then run this migration again.';
  end if;
end;
$$;

create unique index if not exists profiles_phone_unique_idx
  on public.profiles (phone)
  where phone ~ '^\+[1-9][0-9]{7,14}$';
