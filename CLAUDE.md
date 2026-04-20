# StackItUp

Personalized supplement stack generator. Six-question quiz → tailored routine. Retro/synthwave aesthetic, science-backed copy.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 3 (no plugins)
- `next/font` for Bungee (display), VT323 (mono), Space_Grotesk (body)
- Supabase — Google OAuth, `profiles` table with admin role gating, tiers (free/pro), public-profile fields, saved user stacks, feedback, AI rate limits, `avatars` storage bucket
- Stripe — Pro subscription checkout + billing portal (`lib/stripe.ts`, `/api/checkout`, `/api/billing`, `/api/stripe` webhook)
- Google GenAI (`@google/genai`) powers the `/api/chat` supplement assistant; Resend (`lib/email/`) handles transactional mail
- Vitest + Testing Library + jsdom for unit/component/API-route tests; `npm run build` runs `vitest run` first to gate deploys
- Quiz answers still live in client storage (`lib/storage.ts`); auth/profile/stack state is server-rendered via Supabase SSR

## Scripts

- `npm run dev` — dev server
- `npm run build` — runs vitest then `next build`
- `npm start`, `npm run lint`
- `npm test` / `npm run test:watch`
- `npm run generate:guide` — regenerates the downloadable buy guide (`scripts/generate-guide.mjs`)

## Layout

- `app/(site)/` — public routes: `/` landing, `/quiz`, `/results`, `/optimize/[slug]`, `/supplements` + `/supplements/[id]`, `/stacks` (featured), `/best/[slug]`, `/compare`, `/pricing`, `/download` (buy-guide PDF), `/feedback`, `/login`, `/settings` (account + billing), `/u/[username]` (public profile), plus `/privacy`, `/terms`, `/refund`
- `app/admin/` — admin-only: dashboard, `profiles` (role/tier editing), `subscribers`, `supplements`, `feedback`
- `app/api/` — `subscribe`, `chat` (AI), `stack` (save/load user stack), `checkout` + `billing` + `stripe` (Stripe), `download` (gated buy guide)
- `app/auth/` — `callback` (OAuth exchange) and `signout`
- `components/` — shared UI: `AuthNav`, `HeroStack`, `Reveal`, `SiteHeader`, `SiteFooter`, `NewsletterForm`, `SupplementSearch`, `ThemeToggle`, `ChatBot`, `DoseUnitToggle` + `InlineDoseToggle`, `StackTimingNav`, `ShareBar`, `FeedbackForm`, `UpgradeButton`, `ManageBillingButton`, `BuyGuideButton`
- `lib/` — data (`benefits.ts`, `supplements.ts`, `stacks.ts`, `featured-stacks.ts`, `best.ts`, `compare.ts`), quiz `storage.ts`, `dose.tsx` unit conversions, `og.tsx` OG image helper, `rate-limit.ts`, `site.ts`, `stripe.ts`, `email/` (Resend templates), and `supabase/{browser,server,middleware}.ts` clients
- `supabase/migrations/` — `0001_auth`, `0002_admin_profiles`, `0003_public_profiles`, `0004_user_stacks`, `0005_supplement_content`, `0006_ai_rate_limits`, `0007_profile_tier`, `0008_stripe_subscription`, `0009_supplement_video`, `0010_feedback`, `0011_subscribers_authenticated_insert`
- `tests/` — vitest suites for components, lib, and API routes; `tests/setup.ts` wires jest-dom
- `app/globals.css` — component classes (`btn-primary`, `card-retro`, `retro-grid`, `reveal`, quiz slide animations)

## Design vocabulary

Colors (Tailwind tokens in `tailwind.config.ts`):
- `primary` `#D946EF` magenta · `secondary` `#06B6D4` cyan · `accent` `#FBBF24` amber
- `bg` `#1E1B4B` · `bg-deep` `#15123A` · `text` `#E9D5FF`

Signature patterns:
- `.btn-primary` / `.btn-secondary` / `.btn-accent` — chunky 4px border, `shadow-retro` offset, press-down on hover
- `.card-retro` — 4px border, blurred deep-bg fill, accent border on hover
- `.text-gradient` — animated magenta→amber→cyan gradient on headings
- `.retro-grid` — decorative grid overlay (always `aria-hidden`)
- Fonts: `font-display` (Bungee) for headings/CTAs, `font-body` for prose, `font-mono` sparingly
- Headings use uppercase `tracking-[0.3em]` for eyebrow labels

## Conventions

- Prefer server components. Add `"use client"` only for interactivity (`HeroStack`, `Reveal`, quiz page, `NewsletterForm`, `ChatBot`, dose toggles, `FeedbackForm`, Stripe buttons).
- `Reveal` is for below-the-fold content only — wrapping above-the-fold delays LCP.
- All decorative SVG/emoji get `aria-hidden`; interactive SVG gets `role="img"` + `aria-label`.
- Respect `prefers-reduced-motion` in any JS-driven motion (mirror the pattern in `Reveal.tsx`). CSS animations already have a reduced-motion block in `globals.css`.
- Keep client JS minimal — this site should be mostly static HTML + CSS.
