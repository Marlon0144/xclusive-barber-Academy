'use client'

import { useMemo, useSyncExternalStore } from 'react'
import {
  ATTRIBUTION_CHANGE_EVENT,
  ATTRIBUTION_KEYS,
  parseAttribution,
  readAttributionCookieRaw,
} from '@/lib/analytics/attribution'

function subscribe(onChange: () => void) {
  window.addEventListener(ATTRIBUTION_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(ATTRIBUTION_CHANGE_EVENT, onChange)
}

/**
 * Hidden inputs (`attr_gclid`, `attr_utm_source`, `attr_landing_page`, …) that
 * carry the visitor's stored attribution along with a lead form. Drop it
 * inside any lead <form>; the server action reads them (and falls back to the
 * cookie itself if they're missing — see lib/leads/attribution.ts).
 *
 * The cookie is an external store: useSyncExternalStore renders nothing on the
 * server/first hydration pass (so no mismatch) and re-renders when
 * AttributionCapture writes the cookie, e.g. on the first visit via an ad click.
 */
export function AttributionFields() {
  const raw = useSyncExternalStore(subscribe, readAttributionCookieRaw, () => '')
  const attribution = useMemo(() => parseAttribution(raw), [raw])

  return (
    <>
      {ATTRIBUTION_KEYS.map((key) => {
        const value = attribution[key]
        return value ? <input key={key} type="hidden" name={`attr_${key}`} value={value} readOnly /> : null
      })}
    </>
  )
}
