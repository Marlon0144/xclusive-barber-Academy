import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Authenticated area — no SEO value, keep crawlers out entirely.
      disallow: ['/dashboard/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
