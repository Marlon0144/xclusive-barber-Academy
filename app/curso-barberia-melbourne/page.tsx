import type { Metadata } from 'next'
import ContentPage from '@/components/content/ContentPage'
import { pillarEs } from '@/lib/content/pillar'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const metadata: Metadata = buildPageMetadata(pillarEs.path)

export default function PillarPageEs() {
  return <ContentPage content={pillarEs} language="es" homePath="/" />
}
