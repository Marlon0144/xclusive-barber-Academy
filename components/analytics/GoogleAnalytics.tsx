import Script from 'next/script'
import { analyticsConfig, isGa4Enabled } from '@/lib/analytics/config'

/**
 * GA4 (gtag.js) loader — direct integration, independent of GTM.
 * Renders nothing until NEXT_PUBLIC_GA4_ID is set — see
 * docs/ANALYTICS_TRACKING_PLAN.md.
 *
 * Note: GTM is ALSO loaded (see GoogleTagManager.tsx) and both write to the
 * same `window.dataLayer`, which is safe — gtag.js only ever appends to it.
 * The one thing to avoid: don't ALSO add a GA4 Configuration tag inside the
 * GTM container while this direct loader is active, or GA4 will receive two
 * PageView pings per page load.
 */
export function GoogleAnalyticsScript() {
  if (!isGa4Enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsConfig.ga4Id}');`}
      </Script>
    </>
  )
}
