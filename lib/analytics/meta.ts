/**
 * Meta Pixel standard events (Lead, ViewContent, Contact).
 *
 * Separate from track() on purpose: track() sends CUSTOM events
 * (`fbq('trackCustom', …)`) for the legacy taxonomy; Meta Ads optimises on
 * STANDARD events, which use `fbq('track', …)`.
 *
 * Same safety contract as the rest of lib/analytics: no-op on the server,
 * no-op if the pixel is absent (ad blocker), never throws.
 */

export type MetaEventParams = Record<string, string | number | boolean | string[] | undefined>

function definedOnly(params: MetaEventParams): Record<string, unknown> {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined))
}

/**
 * Sends a standard event. `eventId` is Meta's `eventID`: pass the same value
 * the server will send through the Conversions API later so Meta can
 * de-duplicate browser + server events.
 */
export function fbqTrack(event: string, params: MetaEventParams = {}, eventId?: string): boolean {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false

  try {
    if (eventId) {
      window.fbq('track', event, definedOnly(params), { eventID: eventId })
    } else {
      window.fbq('track', event, definedOnly(params))
    }
    return true
  } catch {
    return false
  }
}

/**
 * Like fbqTrack, but for events fired at page load: the pixel snippet loads
 * after hydration (`strategy="afterInteractive"`), so on a direct visit
 * `window.fbq` may not exist yet. Retries every `intervalMs` for up to
 * `maxWaitMs`, then gives up silently. Returns a cancel function for effect cleanup.
 */
export function fbqTrackWhenReady(
  event: string,
  params: MetaEventParams = {},
  eventId?: string,
  { intervalMs = 250, maxWaitMs = 8000 }: { intervalMs?: number; maxWaitMs?: number } = {},
): () => void {
  if (fbqTrack(event, params, eventId)) return () => {}

  const startedAt = Date.now()
  const timer = setInterval(() => {
    if (fbqTrack(event, params, eventId) || Date.now() - startedAt >= maxWaitMs) {
      clearInterval(timer)
    }
  }, intervalMs)

  return () => clearInterval(timer)
}
