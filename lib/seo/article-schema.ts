import { getOrganizationSchema } from './organization-schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

type ArticleSchemaInput = {
  slug: string
  title: string
  description: string
  publishedAt: string
  inLanguage: 'es' | 'en'
}

/**
 * schema.org BlogPosting JSON-LD for a single blog article.
 *
 * Same minimal-fields philosophy as course-schema.ts and
 * organization-schema.ts: no author bio, no fabricated engagement stats.
 * `datePublished` here is legitimate (unlike sitemap.ts's `lastModified`,
 * which is deliberately omitted) because it's a real, static date recorded
 * once when the article was actually published — not a `new Date()`
 * re-stamped on every build.
 */
export function getArticleSchema({ slug, title, description, publishedAt, inLanguage }: ArticleSchemaInput) {
  const organization = getOrganizationSchema()

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: publishedAt,
    inLanguage,
    url: `${siteUrl}/blog/${slug}`,
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
    publisher: {
      '@type': organization['@type'],
      name: organization.name,
      url: organization.url,
      logo: organization.logo,
    },
    author: {
      '@type': organization['@type'],
      name: organization.name,
    },
  } as const
}
