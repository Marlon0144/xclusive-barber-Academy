/**
 * Classifies an absolute link URL as an outbound *contact* touchpoint
 * (WhatsApp — wa.me or api.whatsapp.com — or phone) so a single global click listener can report it —
 * see components/analytics/OutboundContactTracker.tsx.
 *
 * Pure on purpose (no DOM, no window): that keeps the matching rules unit-
 * testable and means every present and future `<a href="https://wa.me/…">` /
 * `<a href="tel:…">` is covered without editing each call site.
 */

export type ContactLinkKind = 'whatsapp' | 'phone'

export type ContactLink = {
  kind: ContactLinkKind
  /**
   * URL that is safe to send to analytics. For WhatsApp this is origin + path
   * only — the `?text=` query holds a pre-filled message and has no
   * reporting value, so it is dropped.
   */
  url: string
}

export function classifyContactLink(href: string | null | undefined): ContactLink | null {
  if (!href) return null

  let parsed: URL
  try {
    parsed = new URL(href)
  } catch {
    return null
  }

  if (parsed.protocol === 'tel:') {
    return { kind: 'phone', url: `tel:${parsed.pathname}` }
  }

  // Exact hostname match: `wa.me.evil.example` or `notwa.me` must NOT count.
  // Both official WhatsApp link formats are recognised: wa.me/<number> and api.whatsapp.com/send?phone=<number>.
  if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
    if (parsed.hostname === 'wa.me') {
      return { kind: 'whatsapp', url: `https://wa.me${parsed.pathname}` }
    }
    if (parsed.hostname === 'api.whatsapp.com') {
      // The query holds the number and the pre-filled text; only the endpoint is worth reporting.
      return { kind: 'whatsapp', url: `https://api.whatsapp.com${parsed.pathname}` }
    }
  }

  return null
}
