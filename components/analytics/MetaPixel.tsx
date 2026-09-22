import Script from 'next/script'
import { analyticsConfig, isMetaPixelEnabled } from '@/lib/analytics/config'

/**
 * Meta (Facebook/Instagram) Pixel loader. Renders nothing until
 * NEXT_PUBLIC_META_PIXEL_ID is set — see docs/ANALYTICS_TRACKING_PLAN.md.
 * Relevant here because the Academy's primary organic channel is Instagram.
 */
export function MetaPixelScript() {
  if (!isMetaPixelEnabled) return null

  return (
    <Script id="meta-pixel-init" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${analyticsConfig.metaPixelId}');
fbq('track', 'PageView');`}
    </Script>
  )
}

export function MetaPixelNoScript() {
  if (!isMetaPixelEnabled) return null

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height={1}
        width={1}
        alt=""
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${analyticsConfig.metaPixelId}&ev=PageView&noscript=1`}
      />
    </noscript>
  )
}
