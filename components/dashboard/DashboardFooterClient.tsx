'use client'

import { useLanguage } from '@/components/i18n/LanguageProvider'
import { DashboardFooterView } from './DashboardFooterView'

interface DashboardFooterClientProps {
  /** Optional tagline. Defaults to the localized academic tagline. */
  tagline?: string
}

/**
 * Footer del Dashboard para Client Components.
 *
 * Misma API que `DashboardFooter` (versión de servidor), pero resuelve
 * los textos desde `useLanguage()` para no importar `next/headers`
 * dentro de un árbol cliente.
 */
export function DashboardFooterClient({ tagline }: DashboardFooterClientProps) {
  const { dictionary } = useLanguage()
  const footerDict = dictionary.dashboard.footer

  return (
    <DashboardFooterView
      tagline={tagline ?? footerDict.defaultTagline}
      instagramAria={footerDict.instagramAria}
      whatsappAria={footerDict.whatsappAria}
      whatsappMessage={footerDict.whatsappMessage}
    />
  )
}
