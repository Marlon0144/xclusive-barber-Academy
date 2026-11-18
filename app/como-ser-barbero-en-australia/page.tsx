import type { Metadata } from 'next'
import ContentPage from '@/components/content/ContentPage'
import { guideEs } from '@/lib/content/pillar'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const metadata: Metadata = buildPageMetadata(guideEs.path)

export default function BarberGuideEs() {
  return <ContentPage content={guideEs} language="es" homePath="/" />
}
