import type { Metadata } from 'next'
import ApplicationPage from '../../aplicar/page'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const metadata: Metadata = buildPageMetadata('/en/apply-now')

export default ApplicationPage
