'use client'

import { useEffect } from 'react'
import { reportLeadSubmission, type LeadSubmission } from '@/lib/analytics/conversion'
import { PENDING_CONVERSION_KEY } from '@/lib/analytics/pending-conversion'

function consumePendingConversion(): LeadSubmission | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_CONVERSION_KEY)
    if (!raw) return null

    // Consume it immediately: a reload (or React strict-mode's double effect) finds nothing to report.
    window.sessionStorage.removeItem(PENDING_CONVERSION_KEY)

    const parsed = JSON.parse(raw) as Partial<LeadSubmission>
    if (typeof parsed.transactionId !== 'string' || parsed.transactionId.length === 0) return null

    return {
      transactionId: parsed.transactionId,
      form: 'aplicar',
      programa: typeof parsed.programa === 'string' ? parsed.programa : undefined,
      userData: parsed.userData,
    }
  } catch {
    return null
  }
}

/**
 * Reports the Google Ads conversion + GA4 event + Meta Lead for the
 * application that was JUST submitted. Visiting /aplicar/gracias directly, or
 * reloading it, reports nothing. Renders nothing.
 */
export default function ThankYouConversion() {
  useEffect(() => {
    const submission = consumePendingConversion()
    if (submission) void reportLeadSubmission(submission)
  }, [])

  return null
}
