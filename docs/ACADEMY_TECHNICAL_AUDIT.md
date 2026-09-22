# Xclusive Barber Academy — Technical & SEO Audit

**Date:** 2026-09-21
**Scope:** Full repository (`Marlon0144/xclusive-barber-Academy`, branch `main` @ `cde3a43`), Supabase schema (as documented + verified against code), SEO, analytics, CRM, security.
**Method:** Direct inspection of source code, existing `docs/*.md`, `.ai/PROJECT_CONTEXT.md`, git history. No destructive actions taken. No production data touched.

> This is an audit only. No implementation has been done beyond writing this document.

---

## 1. Current architecture

Confirmed against code (not just docs):

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 15.3 |
| UI | React | 19.0.0 |
| Language | TypeScript strict | 5.x |
| Styling | Tailwind CSS v4 (`@theme inline`) | 4.1.x |
| Backend | Supabase (Postgres 17.6, Auth, Storage) | project `xmyqswwitqlhrzznrscy`, region `us-east-2` |
| AI | OpenAI (`gpt-4o-mini`) for grading feedback | 6.17.x |
| Rich text | Tiptap | 3.19.x |
| Sanitization | `isomorphic-dompurify` + `jsdom` | ok |

Architecture pattern: Server Components by default, Server Actions for mutations, dual Supabase client (`createClient()` cookie-scoped vs `createAdminClient()` service-role). This is a sound, modern pattern and is well documented in [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [docs/ROUTES.md](../docs/ROUTES.md), [docs/DATABASE.md](../docs/DATABASE.md), [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md). These docs are largely accurate and should be preserved and kept up to date rather than replaced.

Existing internal docs (`.ai/PROJECT_CONTEXT.md`, `.ai/guia y estado actual del front-end.md`) contain additional sprint history — useful context, not duplicated here.

## 2. Existing features (verified)

- Public landing page (`/`) with progressive-reveal lead capture gate (blurs sections until email+phone captured).
- `/apply` — invite-code gated registration (creates Supabase Auth user + `profiles` row + seed `crm_leads` row).
- `/qualify` (public) and `/dashboard/qualify` (authenticated) — Typeform-style qualification wizard feeding CRM lead scoring, redirecting to a pre-filled WhatsApp deep link (`https://wa.me/61413891977`).
- `/login`, `/signup` (legacy, superseded by `/apply` — dead-ish code, still routable).
- `/dashboard` hub with role-based cards (student/instructor/admin).
- Course viewer with video (YouTube) + Tiptap HTML lesson content, per-lesson completion tracking.
- `/dashboard/tracker` — practice photo submission with AI-assisted grading (`/dashboard/grading`) producing scores + OpenAI feedback text.
- `/dashboard/progreso_profesional` — computed competency/level progress (pure RSC, no DB writes).
- `/dashboard/admin/courses` — module/lesson CRUD with drag-and-drop reorder.
- `/dashboard/admin/gestion_users` — invite code management, role management, user deletion.
- `/dashboard/admin/leads` — CRM pipeline review UI with manual status/notes.
- Bilingual (ES/EN) UI via a cookie-based `LanguageProvider`, not route-based.
- Middleware-based auth guard for `/dashboard/*`.

## 3. Supabase architecture (as it actually exists)

Tables confirmed in code/docs: `profiles`, `modules`, `lessons`, `lesson_progress`, `submissions`, `invitations`, `crm_leads`, `crm_lead_answers`. No `courses`, `programs`, `enrolments`, `payments`, `workshops`, `attendance` tables exist yet — these are **not** built, contrary to what a generic LMS naming scheme might suggest. Do not assume they exist; anything referencing "courses" in the roadmap must be built on top of `modules`/`lessons`, or a new `courses`/`programs` layer must be designed to represent the 4 commercial offers (Starter, Professional, Mentoría Elite, Business).

RLS is enabled on all tables per [docs/DATABASE.md](../docs/DATABASE.md#row-level-security-rls). Documented, self-reported inconsistency: some admin policies check JWT metadata, others check `profiles.role` — flagged as P1 below, not something to silently "fix" without testing (RLS changes are high blast-radius).

Storage: `submissions` bucket, public read, path `{user_id}/{timestamp}.{ext}`, 15MB limit, image MIME allowlist. Reasonable.

Admin (service-role) client usage was traced across the whole repo (`createAdminClient` call sites): it is used only inside Server Actions and async Server Components (`page.tsx`/`actions.ts` files with no `'use client'` directive). **No client-side leak of the service-role key was found.** `.env*` is correctly gitignored and no secrets are committed.

Migration history exists as loose SQL files in `scripts/` (`2026-04-01-*.sql`) rather than a formal Supabase migration pipeline (`supabase/migrations`). This works but has no rollback tracking and no CI validation.

## 4. SEO status — **this is the weakest area of the project**

Verified by direct search of the codebase (not assumption):

- **No `sitemap.xml` or `robots.txt`** anywhere in `app/` — zero hits when searching for either.
- **No favicon, no `app/icon.*`, no manifest** — `public/` only has default Next.js placeholder SVGs (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) and one real brand asset. A production site with zero favicon is a visible trust/quality signal problem, not just an SEO one.
- **No structured data anywhere** — zero hits for `application/ld+json` or `schema.org` in the entire codebase. No Organization, EducationalOrganization, Course, FAQPage, or BreadcrumbList markup exists.
- **`generateMetadata`/per-route `metadata` exports exist on only 2 of ~17 routes** (root `layout.tsx` and `dashboard/progreso_profesional/page.tsx` — the latter being a protected, non-indexable page, so effectively **every public marketing page shares one static title/description from the root layout**). `/apply`, `/qualify`, and the landing page itself have no route-specific title, description, canonical URL, or OpenGraph tags.
- **Critical positioning conflict:** [lib/i18n/dictionaries.ts:130](../lib/i18n/dictionaries.ts) and line 530 contain the literal hero subtitle copy **"EDUCACIÓN PROFESIONAL EN BARBERÍA PARA LATINOS" / "PROFESSIONAL BARBER EDUCATION FOR LATINOS"** — this is the first thing a visitor and a search engine sees, and it directly contradicts the explicit business decision (§2 of your brief) that the Academy must not be positioned as Latino-only. This is not a hypothetical risk — it's live copy today.
- **i18n is cookie-based, single-URL** ([lib/i18n/config.ts](../lib/i18n/config.ts)): there is no `/en` vs `/es` route split, just a `preferred_language` cookie that swaps dictionary content client/server-side on the same URL. Consequences:
  - Google can only ever index **one** language version of any given URL (whichever the crawler's default Accept-Language resolves to — currently **Spanish is the hard-coded default**, `DEFAULT_LANGUAGE = 'es'`).
  - `hreflang` is architecturally impossible without separate URLs.
  - This actively works against the "English = primary SEO language" requirement, since the default language search engines will most often see is Spanish.
- No canonical URL handling, no `robots` meta, no `next-sitemap`/`generateSitemaps` usage.

**Net assessment:** SEO is not "underdeveloped," it is functionally **absent** beyond a single static `<title>`. This is good news in one sense — there's no legacy SEO debt to unwind, it's a clean build.

## 5. Analytics status

Verified by exhaustive grep across `.ts`/`.tsx`/env files for `gtag`, `googletagmanager`, `fbq`, `GTM-`, pixel references: **zero results**. There is no GA4, no GTM container, no Meta Pixel/Conversions API, and no `NEXT_PUBLIC_GA_*`/`NEXT_PUBLIC_GTM_*`/`NEXT_PUBLIC_FB_PIXEL_*` env vars declared anywhere (confirmed against actual `process.env.*` usage list, which only contains Supabase and OpenAI keys).

There is, notably, **already a meaningful proto-funnel in the CRM** (`stage1_entered_at` → `stage4_entered_at` in `crm_leads`, described in [docs/DATABASE.md](../docs/DATABASE.md#crm_leads)) that tracks phone-capture → apply-visit → qualification-complete → account-activated. This is a good foundation to mirror into GA4/Meta custom events rather than reinventing funnel logic.

## 6. Performance issues

- `next.config.ts` sets `images.remotePatterns` to `{ protocol: "https", hostname: "**" }` — this **disables the security/performance benefit of Next's remote image allowlist** by allowing any HTTPS host to be optimized through the app's image proxy. Should be scoped to the actual Supabase Storage domain and any CDN in use.
- `public/assets/landing/barbershop-hero.jpg` is **4.4MB** as a source file; several dashboard background PNGs are 500KB–1.2MB. Even with `next/image` optimization at request time, these are unusually large sources for hero/background imagery and will affect LCP, especially on mobile.
- No bundle analysis, no `next/font` issues found (Poppins is loaded correctly via `next/font/google` with `display: swap` — this part is done right).
- No caching strategy documented beyond `React.cache()` request-dedup (which is real and correctly used per [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md#performance-patterns)).

## 7. UX/CRO problems

- The landing page **forces a blur/lock gate** requiring email+phone capture before a visitor can see Features, Mission/Vision, Instructor, or Pricing sections ([docs/ROUTES.md](../docs/ROUTES.md) "Progressive reveal behavior"). This is an aggressive pattern: it may lift lead capture rate but can also suppress organic engagement/dwell time (a negative SEO/UX signal) and will frustrate paid-traffic visitors who bounce before converting because they can't even see pricing. Worth an explicit product decision, not a silent default.
- `/signup` (legacy) is still live and routable alongside `/apply` (current), meaning two different registration flows exist in production simultaneously — confusing if it's still linked anywhere, and dead weight if not.
- Pricing/programs information architecture is currently a single homepage section (`PricingSection`), not dedicated indexable `/courses/*` pages — this limits both SEO (no unique page per program to rank) and CRO (can't build a deep, objection-handling sales page per program).
- No dedicated `/contact`, `/about`, `/faq` routes exist yet.

## 8. Security concerns

- **No critical vulnerabilities found.** Service-role key is never referenced outside server-only files; `.env*` is gitignored; RLS is enabled on all tables; Server Actions follow an auth → authorize → validate → mutate → revalidate pattern per [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md#server-actions).
- **P1:** Documented RLS inconsistency — some admin policies check JWT metadata, others check `profiles.role` (self-flagged in [docs/DATABASE.md:280-282](../docs/DATABASE.md)). This should be audited row-by-row before any new admin surface is added, since inconsistent policy logic is exactly the kind of thing that produces privilege-escalation bugs later.
- **P2:** `images.remotePatterns: "**"` (see §6) is a minor SSRF-adjacent/abuse surface via the image optimizer, not just a perf issue — arbitrary URLs can be requested through the app's image proxy.
- **P3:** No rate limiting visible on public, unauthenticated Server Actions (`capturePhoneLead`, `submitPublicLeadQualification`, `applyAccess`) — these accept public form submissions and could be spammed (fake leads, invite-code brute forcing). Not urgent, but relevant before running paid ads that will draw bot traffic to public forms.
- No testing framework, so no automated regression protection for auth/RLS logic changes ([docs/DEVELOPMENT.md:220-225](../docs/DEVELOPMENT.md)).

## 9. Technical debt (self-documented + verified)

From [docs/DATABASE.md:545-552](../docs/DATABASE.md), confirmed still accurate:

| # | Area | Description | Priority |
|---|---|---|---|
| 1 | RLS | Admin policies inconsistently check JWT metadata vs. `profiles.role` | P1 |
| 2 | Types | Some inline types could be extracted to `types/` | P3 |
| 3 | Validation | Not all Server Actions use Zod schemas | P2 |

Additional debt found during this audit:

| # | Area | Description | Priority |
|---|---|---|---|
| 4 | Dead code | `/signup` legacy route still live alongside `/apply` | P2 |
| 5 | Migrations | Ad-hoc SQL files in `scripts/`, no formal migration/rollback pipeline | P2 |
| 6 | Repo hygiene | `build-check.log` is committed to git (stray build output, harmless but noisy) | P3 |
| 7 | Testing | Zero test coverage on auth, RLS-sensitive Server Actions, or lead scoring logic | P2 |
| 8 | CI/CD | No `.github/workflows` or equivalent — no automated build/lint/type-check gate before deploy | P1 |

## 10. Features that should be preserved as-is

- Dual Supabase client pattern and its documented usage rules.
- Server Components-by-default + `React.cache()` performance pattern.
- Invite-code controlled onboarding.
- CRM stage-timestamp model (`stage1_entered_at`...`stage4_entered_at`) — it's a genuinely useful foundation for attribution reporting later, don't replace it with a new schema.
- AI-assisted grading flow (submissions → OpenAI feedback → instructor review).
- Existing `docs/*.md` documentation set — keep it current rather than creating a parallel/competing doc set.
- Design tokens (gold/dark theme) and Poppins typography setup — solid, Figma-derived, and internally consistent. (Note: your brief specifies emerald green as a premium accent; current tokens are gold-based — worth a deliberate brand decision, not an audit-time change.)

## 11. Features that need improvement (not rebuild)

- SEO layer: metadata, sitemap, robots, structured data, per-route canonicals — build additively, nothing to "fix" because nothing exists yet.
- i18n routing: migrate from cookie-swap to route-based (`/` = English default, `/es` = Spanish) to make hreflang and per-language indexing possible. This is an architectural change and needs careful planning (redirects, existing cookie users, existing internal links).
- Homepage positioning copy — remove "PARA LATINOS" as the primary hero framing without removing Spanish-language support or the Latino-community differentiator entirely (per your brief, it should be *a* differentiator, not the whole positioning).
- Program pages — promote the 4 offers from homepage sections to real indexable routes.
- Admin RLS policy consistency (P1 above).
- Add minimal rate limiting / spam protection to public lead-capture actions before scaling ad spend.

## 12. Recommended architecture (target state, incremental)

No rebuild. Additive changes on top of the current Next.js App Router structure:

```
app/
 (marketing)/              # new route group, public pages get metadata
   page.tsx                # landing (existing, enhanced)
   courses/
     page.tsx
     barber-starter/page.tsx
     professional-barber-program/page.tsx
   mentoring/page.tsx
   workshops/page.tsx        (Barber Business Experience)
   about/page.tsx
   contact/page.tsx
   faq/page.tsx
 es/                        # mirrored routes for Spanish, once hreflang-ready
 sitemap.ts                 # Next.js Metadata API sitemap generator
 robots.ts                  # Next.js Metadata API robots generator
```

Analytics: a single `lib/analytics/` abstraction wrapping GTM's `dataLayer.push`, so GA4/Meta events are fired once per business event (per §11 of your brief) rather than scattered `gtag()` calls across components.

Structured data: colocate JSON-LD generation with each route's `generateMetadata` or a small `<JsonLd>` component, sourced from real, verifiable business facts only (no invented review counts, no invented completion rates).

## 13. Implementation roadmap

Priorities: P0 critical, P1 high, P2 medium, P3 future.

| Phase | Contents | Priority | Files affected | DB changes | New env vars | Risk |
|---|---|---|---|---|---|---|
| 0 | Baseline: add `.env.example`, document current env vars, add basic CI (lint+typecheck+build on PR) | P1 | `.github/workflows/ci.yml`, `.env.example` | None | None | Low |
| 1 | Critical fixes: remove/soften "PARA LATINOS" hero framing, scope `images.remotePatterns`, add favicon/manifest, audit RLS admin policies for consistency | P0/P1 | `lib/i18n/dictionaries.ts`, `next.config.ts`, `app/icon.*`, Supabase policies | Policy-only (no schema change), reviewed manually | None | Low–Medium (RLS changes need careful testing) |
| 2 | Technical SEO: `sitemap.ts`, `robots.ts`, per-route `generateMetadata`, canonical URLs, OpenGraph, JSON-LD (Organization, EducationalOrganization) | P1 | new files under `app/`, `app/layout.tsx` | None | `NEXT_PUBLIC_SITE_URL` | Low |
| 3 | Analytics infra: GTM container, GA4, Meta Pixel, `lib/analytics/` event abstraction, wire to existing CRM funnel stages | P1 | new `lib/analytics/*`, layout, form components | None | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Low |
| 4 | Homepage/public UX/CRO: reconsider blur-gate pattern, add location/map section (Xclusive Barber, Coburg), founder section, FAQ | P2 | `components/landing/*`, `app/page.tsx` | None | None | Low |
| 5 | Program pages: `/courses/*`, `/mentoring`, `/workshops` as real routes with unique content | P2 | new `app/(marketing)/*` routes | Possibly new `courses`/`programs` table if content needs to be admin-editable | None | Medium (new data model decision) |
| 6 | Lead capture + CRM hardening: rate limiting on public actions, dedupe checks | P2 | `app/landing/actions.ts`, `app/qualify/actions.ts`, `app/apply/actions.ts` | None or minor indexes | None | Low |
| 7 | Google Ads / Meta readiness: conversion events, UTM persistence into `crm_leads` | P1 | analytics lib, apply/qualify actions | Add UTM columns to `crm_leads` if not present (need to verify — not currently documented) | Ads/Meta conversion IDs | Low |
| 8 | Student platform improvements | P3 | `app/dashboard/*` | Only if certificates/attendance are added | None | Medium |
| 9 | Content/SEO expansion (blog, local landing pages) | P3 | new routes | None | None | Low |
| 10 | Automation/reporting | P3 | TBD | TBD | TBD | TBD |

Each phase should ship as its own PR with a rollback = revert commit (no destructive migrations without a tested-down migration first).

---

## Answers to your 8 questions

**1. What currently works well?**
The engineering fundamentals are genuinely solid: Server Components by default, `React.cache()` dedup, dual Supabase client with correct service-role isolation (no leaks found), a documented and mostly-consistent Server Action pattern, and a real CRM funnel already tracking stage timestamps. The existing `docs/` set is accurate and worth keeping as the source of truth.

**2. What is broken?**
Nothing is functionally broken in the sense of bugs causing failures. The "brokenness" is a strategic/content problem: the live hero copy says "FOR LATINOS," which directly contradicts your positioning decision, and the i18n architecture defaults to Spanish with no way to give English its own indexable URL.

**3. What is unnecessary?**
The legacy `/signup` route (superseded by `/apply`), the committed `build-check.log`, and the wide-open `images.remotePatterns: "**"`.

**4. What is missing?**
Essentially all of SEO (sitemap, robots, metadata per route, structured data, favicon), all of analytics (GA4/GTM/Meta), CI/CD, tests, and dedicated indexable program pages. None of this is a "fix" — it's greenfield work on top of a clean foundation.

**5. Ten highest-impact improvements** (roughly in priority order):
1. Remove "PARA LATINOS" as the primary hero positioning (P0 — copy-only, near-zero risk, direct conflict with stated strategy).
2. Add `sitemap.ts` + `robots.ts` + per-route metadata (P1 — currently the site is close to invisible to search engines beyond the homepage).
3. Migrate i18n from cookie-swap to route-based `/en`+`/es` for real hreflang support (P1 — needed before English can be "primary SEO language").
4. Stand up GA4 + GTM + Meta Pixel via env-var-driven config, wired to existing CRM funnel stages (P1 — you're currently flying blind on every channel).
5. Add favicon/manifest (P1 — trivial fix, currently a visible trust gap).
6. Audit and fix RLS admin-policy inconsistency (P1 — security correctness before scaling admin users).
7. Scope `images.remotePatterns` to actual domains (P2 — quick, closes a minor abuse vector).
8. Promote the 4 programs to dedicated `/courses/*` routes with structured data (P2 — unlocks both SEO and CRO).
9. Add basic CI (lint/typecheck/build) before merge (P1 — cheap insurance against regressions once more people touch this).
10. Add rate limiting to public lead-capture actions before running paid ads (P2 — protects CRM data quality and ad spend).

**6. What should we NOT change?**
The Supabase dual-client security pattern, the Server Components/`React.cache()` performance pattern, the invite-code onboarding system, the CRM stage-timestamp schema, and the existing `docs/*.md` structure. Also do not touch RLS policies without first writing out the exact before/after policy SQL and testing against a Supabase branch — this is the one area where a "quick fix" could silently break data isolation.

**7. What should Phase 1 contain?**
Given your own "First: audit, then show findings, then roadmap, only then implement" rule, Phase 1 (once approved) should be the P0/P1 items with the lowest blast radius and highest signal: (a) hero copy fix, (b) favicon/manifest, (c) `images.remotePatterns` scoping, (d) RLS admin-policy audit (audit + a Supabase branch to test fixes, not a direct prod policy edit), (e) basic CI. Technical SEO (sitemap/robots/metadata) is a natural Phase 2 immediately after, since it's additive and low-risk but slightly larger in surface area.

**8. Credentials/IDs I'll eventually need from you:**
- Google Search Console verification (property for `xclusiveacademy.com.au`)
- Google Tag Manager container ID
- Google Analytics 4 measurement ID
- Google Ads conversion ID(s) + conversion labels
- Meta Pixel ID / Meta Dataset ID (and a System User access token if server-side Conversions API is wanted later)
- Confirmation of the existing Xclusive Barber Google Maps/Business Profile place ID or share link, to embed correctly
- Any existing OpenAI/Supabase project owner access if I need to inspect RLS policies directly via SQL rather than inference from docs (I have not queried the live Supabase project in this audit — everything above is from code + committed docs, not a live DB connection)
