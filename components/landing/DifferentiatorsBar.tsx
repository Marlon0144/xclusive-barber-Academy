import { getSiteCopy } from '@/lib/content/site'
import type { Language } from '@/lib/i18n/config'

/**
 * The five reasons to choose the Academy, shown near the top of every
 * marketing page (home, programs, pillar pages). Pure/presentational so it
 * works from server and client components alike.
 */
export default function DifferentiatorsBar({ language }: { language: Language }) {
  const { differentiators } = getSiteCopy(language)

  return (
    <section
      aria-label={differentiators.heading}
      className="w-full border-y border-[#d4af37]/20 bg-[#1c3123]/60"
    >
      <ul className="mx-auto grid max-w-6xl gap-x-6 gap-y-2 px-4 py-4 text-[12px] leading-snug text-[#d3cbba] sm:grid-cols-2 md:px-8 lg:grid-cols-5 lg:text-[13px]">
        {differentiators.items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4AF37]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
