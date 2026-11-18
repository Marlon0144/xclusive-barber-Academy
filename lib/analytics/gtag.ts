/**
 * gtag() helpers — direct Google tag events (GA4 + Google Ads).
 *
 * Why this is separate from track() (lib/analytics/track.ts): track() only
 * pushes `{ event, ...params }` objects onto `window.dataLayer` for GTM, and
 * gtag.js ignores plain objects there (it only consumes `gtag(...)` calls).
 * Events that must reach the Google tag directly go through here. They use
 * their own `academy_*` names so they can't double-count the GTM-routed
 * events in lib/analytics/events.ts.
 *
 * Same safety contract as track(): no-op on the server, no-op if gtag.js
 * isn't present (ad blocker, still loading), and never throws.
 */

export type GtagEventName =
  | 'academy_apply_submit'
  | 'academy_whatsapp_click'
  | 'academy_phone_click'
  /** Google Ads conversion (needs `send_to: 'AW-…/<label>'` — see lib/analytics/conversion.ts). */
  | 'conversion'

export type GtagEventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** gtag() serialises params as-is; drop `undefined` so nothing is sent as the literal "undefined". */
function definedOnly(params: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined))
}

function send(name: GtagEventName, params: Record<string, unknown>): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false

  try {
    window.gtag('event', name, definedOnly(params))
    if (process.env.NODE_ENV === 'development') {
      console.debug('[gtag]', name, params)
    }
    return true
  } catch {
    // Analytics must never break the user-facing flow.
    return false
  }
}

/** Fire-and-forget gtag event. Returns whether it was handed to gtag. */
export function gtagEvent(name: GtagEventName, params: GtagEventParams = {}): boolean {
  return send(name, params)
}

/**
 * Sends an event and then runs `then` (typically a navigation that unloads
 * the page) — exactly once, as soon as gtag confirms dispatch, or after
 * `timeoutMs` if it never does (ad blocker, slow network), or immediately if
 * gtag isn't available. The user is therefore never stuck waiting on
 * analytics.
 */
export function gtagEventThen(
  name: GtagEventName,
  params: GtagEventParams,
  then: () => void,
  timeoutMs = 1000,
): void {
  let done = false

  const finish = () => {
    if (done) return
    done = true
    clearTimeout(timer)
    then()
  }

  // Declared after `finish` but only ever read inside it, i.e. after this line has run.
  const timer = setTimeout(finish, timeoutMs)

  // gtag may invoke event_callback once per destination (GA4 + Ads); `done` makes that harmless.
  const sent = send(name, { ...params, event_callback: finish, event_timeout: timeoutMs })
  if (!sent) finish()
}

/**
 * `gtag('set', key, value)` — used to hand enhanced-conversions user data to
 * the Google tag just before a conversion event. Returns whether gtag was present.
 */
export function gtagSet(key: string, value: Record<string, unknown>): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false

  try {
    window.gtag('set', key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Resolves true as soon as gtag.js is available, or false after `maxWaitMs`.
 * Needed for events fired on page load (e.g. the thank-you page): the Google
 * tag is loaded `afterInteractive`, so it may not exist yet when the page's
 * first effect runs. Resolves immediately when it's already there.
 */
export function waitForGtag(maxWaitMs = 8000, intervalMs = 100): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (typeof window.gtag === 'function') return Promise.resolve(true)

  return new Promise((resolve) => {
    const startedAt = Date.now()
    const timer = setInterval(() => {
      if (typeof window.gtag === 'function') {
        clearInterval(timer)
        resolve(true)
      } else if (Date.now() - startedAt >= maxWaitMs) {
        clearInterval(timer)
        resolve(false)
      }
    }, intervalMs)
  })
}
