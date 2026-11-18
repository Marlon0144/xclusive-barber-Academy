import { describe, expect, it } from 'vitest'
import {
  ATTRIBUTION_KEYS,
  externalReferrer,
  extractTrackingParams,
  hasTrackingParams,
  mergeAttribution,
  parseAttribution,
  sanitizeAttribution,
  sanitizeValue,
  serializeAttribution,
} from '@/lib/analytics/attribution'
import { attributionAnswerRows, readAttribution } from '@/lib/leads/attribution'

describe('extractTrackingParams', () => {
  it('keeps only the known click ids and utm params', () => {
    const result = extractTrackingParams(
      '?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=academy&utm_term=curso%20barberia&utm_content=ad1&fbclid=F1&foo=bar&other=1',
    )
    expect(result).toEqual({
      gclid: 'TEST123',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'academy',
      utm_term: 'curso barberia',
      utm_content: 'ad1',
      fbclid: 'F1',
    })
  })

  it('returns {} when there is nothing to track', () => {
    expect(extractTrackingParams('')).toEqual({})
    expect(extractTrackingParams('?page=2')).toEqual({})
  })

  it('reads gbraid / wbraid too', () => {
    expect(extractTrackingParams('?gbraid=G&wbraid=W')).toEqual({ gbraid: 'G', wbraid: 'W' })
  })
})

describe('sanitizeValue / sanitizeAttribution', () => {
  it('trims, strips control characters and caps the length', () => {
    expect(sanitizeValue('  abc  ')).toBe('abc')
    expect(sanitizeValue('a\u0000b\nc')).toBe('abc')
    expect(sanitizeValue('x'.repeat(500))).toHaveLength(150)
    expect(sanitizeValue('   ')).toBeUndefined()
    expect(sanitizeValue(42)).toBeUndefined()
    expect(sanitizeValue(null)).toBeUndefined()
  })

  it('drops unknown keys (no arbitrary data reaches the cookie or the database)', () => {
    expect(sanitizeAttribution({ gclid: 'A', evil: '<script>', __proto__: { x: 1 } })).toEqual({ gclid: 'A' })
    expect(sanitizeAttribution('nope')).toEqual({})
    expect(sanitizeAttribution(null)).toEqual({})
  })
})

describe('mergeAttribution', () => {
  const organic = { landingPage: '/courses/starter', referrer: 'https://www.instagram.com/' }

  it('first visit without parameters still stores landing page + referrer', () => {
    expect(mergeAttribution(null, { params: {}, ...organic })).toEqual({
      landing_page: '/courses/starter',
      referrer: 'https://www.instagram.com/',
    })
  })

  it('a later visit WITHOUT parameters never erases earlier ones', () => {
    const stored = { gclid: 'TEST123', utm_source: 'google', landing_page: '/', referrer: 'https://www.google.com/' }
    const merged = mergeAttribution(stored, { params: {}, landingPage: '/courses/elite' })
    expect(merged).toEqual(stored)
  })

  it('a later visit WITH parameters replaces them (latest campaign click wins) and updates the context', () => {
    const stored = { gclid: 'OLD', utm_source: 'google', landing_page: '/' }
    const merged = mergeAttribution(stored, {
      params: { gclid: 'NEW', utm_source: 'google', utm_campaign: 'spring' },
      landingPage: '/curso-barberia-melbourne',
    })
    expect(merged).toEqual({
      gclid: 'NEW',
      utm_source: 'google',
      utm_campaign: 'spring',
      landing_page: '/curso-barberia-melbourne',
    })
  })

  it('a paid visit replaces an earlier organic one', () => {
    const stored = { landing_page: '/', referrer: 'https://www.instagram.com/' }
    const merged = mergeAttribution(stored, { params: { gclid: 'G' }, landingPage: '/aplicar' })
    expect(merged.gclid).toBe('G')
    expect(merged.landing_page).toBe('/aplicar')
  })

  it('hasTrackingParams ignores the context keys', () => {
    expect(hasTrackingParams({ landing_page: '/', referrer: 'x' })).toBe(false)
    expect(hasTrackingParams({ utm_source: 'google' })).toBe(true)
    expect(hasTrackingParams(null)).toBe(false)
  })
})

describe('parseAttribution / serializeAttribution', () => {
  it('round-trips raw and URL-encoded JSON', () => {
    const attribution = { gclid: 'A b', utm_source: 'google', landing_page: '/x' }
    const json = serializeAttribution(attribution)

    expect(parseAttribution(json)).toEqual(attribution)
    expect(parseAttribution(encodeURIComponent(json))).toEqual(attribution)
  })

  it('never throws on garbage and drops unknown keys', () => {
    expect(parseAttribution(undefined)).toEqual({})
    expect(parseAttribution('')).toEqual({})
    expect(parseAttribution('not json')).toEqual({})
    expect(parseAttribution('%E0%A4%A')).toEqual({})
    expect(parseAttribution('{"gclid":"A","hack":"x"}')).toEqual({ gclid: 'A' })
    expect(parseAttribution('[1,2,3]')).toEqual({})
  })
})

describe('externalReferrer', () => {
  it('keeps origin + path of external referrers and drops the query', () => {
    expect(externalReferrer('https://www.google.com/search?q=barber', 'xclusiveacademy.com.au')).toBe(
      'https://www.google.com/search',
    )
  })

  it('ignores same-site, empty and invalid referrers', () => {
    expect(externalReferrer('https://xclusiveacademy.com.au/courses', 'xclusiveacademy.com.au')).toBeUndefined()
    expect(externalReferrer('', 'xclusiveacademy.com.au')).toBeUndefined()
    expect(externalReferrer('not a url', 'xclusiveacademy.com.au')).toBeUndefined()
  })
})

describe('readAttribution (server side)', () => {
  it('hidden form fields win over the cookie', () => {
    const form = new FormData()
    form.set('attr_gclid', 'FROM_FORM')
    form.set('attr_utm_source', 'google')

    expect(readAttribution(form, JSON.stringify({ gclid: 'FROM_COOKIE' }))).toEqual({
      gclid: 'FROM_FORM',
      utm_source: 'google',
    })
  })

  it('falls back to the cookie when the form carries nothing', () => {
    expect(readAttribution(new FormData(), JSON.stringify({ gclid: 'FROM_COOKIE', landing_page: '/' }))).toEqual({
      gclid: 'FROM_COOKIE',
      landing_page: '/',
    })
    expect(readAttribution(new FormData(), undefined)).toEqual({})
  })

  it('sanitises form input (length, control chars, unknown fields)', () => {
    const form = new FormData()
    form.set('attr_gclid', `  ${'x'.repeat(400)}\u0000`)
    form.set('attr_hacker', 'no')
    const result = readAttribution(form, undefined)

    expect(result.gclid).toHaveLength(150)
    expect(Object.keys(result)).toEqual(['gclid'])
  })
})

describe('attributionAnswerRows', () => {
  it('creates one crm_lead_answers row per captured key, named attr_<key>', () => {
    const rows = attributionAnswerRows('lead-1', { gclid: 'G', utm_campaign: 'spring', landing_page: '/aplicar' })

    expect(rows).toEqual([
      { lead_id: 'lead-1', question_key: 'attr_gclid', answer_text: 'G' },
      { lead_id: 'lead-1', question_key: 'attr_utm_campaign', answer_text: 'spring' },
      { lead_id: 'lead-1', question_key: 'attr_landing_page', answer_text: '/aplicar' },
    ])
    expect(attributionAnswerRows('lead-1', {})).toEqual([])
  })

  it('only ever produces known keys', () => {
    const rows = attributionAnswerRows('l', Object.fromEntries(ATTRIBUTION_KEYS.map((k) => [k, 'v'])))
    expect(rows).toHaveLength(ATTRIBUTION_KEYS.length)
  })
})
