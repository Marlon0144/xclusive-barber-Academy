import type { Metadata } from 'next'
import ContentPage from '@/components/content/ContentPage'
import { pillarPt } from '@/lib/content/pillar'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const metadata: Metadata = buildPageMetadata(pillarPt.path)

// Short Portuguese page for Brazilian students. Chrome (header/footer) stays Spanish by design —
// there is no Portuguese dictionary — so the page body carries its own Portuguese copy and states
// plainly that classes are taught in Spanish and English.
export default function PillarPagePt() {
  return <ContentPage content={pillarPt} language="es" homePath="/" />
}
