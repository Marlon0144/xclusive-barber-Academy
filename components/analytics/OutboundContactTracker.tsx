'use client'

import { useEffect } from 'react'
import { classifyContactLink } from '@/lib/analytics/contact-links'
import { gtagEvent } from '@/lib/analytics/gtag'

/**
 * Reports `academy_whatsapp_click` (links to wa.me) and `academy_phone_click`
 * (tel: links) to the Google tag, wherever on the site they appear.
 *
 * One delegated listener on `document` instead of per-link handlers: it
 * covers every current link (pricing, dashboard footer, final CTA, header…)
 * and any added later with no call-site changes. The listener runs in the
 * capture phase so a component that calls stopPropagation() on its own
 * click handler can't hide the click from analytics.
 *
 * This is additive to the GTM-routed `whatsapp_click` fired by TrackedLink —
 * different event name, different pipeline (direct gtag), so nothing is
 * double-counted. `page_path` is included so dashboard clicks (existing
 * students asking for support) can be told apart from landing-page clicks
 * (prospects) when building audiences/conversions.
 *
 * Renders nothing; mount once in the root layout.
 */
export function OutboundContactTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const link = classifyContactLink(anchor.href)
      if (!link) return

      gtagEvent(link.kind === 'whatsapp' ? 'academy_whatsapp_click' : 'academy_phone_click', {
        link_url: link.url,
        page_path: window.location.pathname,
      })
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return null
}
