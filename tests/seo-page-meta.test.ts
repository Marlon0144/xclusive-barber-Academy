import { describe, expect, it } from 'vitest'
import { APPLY_META, PAGE_META, buildApplyMetadata, buildPageMetadata, OG_IMAGE_PATH } from '@/lib/seo/page-meta'

describe('PAGE_META limits', () => {
  it.each(Object.entries(PAGE_META))('%s — title ≤ 60 and description ≤ 155 chars', (_path, meta) => {
    expect(meta.title.length).toBeLessThanOrEqual(60)
    expect(meta.title.length).toBeGreaterThan(10)
    expect(meta.description.length).toBeLessThanOrEqual(155)
    expect(meta.description.length).toBeGreaterThan(40)
  })

  it('titles are unique (no two pages compete with the same title)', () => {
    const titles = Object.values(PAGE_META).map((meta) => meta.title)
    expect(new Set(titles).size).toBe(titles.length)
  })
})

describe('/apply metadata (invite-code registration, language by preference)', () => {
  it.each(Object.entries(APPLY_META))('%s — within title/description limits', (_language, meta) => {
    expect(meta.title.length).toBeLessThanOrEqual(60)
    expect(meta.description.length).toBeLessThanOrEqual(155)
  })

  it('serves Spanish by default and English on request, with a self canonical', () => {
    const es = buildApplyMetadata('es')
    const en = buildApplyMetadata('en')

    expect(es.title).toEqual({ absolute: APPLY_META.es.title })
    expect(en.title).toEqual({ absolute: APPLY_META.en.title })
    expect(es.title).not.toEqual(en.title)
    expect(es.alternates?.canonical).toBe('/apply')
    expect((es.openGraph as { locale: string }).locale).toBe('es_AU')
    expect((en.openGraph as { locale: string }).locale).toBe('en_AU')
  })
})

describe('buildPageMetadata', () => {
  it('uses the exact titles requested for the key pages', () => {
    expect(PAGE_META['/'].title).toBe('Academia de Barbería en Melbourne · Xclusive Academy')
    expect(PAGE_META['/courses/starter'].title).toBe('Curso de Barbería para Principiantes Melbourne')
    expect(PAGE_META['/courses/profesional'].title).toBe('Curso de Barbero Profesional 12 Semanas · Melbourne')
    expect(PAGE_META['/courses/elite'].title).toBe('Mentoría de Barbería 1 a 1 · Fades y Técnica')
    expect(PAGE_META['/courses/business'].title).toBe('Cómo Abrir y Llenar tu Barbería · Barber Business')
    expect(PAGE_META['/en'].title).toBe('Barber Academy Melbourne · Xclusive Academy')
    expect(PAGE_META['/en/courses/professional'].title).toBe('12-Week Barber Course Melbourne · Xclusive Academy')
  })

  it('emits an absolute title, a self canonical and hreflang with x-default', () => {
    const meta = buildPageMetadata('/en/courses/professional')

    expect(meta.title).toEqual({ absolute: PAGE_META['/en/courses/professional'].title })
    expect(meta.alternates?.canonical).toBe('/en/courses/professional')
    expect(meta.alternates?.languages).toMatchObject({
      'es-AU': '/courses/profesional',
      'en-AU': '/en/courses/professional',
      'x-default': '/courses/profesional',
    })
  })

  it('adds Open Graph and Twitter cards with the 1200x630 photo', () => {
    const meta = buildPageMetadata('/')
    const og = meta.openGraph as { images: { url: string; width: number; height: number; alt: string }[]; locale: string }

    expect(og.locale).toBe('es_AU')
    expect(og.images[0]).toMatchObject({ url: OG_IMAGE_PATH, width: 1200, height: 630 })
    expect(og.images[0].alt.length).toBeGreaterThan(20)
    expect((meta.twitter as { card: string }).card).toBe('summary_large_image')
    expect((buildPageMetadata('/en').openGraph as { locale: string }).locale).toBe('en_AU')
    expect((buildPageMetadata('/pt/curso-de-barbeiro-melbourne').openGraph as { locale: string }).locale).toBe('pt_AU')
  })

  it('marks only the thank-you pages noindex', () => {
    expect(buildPageMetadata('/aplicar/gracias').robots).toEqual({ index: false, follow: true })
    expect(buildPageMetadata('/en/apply-now/thank-you').robots).toEqual({ index: false, follow: true })
    expect(buildPageMetadata('/').robots).toBeUndefined()
    expect(buildPageMetadata('/aplicar').robots).toBeUndefined()
  })

  it('tolerates a trailing slash and returns {} for unknown paths', () => {
    expect(buildPageMetadata('/courses/')).toEqual(buildPageMetadata('/courses'))
    expect(buildPageMetadata('/does-not-exist')).toEqual({})
  })
})
