# Analytics Tracking Plan

Status: **live** — GTM, GA4, and Meta Pixel are all wired with the
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
