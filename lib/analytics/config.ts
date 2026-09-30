/**
 * Analytics configuration — real IDs hardcoded as defaults, env-var
 * overridable, feature-flagged.
 *
 * These are the business's live tracking IDs. They're hardcoded here (not
 * left to a Vercel env var) so analytics goes live the moment this code
 * ships, without depending on whoever has Vercel dashboard access to also
 * go set env vars by hand. A `NEXT_PUBLIC_*` env var, if ever set, still
 * takes priority — useful for pointing a preview/staging deploy at a
 * separate test container without touching this file.
 *
 * All values are NEXT_PUBLIC_* because they're read client-side (the GTM/
 * GA4/Meta Pixel loader scripts and the track() helper run in the browser).
 * None of these are secrets — GTM/GA4/Pixel IDs are not sensitive, they're
 * visible in every page's HTML/network requests once live.
 *
 * See docs/ANALYTICS_TRACKING_PLAN.md for the full rollout plan.
 */

export const analyticsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-TD78R9X9',
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? 'G-TX8M33DNRH',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '1169356005611386',
} as const

export const isGtmEnabled = analyticsConfig.gtmId.length > 0
export const isGa4Enabled = analyticsConfig.ga4Id.length > 0
export const isMetaPixelEnabled = analyticsConfig.metaPixelId.length > 0
export const isAnalyticsEnabled = isGtmEnabled || isGa4Enabled || isMetaPixelEnabled
