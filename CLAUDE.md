# StackItUp

Personalized supplement stack generator. Six-question quiz → tailored routine. Retro/synthwave aesthetic, science-backed copy.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 3 (no plugins)
- `next/font` for Bungee (display), VT323 (mono), Space_Grotesk (body)
- No database, no auth, no analytics — quiz state lives in client storage

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm start`
- `npm run lint`

## Layout

- `app/` — routes: `/` (landing), `/quiz`, `/results`, `/optimize/[slug]`
- `components/` — shared UI (`HeroStack`, `Reveal`, `SiteHeader`, `SiteFooter`, `NewsletterForm`)
- `lib/` — data (`benefits.ts`, `supplements.ts`) and `storage.ts` for quiz state
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

- Prefer server components. Add `"use client"` only for interactivity (`HeroStack`, `Reveal`, quiz page, newsletter form).
- `Reveal` is for below-the-fold content only — wrapping above-the-fold delays LCP.
- All decorative SVG/emoji get `aria-hidden`; interactive SVG gets `role="img"` + `aria-label`.
- Respect `prefers-reduced-motion` in any JS-driven motion (mirror the pattern in `Reveal.tsx`). CSS animations already have a reduced-motion block in `globals.css`.
- Keep client JS minimal — this site should be mostly static HTML + CSS.
