import { getOrganizationSchema } from './organization-schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

type CourseSchemaInput = {
  slug: string
  name: string
  description: string
  inLanguage: 'es' | 'en'
}

/**
 * schema.org Course JSON-LD for a single program detail page.
 *
 * Deliberately minimal, same philosophy as organization-schema.ts: only
 * fields we can back with real, verified content. No `offers` (prices in
 * lib/i18n/dictionaries.ts are ranges like "$400 - $1,500" or "$3,500
 * (early) / $4,000", not single confirmed values — Google expects a single
 * price on an Offer, so a range would be either wrong or misleading) and no
 * `hasCourseInstance` (no confirmed start/end dates or enrollment schedule).
 * Add those once pricing is finalized to a single number and cohort dates
 * are confirmed by the business owner.
 */
export function getCourseSchema({ slug, name, description, inLanguage }: CourseSchemaInput) {
  const organization = getOrganizationSchema()

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: `${siteUrl}/courses/${slug}`,
    inLanguage,
    provider: {
      '@type': organization['@type'],
      name: organization.name,
      url: organization.url,
      sameAs: organization.sameAs,
    },
  } as const
}
