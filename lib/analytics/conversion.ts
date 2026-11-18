/**
 * Lead conversion: ONE function that every successful application path calls
 * (the /qualify wizard, the /aplicar form's thank-you page).
 *
 * It reports, in this order:
 *  1. Enhanced-conversions user data (`gtag('set', 'user_data', …)`),
 *  2. `academy_apply_submit` (GA4 event, de-duplicated by transaction_id),
 *  3. The Google Ads conversion `AW-16998011333/s44pCMiZnLodEMWjpKk_` (1.0 AUD),
 *  4. Meta Pixel `Lead` with `eventID` = the same transaction_id, so Meta can
 *     de-duplicate it against a future Conversions API event.
 *
 * Exactly once per application: the `transaction_id` is the CRM lead id (stable
 * across retries — Google also de-duplicates on it server-side) and a
 * sessionStorage flag stops a reload / re-render from reporting it again.
 *
 * Safety contract as the rest of lib/analytics: never throws, never blocks the
 * visitor (the optional `then` — usually a navigation — always runs).
 */

import { gtagEvent, gtagEventThen, gtagSet, waitForGtag } from './gtag'
import { fbqTrack } from './meta'
import { programContentName } from '@/lib/data/programs'
import { normalizeAuMobile } from '@/lib/validation/au-phone'

export const ADS_CONVERSION_SEND_TO = 'AW-16998011333/s44pCMiZnLodEMWjpKk_'
export const LEAD_CONVERSION_VALUE = 1.0
export const LEAD_CONVERSION_CURRENCY = 'AUD'

const REPORTED_KEY_PREFIX = 'xba_conv_done:'

export type LeadSubmission = {
  /** Unique id of this application — the CRM lead id. */
  transactionId: string
  /** Which form produced it. */
  form: 'qualify' | 'aplicar'
  /** Program of interest (starter | profesional | elite | business) when known. */
  programa?: string
  /** Contact data for enhanced conversions. Hashed by the Google tag before it leaves the browser. */
  userData?: { email?: string | null; phone?: string | null }
}

/** Lower-case + trim, as Google requires before hashing. */
export function normalizeEmailForAds(email: string | null | undefined): string | undefined {
  const value = email?.trim().toLowerCase()
  return value ? value : undefined
}

/**
 * E.164 ("+61412345678"). Australian numbers typed locally ("0412 345 678") are expanded to +61;
 * other international numbers keep their own country code. Anything else → undefined.
 */
export function normalizePhoneForAds(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined

  const australian = normalizeAuMobile(phone)
  if (australian) return australian

  const digits = phone.replace(/\D/g, '')
  return phone.trim().startsWith('+') && digits.length >= 8 && digits.length <= 15 ? `+${digits}` : undefined
}

function wasReported(transactionId: string): boolean {
  try {
    return window.sessionStorage.getItem(`${REPORTED_KEY_PREFIX}${transactionId}`) === '1'
  } catch {
    return false
  }
}

function markReported(transactionId: string): void {
  try {
    window.sessionStorage.setItem(`${REPORTED_KEY_PREFIX}${transactionId}`, '1')
  } catch {
    // sessionStorage unavailable (private mode): Google still de-duplicates on transaction_id.
  }
}

/**
 * Reports a successful application. `then` runs once everything has been
 * handed to the tags (or after the waits below), so a navigation can't cut the
 * conversion off. `waitMs` is how long to wait for gtag.js to appear before
 * giving up (long on a thank-you page that just loaded, short before a redirect).
 */
export async function reportLeadSubmission(
  submission: LeadSubmission,
  { then, waitMs = 8000 }: { then?: () => void; waitMs?: number } = {},
): Promise<void> {
  const { transactionId, form, programa, userData } = submission

  // Reload, back/forward or a second render: already counted.
  if (typeof window === 'undefined' || wasReported(transactionId)) {
    then?.()
    return
  }

  const ready = await waitForGtag(waitMs)
  if (!ready) {
    // Tag blocked or never loaded: the visitor must still move on.
    then?.()
    return
  }

  markReported(transactionId)

  // Meta first: it's synchronous and independent of the Google tag's callback.
  fbqTrack(
    'Lead',
    { content_name: programa ? (programContentName(programa) ?? undefined) : undefined, content_category: form },
    transactionId,
  )

  const email = normalizeEmailForAds(userData?.email)
  const phoneNumber = normalizePhoneForAds(userData?.phone)
  if (email || phoneNumber) {
    gtagSet('user_data', {
      ...(email ? { email } : {}),
      ...(phoneNumber ? { phone_number: phoneNumber } : {}),
    })
  }

  gtagEvent('academy_apply_submit', { form, programa, transaction_id: transactionId })

  gtagEventThen(
    'conversion',
    {
      send_to: ADS_CONVERSION_SEND_TO,
      value: LEAD_CONVERSION_VALUE,
      currency: LEAD_CONVERSION_CURRENCY,
      transaction_id: transactionId,
    },
    then ?? (() => {}),
  )
}
