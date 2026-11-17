import { describe, expect, it } from 'vitest'
import { classifyContactLink } from '@/lib/analytics/contact-links'

describe('classifyContactLink', () => {
  it('classifies wa.me links as whatsapp and drops the pre-filled message', () => {
    expect(
      classifyContactLink('https://wa.me/61413891977?text=Hola%20equipo%2C%20quiero%20asesoria'),
    ).toEqual({ kind: 'whatsapp', url: 'https://wa.me/61413891977' })
  })

  it('classifies a bare wa.me link', () => {
    expect(classifyContactLink('https://wa.me/61413891977')).toEqual({
      kind: 'whatsapp',
      url: 'https://wa.me/61413891977',
    })
  })

  it('normalises an http wa.me link to https in the reported url', () => {
    expect(classifyContactLink('http://wa.me/61413891977')?.url).toBe('https://wa.me/61413891977')
  })

  it('classifies tel: links as phone', () => {
    expect(classifyContactLink('tel:+61413891977')).toEqual({
      kind: 'phone',
      url: 'tel:+61413891977',
    })
  })

  it('does not match look-alike hosts (exact hostname match only)', () => {
    expect(classifyContactLink('https://wa.me.evil.example/61413891977')).toBeNull()
    expect(classifyContactLink('https://notwa.me/61413891977')).toBeNull()
    expect(classifyContactLink('https://example.com/wa.me/61413891977')).toBeNull()
  })

  it('ignores other protocols and ordinary links', () => {
    expect(classifyContactLink('mailto:hello@example.com')).toBeNull()
    expect(classifyContactLink('https://www.instagram.com/xclusive')).toBeNull()
    expect(classifyContactLink('https://xclusiveacademy.com.au/qualify')).toBeNull()
  })

  it('returns null for empty, relative, or malformed input', () => {
    expect(classifyContactLink(undefined)).toBeNull()
    expect(classifyContactLink(null)).toBeNull()
    expect(classifyContactLink('')).toBeNull()
    expect(classifyContactLink('/qualify')).toBeNull()
    expect(classifyContactLink('not a url')).toBeNull()
  })
})
