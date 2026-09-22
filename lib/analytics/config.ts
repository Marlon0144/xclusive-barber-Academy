/**
 * Analytics configuration — env-var driven, feature-flagged.
 *
 * No tracking ID is hardcoded. Every provider is OFF by default and only
 * activates once the corresponding NEXT_PUBLIC_* env var is set (in Vercel
 * project settings or a local .env.local). This lets us ship the wiring now
 * and flip providers on later without another deploy of code — see
 * docs/ANALYTICS_TRACKING_PLAN.md for the rollout plan and what to paste in.
 *
 * All values are NEXT_PUBLIC_* because they're read client-side (the GTM/
 * Meta Pixel loader scripts and the track() helper run in the browser).
 * None of these are secrets — GTM/GA4/Pixel IDs are not sensitive.
 */

export const analyticsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
} as const

export const isGtmEnabled = analyticsConfig.gtmId.length > 0
export const isGa4Enabled = analyticsConfig.ga4Id.length > 0
export const isMetaPixelEnabled = analyticsConfig.metaPixelId.length > 0
export const isAnalyticsEnabled = isGtmEnabled || isGa4Enabled || isMetaPixelEnabled
