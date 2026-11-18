import { describe, expect, it } from 'vitest'
import { normalizeAuMobile } from '@/lib/validation/au-phone'

describe('normalizeAuMobile', () => {
  it.each([
    ['0412 345 678', '+61412345678'],
    ['0412345678', '+61412345678'],
    ['412345678', '+61412345678'],
    ['+61 412 345 678', '+61412345678'],
    ['+61412345678', '+61412345678'],
    ['61412345678', '+61412345678'],
    ['0061 412 345 678', '+61412345678'],
    ['(04) 1234-5678', '+61412345678'],
  ])('accepts %s', (input, expected) => {
    expect(normalizeAuMobile(input)).toBe(expected)
  })

  it.each([
    '',
    'abc',
    '0312345678', // landline
    '0212345678', // landline
    '04123456', // too short
    '041234567890', // too long
    '+57 300 123 4567', // not Australian
    '+1 415 555 0100',
    '04 1234 5678 9',
    '0412 345 67a',
  ])('rejects %s', (input) => {
    expect(normalizeAuMobile(input)).toBeNull()
  })
})
