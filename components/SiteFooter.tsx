'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { getSiteCopy } from '@/lib/content/site'
import { ACADEMY_ADDRESS, INSTAGRAM_URL, PHONE_E164, whatsappLink } from '@/lib/data/contact'
import { isMarketingPath, localizedPath } from '@/lib/i18n/routes'

const linkClass = 'text-[#c8c0ad] underline-offset-4 transition-colors hover:text-[#D4AF37] hover:underline'

/**
 * Public site footer: links every program, the pillar/guide/Portuguese pages
 * (internal linking for SEO), the address and contact channels. Shown only on
 * public marketing pages — never on auth or dashboard routes.
 */
export default function SiteFooter() {
  const pathname = usePathname()
  const { language, dictionary } = useLanguage()

  if (!isMarketingPath(pathname)) return null

  const copy = getSiteCopy(language).footer
  const site = getSiteCopy(language)
  const plans = dictionary.landing.pricing.plans
  const pillarHref = language === 'en' ? '/en/barber-course-melbourne' : '/curso-barberia-melbourne'

  return (
    <footer className="border-t border-[#d4af37]/20 bg-[#101010] px-4 py-12 text-sm md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <nav aria-label={copy.programs}>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#9ea79f]">{copy.programs}</h2>
          <ul className="space-y-2">
            {plans.map((plan) => (
              <li key={plan.id}>
                <Link href={localizedPath(`/courses/${plan.id}`, language)} className={linkClass}>
                  {plan.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={copy.guides}>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#9ea79f]">{copy.guides}</h2>
          <ul className="space-y-2">
            <li>
              <Link href={pillarHref} className={linkClass}>
                {copy.pillarLabel}
              </Link>
            </li>
            <li>
              <Link href="/como-ser-barbero-en-australia" className={linkClass}>
                {copy.guideLabel}
              </Link>
            </li>
            <li>
              <Link href="/pt/curso-de-barbeiro-melbourne" className={linkClass} hrefLang="pt-AU">
                {copy.ptLabel}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#9ea79f]">{copy.contact}</h2>
          <address className="space-y-2 not-italic text-[#c8c0ad]">
            <p>
              <span className="text-[#9ea79f]">{copy.addressLabel}: </span>
              {ACADEMY_ADDRESS.streetAddress}, {ACADEMY_ADDRESS.addressLocality} {ACADEMY_ADDRESS.addressRegion}{' '}
              {ACADEMY_ADDRESS.postalCode}
            </p>
            <p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp {PHONE_E164}
              </a>
            </p>
            <p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Instagram @xclusiveacademy_au
              </a>
            </p>
            <p>
              <Link href={localizedPath('/aplicar', language)} className={linkClass}>
                {site.stickyCta.apply}
              </Link>
            </p>
            <p>
              <Link href="/apply" className={linkClass}>
                {copy.haveCode}
              </Link>
            </p>
          </address>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-[rgba(211,203,186,0.12)] pt-6 text-xs text-[#9ea79f]">
        © {new Date().getFullYear()} Xclusive Barber Academy · {copy.privateTraining}
      </p>
    </footer>
  )
}
