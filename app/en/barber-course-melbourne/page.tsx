import type { Metadata } from 'next'
import ContentPage from '@/components/content/ContentPage'
import { pillarEn } from '@/lib/content/pillar'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const metadata: Metadata = buildPageMetadata(pillarEn.path)

export default function PillarPageEn() {
  return <ContentPage content={pillarEn} language="en" homePath="/en" />
}
