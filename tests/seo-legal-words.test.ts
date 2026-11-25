import { describe, expect, it } from 'vitest'
import { applicationCopy } from '@/lib/content/application'
import { ACCREDITATION_FAQ_QUESTIONS, faqEn, faqEs, faqPt } from '@/lib/content/faq'
import { guideEs, pillarEn, pillarEs, pillarPt, type PageContent } from '@/lib/content/pillar'
import { siteCopy } from '@/lib/content/site'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { APPLY_META, PAGE_META } from '@/lib/seo/page-meta'

/**
 * LEGAL RULE: the Academy is private, NON-accredited training. Copy must never claim
 * accreditation, an official/national qualification, visa help, guarantees or rankings.
 *
 * The honest FAQ answer to "Is the course accredited?" necessarily names Cert III / RTO to say
 * the course is NOT one — it is the single, explicitly allow-listed exception (one per language).
 */
const FORBIDDEN = [
  /acreditad/i,
  /accredit/i,
  /credenciad/i,
  /certificado oficial/i,
  /\bcertificates?\b/i, // English only — "Certificado de finalización de Xclusive Academy" (ES) stays allowed
  /official certificate/i,
  /nationally recogni[sz]ed/i,
  /reconocid[oa] (a nivel )?nacional/i,
  /cert(ificate)?\s*(iii|3)\b/i,
  /\bSHB\w*/i,
  /\bRTO\b/i,
  /\bvisas?\b/i,
  /\bvisado\b/i,
  /garantizad/i,
  /\bguarantee/i,
  /garantia/i,
  /#1\b/,
  /número 1/i,
  /\bel mejor\b/i,
  /\bla mejor\b/i,
  /\bthe best\b/i,
]

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => strings(item, out))
  return out
}

function violations(texts: string[]): string[] {
  return texts.flatMap((text) => FORBIDDEN.filter((pattern) => pattern.test(text)).map((pattern) => `${pattern} → "${text.slice(0, 80)}"`))
}

/** Page content without its FAQ (the FAQ is checked separately, with the allow-listed exception). */
function withoutFaq(content: PageContent) {
  const { faq: _faq, ...rest } = content
  void _faq
  return rest
}

describe('legal words — no accreditation / visa / guarantee / ranking claims', () => {
  it('page titles and descriptions', () => {
    expect(violations(strings(PAGE_META))).toEqual([])
    expect(violations(strings(APPLY_META))).toEqual([])
  })

  it('site chrome copy (footer, sticky CTA, differentiators)', () => {
    expect(violations(strings(siteCopy))).toEqual([])
  })

  it('application form and thank-you copy', () => {
    expect(violations(strings(applicationCopy))).toEqual([])
  })

  it('pillar pages and the guide (outside the FAQ)', () => {
    for (const content of [pillarEs, pillarEn, pillarPt, guideEs]) {
      expect(violations(strings(withoutFaq(content))), content.path).toEqual([])
    }
  })

  it('public dictionary sections in both languages (landing, header, courses)', () => {
    for (const language of ['es', 'en'] as const) {
      const dictionary = dictionaries[language]
      const publicCopy = [dictionary.landing, dictionary.header, dictionary.coursesPage, dictionary.courseDetailPage]
      expect(violations(strings(publicCopy)), language).toEqual([])
    }
  })

  it('FAQs: only the accreditation disclosure may use the restricted words', () => {
    for (const items of [faqEs, faqEn, faqPt]) {
      const offenders = items.filter((item) => violations([item.question, item.answer]).length > 0)
      expect(offenders.map((item) => item.question)).toSatisfy((questions: string[]) =>
        questions.every((question) => (ACCREDITATION_FAQ_QUESTIONS as readonly string[]).includes(question)),
      )
      expect(items[0].question).toSatisfy((question: string) => (ACCREDITATION_FAQ_QUESTIONS as readonly string[]).includes(question))
    }
  })

  it('the accreditation FAQ says plainly that the course is NOT a national qualification', () => {
    expect(faqEs[0].answer).toMatch(/No es una cualificación nacional/)
    expect(faqEn[0].answer).toMatch(/not a national qualification/i)
    expect(faqPt[0].answer).toMatch(/Não é uma qualificação nacional/)
  })

  it('the detector itself works (guards against a silently broken pattern list)', () => {
    expect(violations(['Curso acreditado en Melbourne'])).toHaveLength(1)
    expect(violations(['Fully accredited course'])).toHaveLength(1)
    expect(violations(['Ayuda con tu visa'])).toHaveLength(1)
    expect(violations(['Resultados garantizados'])).toHaveLength(1)
    expect(violations(['La mejor academia'])).toHaveLength(1)
    expect(violations(['Revisa las opciones'])).toEqual([]) // "Revisa" must not match \bvisa
    expect(violations(['Certificado de finalización de Xclusive Academy'])).toEqual([])
    expect(violations(['Private certificate'])).toHaveLength(1)
    expect(violations(['Get your certificate'])).toHaveLength(1)
  })
})
