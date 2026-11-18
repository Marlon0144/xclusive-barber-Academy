import type { Metadata } from 'next'
import Link from 'next/link'
import { getApplicationCopy } from '@/lib/content/application'
import { whatsappLink } from '@/lib/data/contact'
import { localizedPath } from '@/lib/i18n/routes'
import { getServerLanguage } from '@/lib/i18n/server'
import { buildPageMetadata } from '@/lib/seo/page-meta'
import ThankYouConversion from './ThankYouConversion'

// noindex (see lib/seo/page-meta.ts): reaching this page without applying is meaningless.
export const metadata: Metadata = buildPageMetadata('/aplicar/gracias')

export default async function ApplicationThankYouPage() {
  const language = await getServerLanguage()
  const copy = getApplicationCopy(language).thanks

  return (
    <div className="min-h-screen bg-[#161616] text-[#d3cbba]">
      <ThankYouConversion />

      <div className="mx-auto max-w-xl px-4 pb-16 pt-20 text-center md:pt-28">
        <h1 className="mb-4 font-sans text-3xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-4xl">
          {copy.heading}
        </h1>
        <p className="mb-3 font-sans text-lg font-semibold text-[#D4AF37]">{copy.text}</p>
        <p className="mb-8 font-sans text-base leading-relaxed text-[#c8c0ad]">{copy.nextStep}</p>

        <a
          href={whatsappLink(copy.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center justify-center rounded-sm bg-gradient-to-r from-[#deba60] via-[#F2D794] to-[#deba60] px-8 py-3 font-sans text-[13px] font-black uppercase tracking-[0.08em] text-[#161616] shadow-[0_8px_20px_rgba(212,175,55,0.2)]"
        >
          {copy.whatsappButton}
        </a>

        <ul className="mt-10 space-y-2 text-sm">
          <li>
            <Link href={localizedPath('/courses', language)} className="text-[#D4AF37] underline-offset-4 hover:underline">
              {copy.programsLink}
            </Link>
          </li>
          <li>
            <Link href={localizedPath('/', language)} className="text-[#9ea79f] underline-offset-4 hover:underline">
              {copy.homeLink}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
