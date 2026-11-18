# Analytics Tracking Plan

Status: **live** — GTM, GA4, Google Ads, and Meta Pixel are all wired with the
business's real IDs hardcoded as defaults in `lib/analytics/config.ts`.
See `docs/ACADEMY_TECHNICAL_AUDIT.md` §5 for the original gap this closes
("zero analytics infrastructure — no GTM, no GA4, no Meta Pixel, no `track()`
helper wired to the CRM funnel").

## How it works

Each provider is feature-flagged on whether its ID resolves to a non-empty
string. Real IDs are hardcoded as defaults in `lib/analytics/config.ts` (see
below), so all three providers are live as soon as this code is deployed —
no Vercel dashboard action required. An optional `NEXT_PUBLIC_*` env var, if
set, overrides the hardcoded default (useful for a preview/staging deploy
that should report to a separate test container instead of the production
one).

| Env var (optional override) | Hardcoded default | Purpose | Where read |
|---|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | `GTM-TD78R9X9` | Google Tag Manager container ID | `lib/analytics/config.ts` → `components/analytics/GoogleTagManager.tsx` |
| `NEXT_PUBLIC_GA4_ID` | `G-TX8M33DNRH` | GA4 measurement ID — loaded directly via gtag.js, independent of GTM | `lib/analytics/config.ts` → `components/analytics/GoogleAnalytics.tsx` |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | `AW-16998011333` | Google Ads tag ID — configured through the **same** gtag.js loader as GA4 (no second script) | `lib/analytics/config.ts` → `components/analytics/GoogleAnalytics.tsx` |
| `NEXT_PUBLIC_META_PIXEL_ID` | `1169356005611386` | Meta/Instagram Pixel ID | `lib/analytics/config.ts` → `components/analytics/MetaPixel.tsx` |

None of these are secrets (tracking IDs are not sensitive — they're visible
in every page's HTML/network requests once live).

**Important — avoid double-counting GA4 pageviews:** GA4 is loaded two
independent ways here — directly via `GoogleAnalyticsScript` (gtag.js), and
potentially again if a GA4 Configuration tag is ever added inside the GTM
container. Both write to the same `window.dataLayer`, which is safe on its
own, but if a GA4 Configuration tag is added inside GTM, GA4 will receive
two PageView pings per page load. Pick one path — the direct gtag.js loader
already covers GA4, so there's no need to also configure GA4 inside GTM
unless the direct loader is removed first.

## Google tag: GA4 + Google Ads through one gtag.js

`GoogleAnalyticsScript` (`components/analytics/GoogleAnalytics.tsx`) downloads
gtag.js **once** (bootstrapped with the GA4 ID) and registers each destination
with its own `gtag('config', id)` call: `G-TX8M33DNRH` (GA4) and
`AW-16998011333` (Google Ads). Don't add a second `<script src=".../gtag/js">`
for Ads — and don't also add a Google tag / Google Ads tag for the same IDs
inside the GTM container, or each destination receives its pings twice.

When GTM is also on the page (it is), Google's runtime injects one extra
`gtag/js?id=AW-…&cx=c&gtm=…` request for the new Ads destination. That is
expected, not a duplicate loader. Verified: one GA4 `page_view`, one set of Ads
config pings per page load.

**No Content-Security-Policy is set** (checked `next.config.ts`, `middleware.ts`,
and the live response headers on 2026-11-17), so no CSP allow-listing is
needed today. If a CSP is ever added, the Google Ads/GA4 tags need these
origins: `googletagmanager.com`, `google-analytics.com`, `googleadservices.com`,
`googleads.g.doubleclick.net`, `td.doubleclick.net`, `www.google.com`
(+ `www.google.com.au` for AU remarketing) under `script-src`, `img-src` and
`connect-src` as appropriate.

## Direct gtag events (`academy_*`)

`lib/analytics/gtag.ts` (`gtagEvent`, `gtagEventThen`) sends events straight to
the Google tag with `gtag('event', …)`. It is deliberately separate from
`track()`: `track()` only pushes plain objects to `dataLayer` for GTM, which
gtag.js ignores, and routing the old events through gtag too would double-count
anything the GTM container already forwards. The `academy_*` names are new, so
they can't collide.

| Event | Fired when | Params | Source |
|---|---|---|---|
| `academy_apply_submit` | `/qualify` wizard submitted **successfully** (server saved the lead) | `form: 'qualify'`, `programa` (`starter` \| `profesional` \| `elite` \| `business`, omitted when no plan was chosen) | `app/qualify/QualifyForm.tsx` |
| `academy_apply_submit` | `/apply` signup completed **successfully** (account created, invite code redeemed) | `form: 'apply'` (`programa` isn't known here) | `components/analytics/ApplicationSuccessTracker.tsx` |
| `academy_whatsapp_click` | Any link to `wa.me` is clicked, anywhere on the site | `link_url` (origin + path, **without** the `?text=` message), `page_path` | `components/analytics/OutboundContactTracker.tsx` |
| `academy_phone_click` | Any `tel:` link is clicked, anywhere on the site | `link_url` (`tel:…`), `page_path` | `components/analytics/OutboundContactTracker.tsx` |

Notes:

- **Success, not click.** Both form events fire only after the server action
  succeeded (validation errors, rate-limit errors, etc. do not count).
- **`/qualify` no longer redirects server-side.** `submitPublicLeadQualification`
  used to end with `redirect(whatsappUrl)`, which unloads the page before any
  client code can report the conversion. It now returns
  `{ error: null, redirectUrl, programa, leadId, userData }`; `QualifyForm` calls
  `reportLeadSubmission(…, { then: () => window.location.assign(url) })`, which
  reports the conversion (see "Lead conversion" below) and navigates as soon as
  Google confirms dispatch (≈5 ms in testing) or after the wait cap, or
  immediately if gtag.js is blocked — a visitor is never stuck waiting on
  analytics. The client only navigates to a `wa.me` URL.
- **`/apply`** (invite-code registration) still uses the cookie bridge described below; the same
  tracker fires both `application_submit` (GTM/Meta) and `academy_apply_submit`
  (`form: 'apply'`). It does **not** report the Google Ads conversion: that person was already
  counted as a lead at `/qualify` or `/aplicar`, and counting the enrolment too would double-count.
- **Click tracking is a single delegated listener** (capture phase) in the root
  layout, so every current and future `wa.me` / `tel:` link is covered without
  touching call sites. It is additive to `TrackedLink`'s GTM-routed
  `whatsapp_click`. Dashboard footer clicks (existing students) also fire it;
  filter on `page_path` when building audiences/conversions.
- **These events are not Google Ads conversions by themselves.** The tag
  records them in GA4, and Ads receives the signal, but to *optimise bidding*
  on them either import the GA4 key events into Google Ads, or create Ads
  conversion actions and fire them with their `AW-16998011333/<label>` send_to
  (labels come from the Ads UI — none are configured in code yet).

### How to test

1. Open the site with **Tag Assistant** (tagassistant.google.com → "Add domain")
   — it should list a Google tag for `G-TX8M33DNRH` and `AW-16998011333`.
2. DevTools → Network, filter `collect`. Click a WhatsApp link: you should see
   `google-analytics.com/g/collect?…tid=G-TX8M33DNRH…en=academy_whatsapp_click`
   plus Ads hits (`googleads.g.doubleclick.net/pagead/viewthroughconversion/16998011333`,
   `google.com/ccm/collect?tid=AW-16998011333`).
3. Or in the console: `dataLayer.filter(e => e[0] === 'event')` lists every
   gtag event sent this page-view.
4. GA4 → Admin → DebugView (use Tag Assistant's debug connection) shows the
   events live; they appear in Reports → Events within ~24 h.
5. `/qualify`: complete the wizard (with and without `?plan=elite`) — expect, just before the WhatsApp
   page opens, `academy_apply_submit` (`form=qualify`, `programa=elite`) and a request to
   `googleadservices.com/pagead/conversion/16998011333/?label=s44pCMiZnLodEMWjpKk_`.
   `/aplicar`: submit the form — same requests on `/aplicar/gracias`; reload that page: nothing is repeated.
   Enter with `?gclid=TEST123&utm_source=google` and check the form's hidden `attr_*` fields. `/apply`: finish a signup with a valid invite code —
   expect `academy_apply_submit` with `form=apply` on the next page.

## Lead conversion (`lib/analytics/conversion.ts`)

One function, `reportLeadSubmission`, is called by every successful *lead* path:
`/qualify` (before navigating to WhatsApp) and `/aplicar/gracias`. In order it sends:

1. **Enhanced conversions** — `gtag('set', 'user_data', { email, phone_number })` (email lower-cased,
   phone in E.164; the Google tag hashes them in the browser).
2. `academy_apply_submit` (`form: 'qualify' | 'aplicar'`, `programa`, `transaction_id`).
3. **Google Ads conversion** — `gtag('event', 'conversion', { send_to: 'AW-16998011333/s44pCMiZnLodEMWjpKk_', value: 1.0, currency: 'AUD', transaction_id })`.
4. **Meta Pixel `Lead`** with `eventID` = the same `transaction_id` (so a future Conversions API
   event can be de-duplicated).

**Exactly once per application:** `transaction_id` is the CRM lead id (stable, Google de-duplicates on
it too) and a `sessionStorage` flag (`xba_conv_done:<id>`) blocks repeats. On `/aplicar/gracias` the
payload is handed over through `sessionStorage` (`xba_pending_conversion`) and **consumed on first
read**, so reloading or opening the thank-you page directly reports nothing. Honeypot hits carry no
`leadId`, so bots never convert. If gtag.js is blocked the visitor still moves on.

## Attribution: gclid / UTM → CRM (`lib/analytics/attribution.ts`)

- `AttributionCapture` (root layout) writes the first-party cookie `xba_attr` (90 days) on every page load
  with `gclid, gbraid, wbraid, fbclid, utm_source, utm_medium, utm_campaign, utm_term, utm_content`
  plus `landing_page` and the external `referrer`.
- A later visit **without** parameters never erases them; a later visit **with** parameters replaces them.
- Only known keys are ever stored; values are trimmed, stripped of control chars and capped at 150 chars.
- `AttributionFields` adds them as hidden inputs (`attr_gclid`, …) to the landing capture form,
  `/qualify` and `/aplicar`; the server actions read the fields (cookie as fallback) and store one
  `crm_lead_answers` row per key (`question_key = attr_<name>`, no schema change). They appear in
  `/dashboard/admin/leads` with readable labels.

## Meta Pixel standard events

| Event | When | Where |
|---|---|---|
| `Lead` | Successful application (same `eventID` as the conversion's `transaction_id`) | `reportLeadSubmission` |
| `ViewContent` (`content_name`: Barber Starter / Programa Profesional / Mentoría Elite 1 a 1 / Barber Business) | A program page loads | `components/analytics/ViewContentTracker.tsx` |
| `Contact` | Click on any `wa.me` or `tel:` link | `OutboundContactTracker` |

These are standard events (`fbq('track', …)`), separate from the legacy custom events sent by `track()`.

## Turning a provider off / changing an ID

1. To point a provider at a different container/pixel, set the matching
   `NEXT_PUBLIC_*` env var in Vercel (Production or Preview) — it overrides
   the hardcoded default without a code change.
2. To fully disable a provider without removing code, override its env var
   to an empty value, or edit the hardcoded default in
   `lib/analytics/config.ts` directly.
3. Redeploy for either change to take effect.

## Event taxonomy

Defined in `lib/analytics/events.ts`, fired via `lib/analytics/track.ts`.
Every event is pushed to `window.dataLayer` (for GTM/GA4) and to
`fbq('trackCustom', ...)` (for Meta Pixel) when those providers are enabled.

| Event | Fired when | Source | Maps to CRM funnel stage |
|---|---|---|---|
| `lead_capture_success` | Landing-page phone/email form succeeds | `components/landing/PhoneLeadCaptureForm.tsx` | Stage 1 → 2 |
| `whatsapp_click` | Any WhatsApp link is clicked (pricing section, dashboard footer) | `components/landing/PricingSection.tsx`, `components/dashboard/DashboardFooter.tsx` | Assist / mid-funnel intent signal |
| `instagram_click` | Any Instagram link is clicked | same as above | Assist / brand engagement |
| `pricing_plan_select` | A pricing-plan CTA is clicked (`params: { plan }`) | `components/landing/PricingSection.tsx` | Stage 2 → 3 (enters `/qualify`) |
| `apply_click` | The final-CTA "Aplicar a la Academia" button is clicked | `components/landing/FinalCtaSection.tsx` | Stage 3 → 4 (enters `/apply`) |
| `application_submit` | A new student successfully completes `/apply` (invite code redeemed, account created) | `app/apply/actions.ts` + `components/analytics/ApplicationSuccessTracker.tsx` (see note below) | Stage 4 complete — conversion |

### Why `application_submit` isn't a simple `useEffect` on form state

`applyAccess` (`app/apply/actions.ts`) calls Next's `redirect('/dashboard')`
on success. `redirect()` throws internally, so the action never actually
returns `{ success: true }` to the client — there's nothing for
`ApplyForm.tsx` to react to. Instead, the action sets a short-lived
(`maxAge: 60`) cookie, `xba_application_submitted`, immediately before the
redirect. `ApplicationSuccessTracker` (mounted in `app/dashboard/layout.tsx`)
reads that cookie once on mount, fires `application_submit`, and clears the
cookie — so it fires exactly once per signup, not on every dashboard visit.
This mirrors the existing `tracked_lead_phone` cookie-bridge pattern already
used by `PhoneLeadCaptureForm.tsx` for the same reason (Server Actions that
redirect or re-render can't hand state back to the client directly).

## Also fixed while wiring this

`FinalCtaSection.tsx`'s "APLICAR A LA ACADEMIA" button was a plain styled
`<div>` with no `href` or `onClick` — a dead, non-functional primary CTA on
the landing page. It's now wrapped in a `TrackedLink` pointing to `/apply`
(matching its copy/intent) as part of adding the `apply_click` event.

## Not yet done / explicitly out of scope for this pass

- No server-side conversions API (Meta CAPI) — client-side pixel only, for
  now.
- No UTM parameter capture/persistence — `crm_leads` has no confirmed UTM
  columns (see audit §3); adding that is a separate, larger change touching
  the DB schema and is out of scope here.
