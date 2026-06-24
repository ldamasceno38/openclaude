import { describe, expect, test } from 'bun:test'

import { sanitizeForAds } from './ads.js'

describe('sanitizeForAds', () => {
  test('passes through ordinary prompt text', () => {
    const t = 'help me set up a Next.js app with a Postgres database'
    expect(sanitizeForAds(t)).toBe(t)
  })

  test('redacts API-key shapes (openai, github, aws)', () => {
    expect(sanitizeForAds('my key is sk-ABCDEFGH1234567890 ok')).toContain('[redacted]')
    expect(sanitizeForAds('token ghp_ABCDEFGH1234567890')).toContain('[redacted]')
    expect(sanitizeForAds('AKIAIOSFODNN7EXAMPLE here')).toContain('[redacted]')
    expect(sanitizeForAds('my key is sk-ABCDEFGH1234567890')).not.toContain('sk-ABCDEFGH')
  })

  test('redacts bearer tokens and JWTs', () => {
    expect(sanitizeForAds('Authorization: Bearer abcdef123456789')).toContain('Bearer [redacted]')
    expect(
      sanitizeForAds('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payloadpart.sigpart'),
    ).toContain('[redacted-jwt]')
  })

  test('redacts emails', () => {
    expect(sanitizeForAds('email me at kevin@example.com please')).toContain('[redacted-email]')
    expect(sanitizeForAds('email me at kevin@example.com')).not.toContain('kevin@example.com')
  })

  test('redacts long hex blobs (hashes/keys)', () => {
    const hex = 'a'.repeat(40)
    expect(sanitizeForAds(`hash ${hex} end`)).toContain('[redacted]')
    expect(sanitizeForAds(`hash ${hex} end`)).not.toContain(hex)
  })

  test('truncates to the share cap', () => {
    expect(sanitizeForAds('x'.repeat(2000)).length).toBeLessThanOrEqual(500)
  })

  test('collapses whitespace and trims', () => {
    expect(sanitizeForAds('  a\n\n  b   c  ')).toBe('a b c')
  })
})
