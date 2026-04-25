# Upper Hill Academy Morit Cashflow System

A branded school finance desk for Upper Hill Academy Morit built with React, Vite, and Supabase.

## What the app does

- Records money in and money out transactions
- Calculates the current balance from source records
- Supports an opening balance so the cashbook does not always start at zero
- Exports CSV reports and prints a formal school report layout
- Protects access with admin login
- Installs as a PWA on supported desktop and mobile browsers

## Tech stack

- React 19
- Vite
- Supabase Auth + database
- Local storage fallback for resilience
- vite-plugin-pwa

## Local development

```bash
source ~/.nvm/nvm.sh
nvm use 22
npm install
npm run dev -- --host 0.0.0.0
```

Then open [http://localhost:5173/](http://localhost:5173/).

## Environment variables

Create a `.env` file from `.env.example` and provide:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAILS=joanterer57@gmail.com
```

## Supabase setup

Run the SQL in [supabase/transactions.sql](./supabase/transactions.sql) inside the Supabase SQL Editor.

That script creates:

- `admin_users`
- `finance_settings`
- `transactions`
- row-level security policies for admin-only access

Create the admin auth user in Supabase Authentication with the same email used in `VITE_ADMIN_EMAILS`.

## Reports

The Settings page supports:

- downloading CSV reports
- printing a branded school report with summary cards and signature lines

## Mobile install

After deployment:

- Chrome or Edge: open the site and use `Install App`
- iPhone or iPad: open the site in Safari, tap `Share`, then choose `Add to Home Screen`

## Deploy to Vercel

This repository includes [vercel.json](./vercel.json) so React Router routes work after deployment.

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as `Vite`.
3. Add the same environment variables from `.env` into the Vercel project settings.
4. Deploy.

After deployment, use the live URL for school staff access and PWA installation.
