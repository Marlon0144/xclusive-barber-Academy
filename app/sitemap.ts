import type { MetadataRoute } from 'next'
import { COURSE_SLUGS } from '@/lib/data/course-slugs'
import { BLOG_SLUGS } from '@/lib/data/blog-posts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

// Only genuinely indexable, public marketing URLs belong here.
// Auth utility pages (/login, /signup) and the mid-funnel /qualify wizard
// are intentionally excluded — they carry `noindex` metadata and add no
// unique search value. /dashboard/* is authenticated and blocked in
// robots.ts.
//
// `lastModified` is intentionally omitted: we have no per-page CMS/content
// timestamp to back it with, and stamping every entry with `new Date()`
// makes every route look freshly edited on every single build/deploy —
// a signal search engines can learn to distrust. Better to say nothing
// than to say something false. Add real per-route dates here once content
// changes are actually tracked (e.g. a `lastModified` field in the course
// data or a CMS).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/apply`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/courses`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...COURSE_SLUGS.map((slug) => ({
      url: `${siteUrl}/courses/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...BLOG_SLUGS.map((slug) => ({
      url: `${siteUrl}/blog/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
