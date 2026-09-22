import Script from 'next/script'
import { analyticsConfig, isGtmEnabled } from '@/lib/analytics/config'

/**
 * GTM loader. Renders nothing until NEXT_PUBLIC_GTM_ID is set — see
 * docs/ANALYTICS_TRACKING_PLAN.md for setup steps.
 */
export function GoogleTagManagerScript() {
  if (!isGtmEnabled) return null

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsConfig.gtmId}');`}
    </Script>
  )
}

/** Required <noscript> fallback iframe — must be the first thing inside <body>. */
export function GoogleTagManagerNoScript() {
  if (!isGtmEnabled) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
