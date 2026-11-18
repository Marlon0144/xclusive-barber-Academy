import Image from 'next/image'
import Link from 'next/link'
import DifferentiatorsBar from '@/components/landing/DifferentiatorsBar'
import { JsonLd } from '@/components/seo/JsonLd'
import type { PageContent } from '@/lib/content/pillar'
import { getSiteCopy } from '@/lib/content/site'
import { whatsappLink } from '@/lib/data/contact'
import type { Language } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localizedPath } from '@/lib/i18n/routes'
import { OG_IMAGE_PATH } from '@/lib/seo/page-meta'
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/seo/organization-schema'

const buttonClass = [
  'inline-flex min-h-[48px] items-center justify-center rounded-sm px-8 py-3',
  'font-sans text-[13px] font-black uppercase tracking-[0.08em] text-[#161616]',
  'bg-gradient-to-r from-[#deba60] via-[#F2D794] to-[#deba60]',
  'shadow-[0_8px_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-0.5',
].join(' ')

const secondaryButtonClass =
  'inline-flex min-h-[48px] items-center justify-center rounded-sm border border-[#d4af37]/50 px-8 py-3 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-[#d3cbba] transition-colors hover:bg-[#d4af37]/10'

/**
 * Renders a long-form marketing page (pillar pages in ES/EN/PT, the Spanish
 * guide) from a PageContent object: H1, differentiators, hero photo, sections,
 * optional program comparison table, FAQ (visible text === FAQPage JSON-LD),
 * CTA and related links. Server component: everything is in the initial HTML.
 *
 * The apply button goes to the localized /aplicar form. `language` selects the
 * chrome copy (the Portuguese page uses Spanish chrome and overrides the
 * labels it needs through the content object).
 */
export default function ContentPage({
  content,
  language,
  homePath,
}: {
  content: PageContent
  language: Language
  /** Home URL for the first breadcrumb ("/" or "/en"). */
  homePath: string
}) {
  const site = getSiteCopy(language)
  const plans = getDictionary(language).landing.pricing.plans
  const applyHref = localizedPath('/aplicar', language)

  const breadcrumbs = getBreadcrumbSchema([
    { name: content.homeLabel ?? site.breadcrumbs.home, path: homePath },
    { name: content.breadcrumbName, path: content.path },
  ])

  return (
    <div className="min-h-screen bg-[#161616] text-[#d3cbba]">
      <JsonLd data={breadcrumbs} />
      {content.faq ? <JsonLd data={getFaqSchema(content.faq.items)} /> : null}

      <div className="mx-auto max-w-4xl px-4 pt-16 md:px-8 md:pt-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-[0.14em] text-[#9ea79f]">
          <Link href={homePath} className="transition-colors hover:text-[#D4AF37]">
            {content.homeLabel ?? site.breadcrumbs.home}
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span>{content.breadcrumbName}</span>
        </nav>

        <h1 className="mb-6 font-sans text-3xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-5xl">
          {content.h1}
        </h1>
        {content.lead.map((paragraph) => (
          <p key={paragraph} className="mb-4 font-sans text-base leading-relaxed text-[#c8c0ad] md:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      {content.hideDifferentiators ? null : (
        <div className="mt-8">
          <DifferentiatorsBar language={language} />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <Image
          src={OG_IMAGE_PATH}
          alt={content.imageAlt}
          width={1200}
          height={630}
          priority
          sizes="(min-width: 896px) 896px, 100vw"
          className="mb-12 h-auto w-full rounded-sm"
        />

        {content.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="mb-4 font-sans text-xl font-extrabold uppercase text-[#f0ece3] md:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mb-3 font-sans text-sm leading-relaxed text-[#c8c0ad] md:text-base">
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 font-sans text-sm text-[#dfd8c8] md:text-base">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4AF37]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {content.programsTable ? (
          <section className="mb-12">
            <h2 className="mb-3 font-sans text-xl font-extrabold uppercase text-[#f0ece3] md:text-2xl">
              {content.programsTable.heading}
            </h2>
            <p className="mb-5 font-sans text-sm text-[#9ea79f] md:text-base">{content.programsTable.intro}</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left font-sans text-sm">
                <thead>
                  <tr className="border-b border-[#d4af37]/30 text-[11px] uppercase tracking-[0.12em] text-[#9ea79f]">
                    {content.programsTable.columns.map((column) => (
                      <th key={column} scope="col" className="py-3 pr-4 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b border-[rgba(211,203,186,0.12)] align-top">
                      <th scope="row" className="py-4 pr-4 font-bold text-[#f0ece3]">
                        {plan.name}
                      </th>
                      <td className="py-4 pr-4 text-[#c8c0ad]">{plan.formatLabel}</td>
                      <td className="py-4 pr-4 text-[#D4AF37]">{plan.priceLabel}</td>
                      <td className="py-4">
                        <Link
                          href={localizedPath(`/courses/${plan.id}`, language)}
                          className="text-[#D4AF37] underline-offset-4 hover:underline"
                        >
                          {content.programsTable?.linkLabel}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {content.faq ? (
          <section className="mb-12">
            <h2 className="mb-5 font-sans text-xl font-extrabold uppercase text-[#f0ece3] md:text-2xl">
              {content.faq.heading}
            </h2>
            <div className="space-y-3">
              {content.faq.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-sm border border-[rgba(211,203,186,0.18)] bg-[#1d1d1d] px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-sans text-sm font-bold text-[#f0ece3] md:text-base">
                    {item.question}
                  </summary>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-[#c8c0ad] md:text-base">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-12 rounded-sm border border-[#d4af37]/30 bg-[#1c3123]/40 p-6 text-center md:p-10">
          <h2 className="mb-3 font-sans text-xl font-extrabold uppercase text-[#f0ece3] md:text-2xl">
            {content.cta.heading}
          </h2>
          <p className="mx-auto mb-6 max-w-xl font-sans text-sm text-[#c8c0ad] md:text-base">{content.cta.text}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={applyHref} className={buttonClass}>
              {content.cta.apply}
            </Link>
            <a
              href={whatsappLink(site.stickyCta.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryButtonClass}
            >
              {content.cta.whatsapp}
            </a>
          </div>
        </section>

        {content.related ? (
          <nav aria-label={content.related.heading}>
            <h2 className="mb-3 font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#9ea79f]">
              {content.related.heading}
            </h2>
            <ul className="space-y-2">
              {content.related.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm text-[#D4AF37] underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  )
}
