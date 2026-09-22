/**
 * Structured data (JSON-LD) for Xclusive Barber Academy.
 *
 * IMPORTANT: only verified facts belong here. Do not add aggregateRating,
 * review, founding dates, employee counts, or a street address unless they
 * have been explicitly confirmed by the business owner. An inaccurate
 * street address or a fabricated rating is worse than no structured data
 * at all — it can trigger a manual action from Google and misleads users.
 *
 * Verified fields currently sourced from the live codebase:
 * - Phone: +61 413 891 977 (WhatsApp number used in PricingSection /
 *   DashboardFooter / qualify actions)
 * - Instagram: https://www.instagram.com/xclusiveacademy_au
 * - Locality: Coburg, VIC, Australia (business-provided context — no
 *   street address included; add one only once confirmed)
 *
 * The Academy is NOT its own Google Business Profile entity — it trains
 * out of the existing Xclusive Barber location. This schema represents
 * the Academy as an EducationalOrganization whose training takes place
 * at that location, without claiming to be a separate local business.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Xclusive Barber Academy',
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    description:
      'Professional, practical barber education delivered inside a real operating barbershop in Coburg, Melbourne.',
    telephone: '+61413891977',
    sameAs: ['https://www.instagram.com/xclusiveacademy_au'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Coburg',
      addressRegion: 'VIC',
      addressCountry: 'AU',
    },
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
    },
  } as const
}
