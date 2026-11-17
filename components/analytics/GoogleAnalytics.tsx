import Script from 'next/script'
import { analyticsConfig, isGa4Enabled, isGtagEnabled } from '@/lib/analytics/config'

/**
 * Google tag (gtag.js) loader — direct integration, independent of GTM.
 * Configures GA4 and the Google Ads tag through ONE gtag.js download.
 *
 * Why one loader: gtag.js is a single library that serves every Google tag.
 * The `id` in the script URL only bootstraps the download; each destination
 * (GA4 `G-…`, Google Ads `AW-…`) is then registered with its own
 * `gtag('config', id)` call. Loading the script twice (once per ID) would
 * duplicate network requests and can double-fire hits, so don't.
 *
 * Renders nothing when neither NEXT_PUBLIC_GA4_ID nor
 * NEXT_PUBLIC_GOOGLE_ADS_ID resolves to a value — see
 * docs/ANALYTICS_TRACKING_PLAN.md.
 *
 * Note: GTM is ALSO loaded (see GoogleTagManager.tsx) and both write to the
 * same `window.dataLayer`, which is safe — gtag.js only ever appends to it.
 * The one thing to avoid: don't ALSO add a GA4 Configuration tag (or a Google
 * Ads tag for AW-16998011333) inside the GTM container while this direct
 * loader is active, or each would receive two pings per page load.
 */
export function GoogleAnalyticsScript() {
  if (!isGtagEnabled) return null

  // GA4 stays the bootstrap ID when present (unchanged from before Ads was added).
  const bootstrapId = isGa4Enabled ? analyticsConfig.ga4Id : analyticsConfig.googleAdsId
  const destinationIds = [analyticsConfig.ga4Id, analyticsConfig.googleAdsId].filter(
    (id) => id.length > 0,
  )
  // JSON.stringify quotes/escapes each ID so a bad env override can't break out of the string.
  const configCalls = destinationIds.map((id) => `gtag('config', ${JSON.stringify(id)});`).join('\n')

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(bootstrapId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configCalls}`}
      </Script>
    </>
  )
}
