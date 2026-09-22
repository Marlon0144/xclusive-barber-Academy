import type { MetadataRoute } from 'next'
import { COURSE_SLUGS } from '@/lib/data/course-slugs'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

// Only genuinely indexable, public marketing URLs belong here.
// Auth utility pages (/login, /signup) and the mid-funnel /qualify wizard
// are intentionally excluded — they carry `noindex` metadata and add no
// unique search value. /dashboard/* is authenticated and blocked in
// robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...COURSE_SLUGS.map((slug) => ({
      url: `${siteUrl}/courses/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
