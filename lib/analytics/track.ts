'use client'

/**
 * track() — single entry point for client-side analytics events.
 *
 * Safe by construction:
 *  - No-ops on the server (typeof window check).
 *  - No-ops per-provider if that provider's env var isn't set, so calling
 *    track() before any tracking ID exists is completely harmless.
 *  - Never throws — a missing dataLayer/fbq must never break a form submit
 *    or a navigation.
 *
 * GTM is expected to own GA4 forwarding (a GA4 config tag inside the GTM
 * container listening for these dataLayer pushes) — that's the standard
 * pattern and avoids loading two separate script tags. NEXT_PUBLIC_GA4_ID is
 * kept in config.ts for the (less common) case of wiring gtag.js directly.
 */

import { analyticsConfig } from './config'
import type { AnalyticsEventName, AnalyticsEventParams } from './events'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: (...args: unknown[]) => void
  }
}

export function track(event: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
  if (typeof window === 'undefined') return

  try {
    if (analyticsConfig.gtmId) {
      window.dataLayer = window.dataLayer ?? []
      window.dataLayer.push({ event, ...params })
    }

    if (analyticsConfig.metaPixelId && typeof window.fbq === 'function') {
      window.fbq('trackCustom', event, params)
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('[analytics]', event, params)
    }
  } catch {
    // Analytics must never break the user-facing flow.
  }
}
