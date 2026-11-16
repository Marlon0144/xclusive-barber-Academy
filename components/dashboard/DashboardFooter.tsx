import { getServerDictionary } from '@/lib/i18n/server'
import { DashboardFooterView } from './DashboardFooterView'

interface DashboardFooterProps {
  /** Optional tagline. Defaults to the localized academic tagline. */
  tagline?: string
}

/**
 * Footer compartido del área de Dashboard — wrapper de servidor.
 *
 * Resuelve el diccionario en el servidor y delega el render a la vista
 * presentacional (`DashboardFooterView`). Los Client Components deben
 * usar `DashboardFooterClient` (misma API) para evitar importar
 * `next/headers` dentro de un árbol cliente.
 *
 * Figma fuente de verdad: node 136:377 (bottom section).
 */
export async function DashboardFooter({ tagline }: DashboardFooterProps) {
  // REQ-FUNC-001: tagline, aria-labels y mensaje de WhatsApp localizados.
  const dict = await getServerDictionary()
  const footerDict = dict.dashboard.footer

  return (
    <DashboardFooterView
      tagline={tagline ?? footerDict.defaultTagline}
      instagramAria={footerDict.instagramAria}
      whatsappAria={footerDict.whatsappAria}
      whatsappMessage={footerDict.whatsappMessage}
    />
  )
}
