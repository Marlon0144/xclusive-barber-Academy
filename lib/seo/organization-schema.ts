/**
 * Structured data (JSON-LD) for Xclusive Barber Academy.
 *
 * IMPORTANT: only verified facts belong here. Do not add aggregateRating,
 * review, founding dates, employee counts or opening hours unless they have
 * been explicitly confirmed by the business owner — an inaccurate rating is
 * worse than no structured data (it can trigger a manual action).
 *
 * Verified, owner-confirmed facts (see lib/data/contact.ts):
 * - Phone / WhatsApp: +61 413 891 977
 * - Address: 112 Bell St, Coburg VIC 3058, AU (confirmed 2026-11-18)
 * - Instagram: https://www.instagram.com/xclusiveacademy_au
 *
 * Facebook / Google Business Profile URLs are intentionally NOT in `sameAs`
 * yet: they weren't provided, and inventing a profile URL is worse than
 * omitting it. Add them here once confirmed.
 *
 * `LocalBusiness` is declared next to `EducationalOrganization` because the
 * Academy trains in person at a real, staffed premises.
 */

import { ACADEMY_ADDRESS, INSTAGRAM_URL, PHONE_E164 } from '@/lib/data/contact'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: 'Xclusive Barber Academy',
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    image: `${siteUrl}/og/xclusive-barber-academy.jpg`,
    description:
      'Professional, practical barber education delivered inside a real operating barbershop in Coburg, Melbourne. Taught in Spanish and English.',
    telephone: PHONE_E164,
    sameAs: [INSTAGRAM_URL],
    address: {
      '@type': 'PostalAddress',
      ...ACADEMY_ADDRESS,
    },
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
    },
  } as const
}

export type FaqItem = { question: string; answer: string }

/** schema.org FAQPage. Answers must match the visible FAQ text exactly. */
export function getFaqSchema(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } as const
}

export type BreadcrumbItem = { name: string; path: string }

/** schema.org BreadcrumbList. `path` is site-relative ("/courses"). */
export function getBreadcrumbSchema(items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path === '/' ? siteUrl : `${siteUrl}${item.path}`,
    })),
  } as const
}
