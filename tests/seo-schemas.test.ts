import { describe, expect, it } from 'vitest'
import { faqEn, faqEs, faqPt } from '@/lib/content/faq'
import { getCourseSchema } from '@/lib/seo/course-schema'
import { getBreadcrumbSchema, getFaqSchema, getOrganizationSchema } from '@/lib/seo/organization-schema'

describe('organization schema', () => {
  const org = getOrganizationSchema()

  it('is an EducationalOrganization AND a LocalBusiness with the confirmed address and phone', () => {
    expect(org['@type']).toEqual(['EducationalOrganization', 'LocalBusiness'])
    expect(org.name).toBe('Xclusive Barber Academy')
    expect(org.telephone).toBe('+61413891977')
    expect(org.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: '112 Bell St',
      addressLocality: 'Coburg',
      addressRegion: 'VIC',
      postalCode: '3058',
      addressCountry: 'AU',
    })
  })

  it('lists Instagram in sameAs and invents no rating, review or hours', () => {
    expect(org.sameAs).toContain('https://www.instagram.com/xclusiveacademy_au')
    const keys = Object.keys(org)
    for (const forbidden of ['aggregateRating', 'review', 'openingHours', 'openingHoursSpecification', 'priceRange']) {
      expect(keys).not.toContain(forbidden)
    }
  })
})

describe('course schema', () => {
  const course = getCourseSchema({
    path: '/en/courses/professional',
    name: 'PROFESSIONAL XCLUSIVE PROGRAM',
    description: 'Complete training.',
  })

  it('is an onsite Course held at Coburg, taught in Spanish and English', () => {
    expect(course['@type']).toBe('Course')
    expect(course.url).toBe('https://xclusiveacademy.com.au/en/courses/professional')
    expect(course.inLanguage).toEqual(['es', 'en'])
    expect(course.provider.name).toBe('Xclusive Barber Academy')
    expect(course.hasCourseInstance['@type']).toBe('CourseInstance')
    expect(course.hasCourseInstance.courseMode).toBe('onsite')
    expect(course.hasCourseInstance.location.address.addressLocality).toBe('Coburg')
  })

  it('NEVER claims a credential (the course is private and not accredited)', () => {
    const json = JSON.stringify(course)
    expect(json).not.toMatch(/educationalCredentialAwarded|occupationalCredentialAwarded/)
    expect(json).not.toMatch(/accredit|acreditad/i)
  })

  it('does not invent prices or dates', () => {
    const json = JSON.stringify(course)
    expect(json).not.toMatch(/"offers"|startDate|endDate/)
  })
})

describe('FAQ schema', () => {
  it.each([
    ['es', faqEs],
    ['en', faqEn],
    ['pt', faqPt],
  ])('%s: one Question per visible FAQ item with the exact same answer text', (_language, items) => {
    const schema = getFaqSchema(items)

    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(items.length)
    schema.mainEntity.forEach((entry, index) => {
      expect(entry['@type']).toBe('Question')
      expect(entry.name).toBe(items[index].question)
      expect(entry.acceptedAnswer).toEqual({ '@type': 'Answer', text: items[index].answer })
    })
  })

  it('covers the questions the brief asked for (Spanish)', () => {
    const questions = faqEs.map((item) => item.question)
    for (const expected of [
      '¿El curso es acreditado?',
      '¿Necesito experiencia?',
      '¿Las clases son en español?',
      '¿Dónde son las clases?',
      '¿Cuántos alumnos hay por grupo?',
      '¿Practico con clientes reales?',
      '¿Qué herramientas necesito?',
      '¿Cómo aplico?',
    ]) {
      expect(questions).toContain(expected)
    }
  })
})

describe('breadcrumb schema', () => {
  it('numbers the items from 1 and builds absolute URLs', () => {
    const schema = getBreadcrumbSchema([
      { name: 'Inicio', path: '/' },
      { name: 'Cursos', path: '/courses' },
      { name: 'Starter', path: '/courses/starter' },
    ])

    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement.map((item) => item.position)).toEqual([1, 2, 3])
    expect(schema.itemListElement[0].item).toBe('https://xclusiveacademy.com.au')
    expect(schema.itemListElement[2].item).toBe('https://xclusiveacademy.com.au/courses/starter')
  })
})
