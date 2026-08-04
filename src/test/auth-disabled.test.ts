import { describe, expect, it } from 'vitest'
import { hasSupabaseConfig } from '../lib/config'

describe('authentication-disabled guest behavior', () => {
  it('recognizes absent or partial public configuration as guest-only', () => {
    expect(hasSupabaseConfig('', '')).toBe(false)
    expect(hasSupabaseConfig('https://example.supabase.co', '')).toBe(false)
    expect(hasSupabaseConfig(undefined, undefined)).toBe(false)
    expect(hasSupabaseConfig('https://example.supabase.co', 'sb_publishable_test')).toBe(true)
  })
})
