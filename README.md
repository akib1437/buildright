# BuildRight — Repairs · Remodels · Additions

A full home-services website with online booking, customer accounts, and a complete admin panel.
Built with **Next.js 14 (App Router) + Supabase**, structured as **MVC**, ready to deploy on **Vercel**.

> Rename the company: everything (name, phone, email, address, hours) lives in
> `src/lib/constants.js` → `SITE`.

---

## Features

**Public site**
- Blueprint-styled landing page: hero, services, portfolio preview, process, contact form
- Portfolio page with category tabs (Kitchens / Bathrooms / Repairs), 6 seeded projects each
- Contact form → lands in the admin Messages inbox

**Customers**
- Email/password signup & login
- Booking flow per service — *Schedule repair*, *Remodel space*, *Plan addition* — with:
  - custom calendar (past dates & Sundays disabled)
  - hourly time slots 09:00–17:00 with **live availability** (taken slots show struck-through)
  - service-specific options (repair type/urgency, room/budget, addition type/size)
  - property type, address, phone, free-text details
- Dashboard: upcoming visits with status + admin notes, cancel button, booking history

**Admin** (`/admin`)
- Separate signup at `/signup/admin` gated by a secret code (`ADMIN_SIGNUP_CODE`)
- Overview: live counts (pending / confirmed / completed / unread messages) + next visits
- **Schedule manager**: filter by status/service/date; confirm, decline, complete, cancel,
  reopen, delete; leave notes customers see on their dashboard
- Portfolio manager: add / edit / delete project photos (any https image URL)
- Services manager: edit copy, price ranges, durations, activate/deactivate
- Customers list with booking counts; contact-message inbox with read/unread

**Security**
- Postgres Row Level Security on every table (customers only see their own bookings)
- Admin role can't be self-assigned — promotion happens server-side via the service-role key
  only after the secret code check
- Middleware guards `/dashboard`, `/schedule/*`, `/admin` (admin also role-checked)

---

## MVC structure

| Layer | Location | Role |
|---|---|---|
| **Models** | `src/models/*.js` | All database reads/writes (Supabase queries). No UI, no validation. |
| **Controllers** | `src/controllers/*.js` | Server actions: validate input, enforce rules (dates, slots, secret code), call models, redirect/revalidate. |
| **Views** | `src/app/**` + `src/components/**` | Pages and React components. Render data, submit forms to controllers. |

Supporting: `src/lib/supabase/` (client/server/service-role clients), `src/lib/constants.js`
(site info, time slots, form options), `middleware.js` (auth guard), `supabase/schema.sql`
(database + RLS + seed data).

---

## 1 · Run locally

```bash
npm install
cp .env.example .env.local
```

### Create the Supabase project
1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is fine).
2. Open **Project Settings → API** and copy into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` public key
   - `SUPABASE_SERVICE_ROLE_KEY` — `service_role` key (keep secret, never expose client-side)
3. Set `ADMIN_SIGNUP_CODE` to a secret of your choosing (default in the example file is
   `buildright-admin-2026` — **change it**).
4. Open **SQL Editor**, paste the entire contents of `supabase/schema.sql`, and click **Run**.
   This creates all tables, RLS policies, triggers, and seeds 3 services + 18 portfolio photos.
5. *(Recommended for development)* **Authentication → Providers → Email** → turn off
   **Confirm email** so signups can log in instantly. Re-enable for production if you want
   verified emails.

### Start it
```bash
npm run dev
```
→ http://localhost:3000

### Create your admin account
Visit **`/signup/admin`**, sign up with the `ADMIN_SIGNUP_CODE` value → you land in `/admin`.
Customers use the normal **`/signup`**.

---

## 2 · Push to GitHub

I can't create the repo for you, but it's three commands once you've made an empty repo
on github.com (no README/.gitignore — this project has both):

```bash
git init && git add -A && git commit -m "BuildRight — initial build"
git remote add origin https://github.com/YOUR-USERNAME/buildright.git
git branch -M main && git push -u origin main
```

`.env.local` is git-ignored — your keys never leave your machine.

---

## 3 · Deploy to Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the GitHub repo.
   Framework is auto-detected as Next.js; no build settings needed.
2. Under **Environment Variables**, add all four:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SIGNUP_CODE`
3. **Deploy.** Every future `git push` to `main` redeploys automatically.
4. *(Optional)* In Supabase **Authentication → URL Configuration**, set the Site URL to your
   Vercel domain so email links point to production.

---

## Customizing

- **Company name / contact / hours** — `src/lib/constants.js` (`SITE`)
- **Time slots & closed day** — same file (`TIME_SLOTS`, `CLOSED_WEEKDAY`)
- **Booking form options** — same file (`SERVICE_FORMS`, `PROPERTY_TYPES`)
- **Colors & fonts** — `tailwind.config.js` + `src/app/globals.css` + `src/app/layout.jsx`
- **Portfolio photos** — Admin → Portfolio (seed photos are Unsplash; if one ever breaks,
  the site shows a graceful placeholder — just paste a new URL in the admin panel)
- **Service copy & pricing** — Admin → Services

## Notes

- One crew is assumed: a time slot with a pending/confirmed booking is blocked for everyone.
  Multi-crew scheduling would mean relaxing `bookingModel.takenSlots`.
- The service-role key is only used server-side (`src/lib/supabase/admin.js`) for admin
  promotion and slot-availability checks — it is never sent to the browser.
