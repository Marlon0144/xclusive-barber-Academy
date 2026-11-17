import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { gtagEvent, gtagEventThen } from '@/lib/analytics/gtag'

type GtagMock = ReturnType<typeof vi.fn>

function stubWindow(gtag?: GtagMock) {
  vi.stubGlobal('window', gtag ? { gtag } : {})
}

describe('gtagEvent', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false and does not throw on the server (no window)', () => {
    expect(gtagEvent('academy_whatsapp_click', { page_path: '/' })).toBe(false)
  })

  it('returns false when gtag.js is not present (ad blocker / still loading)', () => {
    stubWindow()
    expect(gtagEvent('academy_phone_click')).toBe(false)
  })

  it('sends a gtag "event" call with the given name and params', () => {
    const gtag = vi.fn()
    stubWindow(gtag)

    expect(gtagEvent('academy_whatsapp_click', { link_url: 'https://wa.me/61413891977' })).toBe(true)
    expect(gtag).toHaveBeenCalledWith('event', 'academy_whatsapp_click', {
      link_url: 'https://wa.me/61413891977',
    })
  })

  it('drops undefined params instead of sending them', () => {
    const gtag = vi.fn()
    stubWindow(gtag)

    gtagEvent('academy_apply_submit', { form: 'apply', programa: undefined })
    expect(gtag).toHaveBeenCalledWith('event', 'academy_apply_submit', { form: 'apply' })
  })

  it('never throws if gtag itself throws', () => {
    stubWindow(
      vi.fn(() => {
        throw new Error('boom')
      }),
    )
    expect(gtagEvent('academy_phone_click')).toBe(false)
  })
})

describe('gtagEventThen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('runs `then` immediately when gtag is unavailable', () => {
    stubWindow()
    const then = vi.fn()

    gtagEventThen('academy_apply_submit', { form: 'qualify' }, then)
    expect(then).toHaveBeenCalledTimes(1)
  })

  it('runs `then` immediately when gtag throws', () => {
    stubWindow(
      vi.fn(() => {
        throw new Error('boom')
      }),
    )
    const then = vi.fn()

    gtagEventThen('academy_apply_submit', { form: 'qualify' }, then)
    expect(then).toHaveBeenCalledTimes(1)
  })

  it('waits for gtag’s event_callback, then runs `then` exactly once', () => {
    const gtag = vi.fn()
    stubWindow(gtag)
    const then = vi.fn()

    gtagEventThen('academy_apply_submit', { form: 'qualify', programa: 'elite' }, then)
    expect(then).not.toHaveBeenCalled()

    const params = gtag.mock.calls[0][2] as { event_callback: () => void; event_timeout: number; programa: string }
    expect(gtag.mock.calls[0][0]).toBe('event')
    expect(params.programa).toBe('elite')
    expect(params.event_timeout).toBe(1000)

    // gtag may call back once per destination (GA4 + Google Ads).
    params.event_callback()
    params.event_callback()
    expect(then).toHaveBeenCalledTimes(1)

    // The fallback timer was cleared, so it can't fire a second time.
    vi.advanceTimersByTime(5000)
    expect(then).toHaveBeenCalledTimes(1)
  })

  it('falls back to the timeout when gtag never calls back', () => {
    stubWindow(vi.fn())
    const then = vi.fn()

    gtagEventThen('academy_apply_submit', { form: 'qualify' }, then, 800)
    vi.advanceTimersByTime(799)
    expect(then).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(then).toHaveBeenCalledTimes(1)
  })
})
