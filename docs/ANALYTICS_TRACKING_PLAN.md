# Analytics Tracking Plan

Status: scaffolding shipped, providers OFF until real IDs are supplied.
See `docs/ACADEMY_TECHNICAL_AUDIT.md` §5 for the original gap this closes
("zero analytics infrastructure — no GTM, no GA4, no Meta Pixel, no `track()`
helper wired to the CRM funnel").

## How it works

Everything is env-var gated. With no env vars set, `npm run build` and the
live site behave exactly as before this change — no script tags are
injected, `track()` calls are no-ops (safe to leave in code permanently).

| Env var | Purpose | Where read |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID (`GTM-XXXXXXX`) | `lib/analytics/config.ts` → `components/analytics/GoogleTagManager.tsx` |
| `NEXT_PUBLIC_GA4_ID` | GA4 measurement ID, reserved for a direct gtag.js path if ever needed | `lib/analytics/config.ts` (not wired to a loader yet — GTM is expected to own GA4 via a container tag, which is the standard/recommended setup and avoids double-loading tracking scripts) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Instagram Pixel ID | `lib/analytics/config.ts` → `components/analytics/MetaPixel.tsx` |

None of these are secrets (tracking IDs are not sensitive — they're visible
in every page's HTML/network requests once live). Set them as plain env vars
in Vercel project settings (Production + Preview) or a local `.env.local`.

## Turning a provider on

1. Create the GTM container (or Meta Pixel) in the respective ads/tag
   manager UI — this is a business/marketing action, not a code change.
2. Set `NEXT_PUBLIC_GTM_ID` (and/or `NEXT_PUBLIC_META_PIXEL_ID`) in Vercel.
3. Redeploy. The loader components in `components/analytics/` render
   automatically once the ID is present — no other code change needed.
4. Inside GTM, add a GA4 Configuration tag that fires on all pages, plus GA4
   Event tags listening for the custom events below (they arrive on
   `window.dataLayer` already, via `track()`).

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

- No real GTM/GA4/Meta Pixel IDs have been supplied yet — providers stay
  dark until the business owner creates the accounts and the IDs are set in
  Vercel.
- No server-side conversions API (Meta CAPI) — client-side pixel only, for
  now.
- No UTM parameter capture/persistence — `crm_leads` has no confirmed UTM
  columns (see audit §3); adding that is a separate, larger change touching
  the DB schema and is out of scope here.
