'use client'

import Link from 'next/link'
import type { AnchorHTMLAttributes, MouseEventHandler } from 'react'
import { track } from '@/lib/analytics/track'
import type { AnalyticsEventName, AnalyticsEventParams } from '@/lib/analytics/events'

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  event: AnalyticsEventName
  eventParams?: AnalyticsEventParams
  /** true = plain <a> (external targets like wa.me/instagram.com); false/omitted = next/link (internal routes) */
  external?: boolean
}

/**
 * Thin client-side wrapper so Server Components (PricingSection,
 * DashboardFooter, FinalCtaSection) can fire an analytics event on click
 * without themselves becoming client components. Renders the same markup
 * (<a> or next/link) the call sites already used — no visual/behavior change
 * beyond the added onClick.
 */
export function TrackedLink({
  href,
  event,
  eventParams,
  external,
  onClick,
  children,
  ...rest
}: TrackedLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    track(event, eventParams)
    onClick?.(e)
  }

  if (external) {
    return (
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
