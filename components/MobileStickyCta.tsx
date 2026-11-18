'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { getSiteCopy } from '@/lib/content/site'
import { whatsappLink } from '@/lib/data/contact'
import { isMarketingPath, localizedPath, normalizePathname } from '@/lib/i18n/routes'

// The form and its thank-you page already ARE the call to action.
const HIDDEN_ON = new Set(['/aplicar', '/aplicar/gracias', '/en/apply-now', '/en/apply-now/thank-you'])

/**
 * Fixed bottom bar on phones: "Apply now" + WhatsApp. Hidden from `lg` up,
 * and on pages where it would be redundant. The WhatsApp link is a plain
 * wa.me anchor, so OutboundContactTracker reports its clicks with no extra code.
 * A same-height spacer keeps the footer from being covered.
 */
export default function MobileStickyCta() {
  const pathname = usePathname()
  const { language } = useLanguage()

  if (!isMarketingPath(pathname) || HIDDEN_ON.has(normalizePathname(pathname ?? '/'))) return null

  const copy = getSiteCopy(language).stickyCta

  return (
    <>
      <div className="h-[76px] lg:hidden" aria-hidden />
      <div
        className="fixed inset-x-0 bottom-0 z-[80] flex items-center gap-3 border-t border-[#d4af37]/30 bg-[#161616]/95 px-4 py-3 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <Link
          href={localizedPath('/aplicar', language)}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-sm bg-gradient-to-r from-[#deba60] via-[#F2D794] to-[#deba60] px-4 font-sans text-[13px] font-black uppercase tracking-[0.08em] text-[#161616]"
        >
          {copy.apply}
        </Link>
        <a
          href={whatsappLink(copy.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.whatsapp}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#d4af37]/50 bg-[#1c3123]"
        >
          <Image src="/assets/landing/icon-whatsapp.png" alt="" width={24} height={24} aria-hidden="true" />
        </a>
      </div>
    </>
  )
}
