# SEO & Ads playbook

Single reference for how the public site is positioned for search and paid ads.
Code that implements it: `lib/i18n/routes.ts`, `lib/seo/*`, `lib/content/*`,
`lib/analytics/*`, `app/aplicar/*`. Update this file when any of it changes.

## 1. Legal rule (mandatory, enforced by tests)

The Academy is **private, NON-accredited** training. In no text, title, meta,
schema or image may the site say: *acreditado / accredited / certificado oficial /
nationally recognised / Cert III / SHB… / RTO / visa / garantizado / #1 / el mejor*.

- Allowed: "certificado de finalización de Xclusive Academy" — **only if one is really
  delivered** (the pricing card has said so since before this work; confirm it).
- The single, deliberate exception is the FAQ entry **"¿El curso es acreditado?"**
  (and its EN/PT twins in `lib/content/faq.ts`), whose honest answer must name Cert III / RTO to
  say the course is *not* one.
- `tests/seo-legal-words.test.ts` scans every public copy source and fails on anything else.
  The rendered HTML of every page was also scanned (only the FAQ pages match).

## 2. Owner-confirmed facts (do not invent beyond these)

| Fact | Value |
|---|---|
| Venue / address | Xclusive Barber Coburg — 112 Bell St, Coburg VIC 3058, AU |
| Phone / WhatsApp | +61 413 891 977 |
| Instagram | https://www.instagram.com/xclusiveacademy_au |
| Professional program | 12 weeks, ~100 h, 80 % practice / 20 % theory, real clients, kit + uniform |
| Differentiators | inside a real working barbershop · 80 % practice with real clients · taught in Spanish (and English) · small groups + 1-on-1 · zero to professional + how to win clients |
| Response promise | "Te escribimos por WhatsApp en menos de 24 h" |

**Deliberately NOT quantified** (no number was supplied): group size, class schedules, start
dates. **No testimonials** exist in the copy — add real ones only when supplied.

## 3. Languages and URLs

Each language has its own URL ("language follows the URL"); a visitor's browser language or
cookie never changes what a public URL shows. Source of truth: `lib/i18n/routes.ts`.

| Spanish (es-AU, default / x-default) | English (en-AU) | Portuguese (pt-AU) |
|---|---|---|
| `/` | `/en` | |
| `/courses` | `/en/courses` | |
| `/courses/starter` · `/courses/profesional` · `/courses/elite` · `/courses/business` | `/en/courses/starter` · `/en/courses/professional` · `/en/courses/elite` · `/en/courses/business` | |
| `/aplicar` (+ `/aplicar/gracias`) | `/en/apply-now` (+ `/en/apply-now/thank-you`) | |
| `/curso-barberia-melbourne` | `/en/barber-course-melbourne` | `/pt/curso-de-barbeiro-melbourne` |
| `/como-ser-barbero-en-australia` | — | — |

- Every page has a self-referencing canonical + reciprocal `hreflang` (es-AU / en-AU / pt-AU / x-default → Spanish),
  in `<head>` **and** in `sitemap.xml`.
- `<html lang>` is `es-AU` / `en-AU` / `pt-AU`, set server-side and kept in sync on client navigation.
- The language switcher goes to the equivalent URL; the PT page keeps Spanish chrome (no PT dictionary).
- `/apply` is **not** the application form: it is the invite-code registration for already-accepted
  students. The ad landing page is `/aplicar`.

## 4. Titles, descriptions, social cards

`lib/seo/page-meta.ts` — title ≤ 60, description ≤ 155 (test-enforced), absolute titles (brand already inside),
Open Graph + Twitter `summary_large_image` with `public/og/xclusive-barber-academy.jpg` (1200×630, a crop of the
**real** photo of the shop; regenerate with `node scripts/generate-og-image.mjs`).

## 5. Keyword map (one search intent per page)

Used naturally in the H1, first paragraph, one H2 and an image `alt` — never stuffed.

| Page | Intent / keywords |
|---|---|
| Home (ES) | academia de barbería Melbourne · escuela de barberos Melbourne · curso de barbería en español Australia |
| Starter | curso de barbería para principiantes · aprender a cortar pelo Melbourne · clases de barbería desde cero |
| Profesional | curso de barbero profesional · curso de barbería 12 semanas · curso de barbería práctico Melbourne |
| Elite | mentoría barbero 1 a 1 · clases de fade · curso de degradado · mejorar mis fades |
| Business | cómo abrir una barbería en Australia · marketing para barberos · cómo conseguir clientes barbería |
| EN | barber course Melbourne · barber academy Melbourne · beginner barber course · fade course Melbourne · barber mentorship |
| PT | curso de barbeiro Melbourne · curso de barbearia Austrália · aprender a ser barbeiro |

## 6. Structured data (`lib/seo/*`)

- Site-wide: `EducationalOrganization` + `LocalBusiness` (name, url, logo, image, phone, address, Instagram `sameAs`).
- Course pages: `Course` (`inLanguage: ['es','en']`, `hasCourseInstance` → `courseMode: onsite`, Coburg) + `BreadcrumbList`.
  **Never** `educationalCredentialAwarded`; no `offers`/dates (prices are ranges, no confirmed cohorts).
- Pillar pages: `FAQPage` (answers identical to the visible text) + `BreadcrumbList`.
- Not included until provided: Facebook / Google Business Profile `sameAs` URLs, ratings, reviews, opening hours.

## 7. Measurement

See `docs/ANALYTICS_TRACKING_PLAN.md` for IDs, events, the Google Ads conversion
(`AW-16998011333/s44pCMiZnLodEMWjpKk_`), enhanced conversions, gclid/UTM attribution and Meta Pixel events.

## 8. Pending / needs the owner

- Email confirmation to the applicant (no email provider in the project yet).
- Real testimonials, group size, schedules/start dates, Facebook and Google Business Profile URLs.
- A privacy-policy page (the form's consent text has no link yet).
- Confirm the "certificado de finalización" is really delivered.
- Run Google's Rich Results Test and Search Console sitemap submission once deployed.
