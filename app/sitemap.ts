import type { MetadataRoute } from 'next'
import { allIndexablePaths, alternatesFor } from '@/lib/i18n/routes'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xclusiveacademy.com.au'

// Only genuinely indexable, public marketing URLs belong here — in BOTH languages (es-AU / en-AU),
// plus the Portuguese page and the Spanish guide. Every entry carries its hreflang alternates
// (self-referencing and reciprocal, as Google requires). Source of truth: lib/i18n/routes.ts.
//
// Intentionally excluded: auth utility pages (/login, /signup), the mid-funnel /qualify wizard and the
// thank-you pages (all carry `noindex`), and /dashboard/* (authenticated, blocked in robots.ts).
// `/apply` is the invite-code registration page and stays listed as before.
//
// `lastModified` is intentionally omitted: we have no per-page CMS/content timestamp to back it
// with, and stamping every entry with `new Date()` makes every route look freshly edited on every
// deploy — a signal search engines can learn to distrust.
const toUrl = (path: string) => (path === '/' ? siteUrl : `${siteUrl}${path}`)

function priorityFor(path: string): number {
  if (path === '/' || path === '/en') return 1
  if (path.includes('/courses') && path.split('/').length <= 3) return 0.9
  return 0.8
}

export default function sitemap(): MetadataRoute.Sitemap {
  const marketing = allIndexablePaths().map((path) => {
    const { languages } = alternatesFor(path)
    return {
      url: toUrl(path),
      changeFrequency: path === '/' || path === '/en' ? ('weekly' as const) : ('monthly' as const),
      priority: priorityFor(path),
      alternates: {
        languages: Object.fromEntries(Object.entries(languages).map(([hreflang, p]) => [hreflang, toUrl(p)])),
      },
    }
  })

  return [
    ...marketing,
    { url: `${siteUrl}/apply`, changeFrequency: 'monthly' as const, priority: 0.5 },
  ]
}
