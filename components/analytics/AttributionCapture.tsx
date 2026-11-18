'use client'

import { useEffect } from 'react'
import {
  externalReferrer,
  extractTrackingParams,
  mergeAttribution,
  readAttributionCookie,
  serializeAttribution,
  writeAttributionCookie,
} from '@/lib/analytics/attribution'

/**
 * Stores gclid / gbraid / wbraid / fbclid / utm_* (plus landing page and
 * external referrer) in the first-party `xba_attr` cookie for 90 days, on
 * every page load. Rules (lib/analytics/attribution.ts): a later visit with no
 * parameters never erases them; a later visit with parameters replaces them.
 * Renders nothing; mounted once in the root layout.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      const existing = readAttributionCookie()
      const merged = mergeAttribution(existing, {
        params: extractTrackingParams(window.location.search),
        landingPage: window.location.pathname,
        referrer: externalReferrer(document.referrer, window.location.hostname),
      })

      if (serializeAttribution(merged) !== serializeAttribution(existing)) {
        writeAttributionCookie(merged)
      }
    } catch {
      // Attribution is best-effort and must never break a page.
    }
  }, [])

  return null
}
