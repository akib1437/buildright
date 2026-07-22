# K2 Contractors LLC Website

A Next.js and Supabase website for K2 Contractors LLC with public service pages,
free-estimate requests, customer accounts, request tracking, contact messages,
and an admin panel.

## Verified public business information

The public copy uses the supplied K2 marketing materials:

- Company: **K2 Contractors LLC**
- Slogan: **We Make It Happen**
- Phone: **(314) 623-3958**
- Email: **yourstlcontractor@gmail.com**
- Instagram: **@k2contractors**
- Service area shown: **St. Louis area**
- Project types: **Residential & Commercial**
- Offer: **Free estimates**
- Message: **No job too big or small**

No street address, published hours, emergency availability, licensing status,
warranty, founding year, performance statistics, or verified customer reviews
were supplied. The website does not claim them.

## Features

**Public site**
- Service overview and complete K2 service list
- Free-estimate request flow
- Representative service gallery
- Contact form
- Phone, email, Instagram, and service-area information

**Customers**
- Email/password signup and login
- Date/time request flow with live slot availability
- Property, contact, scope, and timing fields
- Dashboard for request status and admin notes

**Admin**
- Schedule manager
- Service editor
- Portfolio manager
- Customer list
- Contact-message inbox

## Project structure

| Layer | Location | Role |
|---|---|---|
| Models | `src/models/*.js` | Supabase reads and writes |
| Controllers | `src/controllers/*.js` | Validation and server actions |
| Views | `src/app/**`, `src/components/**` | Pages and React components |

Public company details and service copy are centralized in:

- `src/lib/constants.js`
- `src/lib/locale.js`

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Use your existing Supabase project values in `.env.local`. Keep that file local
and never commit it.

## Database setup

Run `supabase/schema.sql` in the Supabase SQL Editor. It creates the tables,
policies, and verified public service copy. The portfolio starts empty so fake
projects are not presented as K2 work. Add verified project photos through the
admin portfolio manager.

## Deployment

Import the repository into Vercel and configure the required environment
variables in the Vercel project settings. Future pushes to `main` redeploy
automatically.

## Customization

- Company/contact/service copy: `src/lib/constants.js`
- Location and FAQ copy: `src/lib/locale.js`
- Request windows and form options: `src/lib/constants.js`
- Colors and fonts: `tailwind.config.js`, `src/app/globals.css`
- Verified project photos: Admin → Portfolio
- Service records: Admin → Services
