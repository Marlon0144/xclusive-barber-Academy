/**
 * Lead attribution: remember WHICH campaign / keyword / referrer brought a visitor, so the lead
 * saved in the CRM can be traced back to it.
 *
 * Captured on every page load into a first-party cookie (`xba_attr`, 90 days) and read back by
 * the lead forms (hidden fields) and by the server actions (as a fallback).
 *
 * Pure and dependency-free (runs in the browser AND in server actions) — all the rules live here
 * so they can be unit-tested:
 *  - only known keys are ever stored (no arbitrary query params),
 *  - every value is trimmed, stripped of control characters and length-capped (cookie + DB safety;
 *    values coming back from forms/cookies are untrusted input),
 *  - a later visit WITHOUT tracking parameters never erases what was captured earlier,
 *  - a later visit WITH tracking parameters replaces them (the newest paid click wins).
 */

export const ATTRIBUTION_COOKIE = 'xba_attr'
export const ATTRIBUTION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90

/** Parameters that identify a campaign / click. */
export const TRACKING_PARAM_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

/** Context of the visit that carried the parameters. */
export const CONTEXT_KEYS = ['landing_page', 'referrer'] as const

export const ATTRIBUTION_KEYS = [...TRACKING_PARAM_KEYS, ...CONTEXT_KEYS] as const

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number]
export type Attribution = Partial<Record<AttributionKey, string>>

const MAX_VALUE_LENGTH = 150

/** Trim, drop control characters, cap the length; undefined when nothing is left. */
export function sanitizeValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, MAX_VALUE_LENGTH)
  return cleaned.length > 0 ? cleaned : undefined
}

/** Keeps only the known keys of an unknown object, sanitised. */
export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== 'object') return {}

  const source = input as Record<string, unknown>
  const result: Attribution = {}
  for (const key of ATTRIBUTION_KEYS) {
    const value = sanitizeValue(source[key])
    if (value) result[key] = value
  }
  return result
}

/** Pulls the tracking parameters out of a query string. */
export function extractTrackingParams(search: string | URLSearchParams): Attribution {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search
  const result: Attribution = {}
  for (const key of TRACKING_PARAM_KEYS) {
    const value = sanitizeValue(params.get(key))
    if (value) result[key] = value
  }
  return result
}

export function hasTrackingParams(attribution: Attribution | null | undefined): boolean {
  return Boolean(attribution) && TRACKING_PARAM_KEYS.some((key) => Boolean(attribution?.[key]))
}

type Visit = {
  /** Tracking parameters present on this visit's URL (may be empty). */
  params: Attribution
  /** Path of the page the visitor landed on (no query string). */
  landingPage: string
  /** External referrer of this visit, already reduced to origin + path (undefined for direct/internal). */
  referrer?: string
}

/**
 * Decides what the cookie should contain after a page view.
 *  - Nothing stored yet → store this visit (even an organic one: landing page + referrer are useful).
 *  - This visit has tracking params → they replace the stored ones (latest campaign click wins).
 *  - Otherwise → keep what we had.
 */
export function mergeAttribution(existing: Attribution | null, visit: Visit): Attribution {
  const current = sanitizeAttribution(existing)
  const incoming = sanitizeAttribution(visit.params)

  const visitContext: Attribution = {}
  const landing = sanitizeValue(visit.landingPage)
  const referrer = sanitizeValue(visit.referrer)
  if (landing) visitContext.landing_page = landing
  if (referrer) visitContext.referrer = referrer

  if (hasTrackingParams(incoming)) {
    return { ...incoming, ...visitContext }
  }

  if (Object.keys(current).length === 0) {
    return visitContext
  }

  return current
}

export function serializeAttribution(attribution: Attribution): string {
  return JSON.stringify(sanitizeAttribution(attribution))
}

/** Parses the cookie value (raw or URL-encoded JSON). Never throws; garbage → {}. */
export function parseAttribution(raw: string | null | undefined): Attribution {
  if (!raw) return {}

  const candidates = [raw]
  try {
    candidates.push(decodeURIComponent(raw))
  } catch {
    // not URL-encoded — the raw candidate is enough
  }

  for (const candidate of candidates) {
    try {
      return sanitizeAttribution(JSON.parse(candidate))
    } catch {
      // try the next candidate
    }
  }
  return {}
}

/** External referrer reduced to origin + path (no query string / hash), or undefined for direct/internal visits. */
export function externalReferrer(referrer: string, currentHostname: string): string | undefined {
  if (!referrer) return undefined
  try {
    const url = new URL(referrer)
    if (url.hostname === currentHostname) return undefined
    return `${url.origin}${url.pathname}`
  } catch {
    return undefined
  }
}

// ── Browser-only helpers (no-ops on the server) ──────────────────────────────

/** Fired on `window` whenever the attribution cookie is (re)written, so UI that mirrors it can re-render. */
export const ATTRIBUTION_CHANGE_EVENT = 'xba:attribution'

/** Raw (still URL-encoded) cookie value, or '' — a primitive, so it's a stable useSyncExternalStore snapshot. */
export function readAttributionCookieRaw(): string {
  if (typeof document === 'undefined') return ''

  const entry = document.cookie.split('; ').find((row) => row.startsWith(`${ATTRIBUTION_COOKIE}=`))
  return entry ? entry.slice(ATTRIBUTION_COOKIE.length + 1) : ''
}

export function readAttributionCookie(): Attribution {
  return parseAttribution(readAttributionCookieRaw())
}

export function writeAttributionCookie(attribution: Attribution): void {
  if (typeof document === 'undefined') return

  const secure = window.location.protocol === 'https:' ? '; secure' : ''
  document.cookie =
    `${ATTRIBUTION_COOKIE}=${encodeURIComponent(serializeAttribution(attribution))}` +
    `; path=/; max-age=${ATTRIBUTION_MAX_AGE_SECONDS}; samesite=lax${secure}`

  window.dispatchEvent(new Event(ATTRIBUTION_CHANGE_EVENT))
}
