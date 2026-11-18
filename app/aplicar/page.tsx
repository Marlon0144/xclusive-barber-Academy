import type { Metadata } from 'next'
import Link from 'next/link'
import DifferentiatorsBar from '@/components/landing/DifferentiatorsBar'
import { getApplicationCopy } from '@/lib/content/application'
import { getServerLanguage } from '@/lib/i18n/server'
import { buildPageMetadata } from '@/lib/seo/page-meta'
import ApplicationForm from './ApplicationForm'

export const metadata: Metadata = buildPageMetadata('/aplicar')

/**
 * Short application form — the landing page for ads. (`/apply` is a different
 * thing: the invite-code registration for students who were already accepted.)
 */
export default async function ApplicationPage() {
  const language = await getServerLanguage()
  const copy = getApplicationCopy(language)

  return (
    <div className="min-h-screen bg-[#161616] text-[#d3cbba]">
      <div className="mx-auto max-w-xl px-4 pb-6 pt-16 md:pt-24">
        <h1 className="mb-3 font-sans text-3xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-4xl">
          {copy.page.heading}
        </h1>
        <p className="mb-8 font-sans text-base leading-relaxed text-[#c8c0ad]">{copy.page.intro}</p>
      </div>

      <DifferentiatorsBar language={language} />

      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-sm bg-[#1d1d1d] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] md:p-8">
          <ApplicationForm />
        </div>

        <p className="mt-8 text-center text-sm text-[#9ea79f]">
          {copy.page.haveCodePrompt}{' '}
          <Link href="/apply" className="text-[#D4AF37] underline-offset-4 hover:underline">
            {copy.page.haveCodeLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
