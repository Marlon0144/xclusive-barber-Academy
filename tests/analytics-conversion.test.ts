import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ADS_CONVERSION_SEND_TO,
  normalizeEmailForAds,
  normalizePhoneForAds,
  reportLeadSubmission,
} from '@/lib/analytics/conversion'

function makeStorage() {
  const map = new Map<string, string>()
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  }
}

function stubBrowser({ gtag = true, fbq = true } = {}) {
  const gtagMock = vi.fn()
  const fbqMock = vi.fn()
  vi.stubGlobal('window', {
    ...(gtag ? { gtag: gtagMock } : {}),
    ...(fbq ? { fbq: fbqMock } : {}),
    sessionStorage: makeStorage(),
  })
  return { gtagMock, fbqMock }
}

const submission = {
  transactionId: 'lead-123',
  form: 'aplicar' as const,
  programa: 'elite',
  userData: { email: '  Ana@Example.com ', phone: '0412345678' },
}

describe('normalizers', () => {
  it('lower-cases/trims email and puts phones in E.164 form', () => {
    expect(normalizeEmailForAds('  Ana@Example.COM ')).toBe('ana@example.com')
    expect(normalizeEmailForAds('')).toBeUndefined()
    expect(normalizeEmailForAds(null)).toBeUndefined()
    expect(normalizePhoneForAds('+61 412 345 678')).toBe('+61412345678')
    expect(normalizePhoneForAds('61412345678')).toBe('+61412345678')
    expect(normalizePhoneForAds('0412 345 678')).toBe('+61412345678')
    expect(normalizePhoneForAds('+57 300 123 4567')).toBe('+573001234567')
    expect(normalizePhoneForAds('3001234567')).toBeUndefined() // no country code, not an AU mobile
    expect(normalizePhoneForAds('123')).toBeUndefined()
    expect(normalizePhoneForAds(undefined)).toBeUndefined()
  })
})

describe('reportLeadSubmission', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('uses the Google Ads conversion label from the brief', () => {
    expect(ADS_CONVERSION_SEND_TO).toBe('AW-16998011333/s44pCMiZnLodEMWjpKk_')
  })

  it('sends user_data, the GA4 event, the Ads conversion and Meta Lead — in that order', async () => {
    const { gtagMock, fbqMock } = stubBrowser()
    await reportLeadSubmission(submission)

    const calls = gtagMock.mock.calls
    expect(calls[0]).toEqual(['set', 'user_data', { email: 'ana@example.com', phone_number: '+61412345678' }])
    expect(calls[1]).toEqual([
      'event',
      'academy_apply_submit',
      { form: 'aplicar', programa: 'elite', transaction_id: 'lead-123' },
    ])

    const [, name, params] = calls[2]
    expect(name).toBe('conversion')
    expect(params).toMatchObject({
      send_to: 'AW-16998011333/s44pCMiZnLodEMWjpKk_',
      value: 1,
      currency: 'AUD',
      transaction_id: 'lead-123',
    })

    expect(fbqMock).toHaveBeenCalledWith(
      'track',
      'Lead',
      { content_name: 'Mentoría Elite 1 a 1', content_category: 'aplicar' },
      { eventID: 'lead-123' },
    )
  })

  it('reports exactly once per application: a repeat (reload) sends nothing but still lets the visitor move on', async () => {
    const { gtagMock, fbqMock } = stubBrowser()
    await reportLeadSubmission(submission)
    const sentFirst = gtagMock.mock.calls.length
    const fbqFirst = fbqMock.mock.calls.length

    const then = vi.fn()
    await reportLeadSubmission(submission, { then })

    expect(gtagMock.mock.calls.length).toBe(sentFirst)
    expect(fbqMock.mock.calls.length).toBe(fbqFirst)
    expect(then).toHaveBeenCalledTimes(1)
  })

  it('a different application is reported separately', async () => {
    const { gtagMock } = stubBrowser()
    await reportLeadSubmission(submission)
    const before = gtagMock.mock.calls.length
    await reportLeadSubmission({ ...submission, transactionId: 'lead-456' })

    expect(gtagMock.mock.calls.length).toBeGreaterThan(before)
  })

  it('omits user_data when there is no email or phone, and omits programa when unknown', async () => {
    const { gtagMock } = stubBrowser()
    await reportLeadSubmission({ transactionId: 'lead-9', form: 'qualify' })

    expect(gtagMock.mock.calls.some((call) => call[0] === 'set')).toBe(false)
    expect(gtagMock.mock.calls[0]).toEqual(['event', 'academy_apply_submit', { form: 'qualify', transaction_id: 'lead-9' }])
  })

  it('runs `then` once the Google tag confirms dispatch (even if it calls back per destination)', async () => {
    const { gtagMock } = stubBrowser()
    const then = vi.fn()
    await reportLeadSubmission(submission, { then })
    expect(then).not.toHaveBeenCalled()

    const conversion = gtagMock.mock.calls.find((call) => call[1] === 'conversion')!
    const params = conversion[2] as { event_callback: () => void }
    params.event_callback()
    params.event_callback()
    expect(then).toHaveBeenCalledTimes(1)
  })

  it('never blocks the visitor when gtag.js is blocked: waits briefly, then runs `then` and sends nothing', async () => {
    const { fbqMock } = stubBrowser({ gtag: false })
    const then = vi.fn()

    const pending = reportLeadSubmission(submission, { then, waitMs: 300 })
    await vi.advanceTimersByTimeAsync(500)
    await pending

    expect(then).toHaveBeenCalledTimes(1)
    expect(fbqMock).not.toHaveBeenCalled()
  })

  it('starts as soon as gtag.js appears (page-load race on the thank-you page)', async () => {
    const gtagMock = vi.fn()
    vi.stubGlobal('window', { sessionStorage: makeStorage() })

    const pending = reportLeadSubmission(submission, { waitMs: 5000 })
    await vi.advanceTimersByTimeAsync(300)
    ;(globalThis as unknown as { window: { gtag?: unknown } }).window.gtag = gtagMock
    await vi.advanceTimersByTimeAsync(200)
    await pending

    expect(gtagMock.mock.calls.some((call) => call[1] === 'conversion')).toBe(true)
  })

  it('does not throw on the server (no window)', async () => {
    const then = vi.fn()
    await expect(reportLeadSubmission(submission, { then })).resolves.toBeUndefined()
    expect(then).toHaveBeenCalledTimes(1)
  })
})
