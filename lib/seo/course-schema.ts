import { ACADEMY_ADDRESS, ACADEMY_VENUE_NAME } from '@/lib/data/contact'
import { getOrganizationSchema } from './organization-schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

type CourseSchemaInput = {
  /** Site-relative URL of the page in the visitor's language, e.g. "/en/courses/professional". */
  path: string
  name: string
  description: string
}

/**
 * schema.org Course JSON-LD for a single program detail page.
 *
 * Same philosophy as organization-schema.ts: only fields we can back with
 * verified content.
 * - `inLanguage` is both languages: the program is taught in Spanish and English.
 * - `hasCourseInstance` states what is true without inventing dates: it is an
 *   in-person (`onsite`) course held at the Coburg barbershop. No start/end
 *   date and no `offers` (prices are ranges like "$400 - $1,500", and Google
 *   expects a single price on an Offer).
 * - NEVER add `educationalCredentialAwarded` / `occupationalCredentialAwarded`:
 *   the Academy is private, non-accredited training.
 */
export function getCourseSchema({ path, name, description }: CourseSchemaInput) {
  const organization = getOrganizationSchema()

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: `${siteUrl}${path}`,
    inLanguage: ['es', 'en'],
    provider: {
      '@type': 'EducationalOrganization',
      name: organization.name,
      url: organization.url,
      sameAs: organization.sameAs,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: {
        '@type': 'Place',
        name: ACADEMY_VENUE_NAME,
        address: {
          '@type': 'PostalAddress',
          ...ACADEMY_ADDRESS,
        },
      },
    },
  } as const
}
