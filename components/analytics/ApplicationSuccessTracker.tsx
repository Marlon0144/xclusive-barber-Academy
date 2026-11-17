'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics/track'
import { gtagEvent } from '@/lib/analytics/gtag'

const COOKIE_NAME = 'xba_application_submitted'

function readCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

/**
 * Fires `application_submit` (GTM/Meta, via track()) and `academy_apply_submit`
 * (Google tag, via gtag()) exactly once, right after a new student lands on
 * /dashboard following a successful /apply signup. The `programa` parameter
 * is omitted here on purpose: the plan is chosen earlier, on /qualify, and
 * isn't known to /apply.
 *
 * Why this exists: applyAccess() (app/apply/actions.ts) calls redirect()
 * on success, so the client never receives a `success: true` state to react
 * to — the server action's return value after redirect() is unreachable.
 * Instead, the action sets a short-lived cookie right before redirecting,
 * and this component (mounted in app/dashboard/layout.tsx) reads + clears it
 * on mount so the event fires once per signup, not on every dashboard visit.
 */
export function ApplicationSuccessTracker() {
  useEffect(() => {
    if (readCookie(COOKIE_NAME) !== '1') return
    clearCookie(COOKIE_NAME)
    track('application_submit')
    gtagEvent('academy_apply_submit', { form: 'apply' })
  }, [])

  return null
}
