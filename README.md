# BrandQuill

AI content studio for marketing teams: brand voices, audiences, a knowledge base, eight content templates, a saved library, usage limits and billing. Built with Next.js 14, TypeScript, Tailwind, Supabase and Gemini. Product direction was informed by a public audit of jasper.ai; all copy, branding and code are original.

## Setup
1. `npm install`
2. Create a Supabase project and run `supabase/schema.sql` in the SQL editor (tables, signup trigger, Row Level Security).
3. In Supabase Auth settings, add your site URL and `<site>/auth/callback` as redirect URLs.
4. Copy `.env.example` to `.env.local` and fill it in.
5. `npm run dev`

## Payments
Create Stripe Payment Links for Pro (monthly, yearly) and put them in the `NEXT_PUBLIC_PAYMENT_LINK_*` variables. The Billing page appends `client_reference_id=<workspace id>`. Add a Stripe webhook to `https://<your-domain>/api/webhooks/stripe` (events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`) and set `STRIPE_WEBHOOK_SECRET`. Plans activate **only** via the signature-verified webhook (service role); users cannot write to `subscriptions` (no RLS write policy).

## Vercel
Import the repo, set every variable from `.env.example`, deploy. `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` and `STRIPE_WEBHOOK_SECRET` must stay server-side (no `NEXT_PUBLIC_` prefix).

## Scripts
`npm run typecheck`, `npm test` (unit tests for brand check, plan logic, webhook signature), `npm run build`.

## Known limits
Knowledge accepts pasted text or .txt/.md files (no PDF parsing). No team invitations yet (schema supports multiple members). Business is a fixed-price plan sold through its own payment link.
