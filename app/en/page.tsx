import type { Metadata } from 'next'
import Home from '../page'
import { buildPageMetadata } from '@/lib/seo/page-meta'

// English home: the same page component — the language comes from the /en URL (see lib/i18n/server.ts).
export const metadata: Metadata = buildPageMetadata('/en')

export default Home
