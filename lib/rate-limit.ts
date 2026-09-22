import { headers } from 'next/headers'

/**
 * Minimal in-memory rate limiter for public Server Actions.
 *
 * Scope note (be honest about the limitation): this is per-instance memory,
 * not a shared store. On a multi-instance serverless deployment (Vercel),
 * a determined attacker distributed across cold starts/regions can exceed
 * these limits. This is intentionally "minimal" per the audit recommendation
 * (docs/ACADEMY_TECHNICAL_AUDIT.md §11) — it stops naive scripted spam and
 * accidental double-submits today, without adding new infrastructure
 * (Redis/Upstash) or a DB migration (blocked — see Task #1, no live Supabase
 * access yet). Revisit with a shared store (e.g. Upstash Ratelimit, or a
 * Supabase table) before spending meaningfully on paid ads traffic.
 */

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanupAt = Date.now()

function cleanupExpiredBuckets(now: number) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return
  lastCleanupAt = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds?: number
}

/**
 * Fixed-window rate limiter. `key` should already include the action name
 * and caller identity (see rateLimitedIp below) — this function only tracks
 * counts per key, it doesn't build the key itself.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  cleanupExpiredBuckets(now)

  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { allowed: true }
}

/**
 * Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
 * Falls back to a constant so the limiter still degrades to "one shared
 * bucket" rather than throwing when headers are unavailable (e.g. tests).
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = headersList.get('x-real-ip')
  if (realIp) return realIp

  return 'unknown'
}

/**
 * Convenience wrapper for the common case: rate-limit a public Server
 * Action by (action name + caller IP).
 */
export async function checkActionRateLimit(
  action: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const ip = await getClientIp()
  return checkRateLimit(`${action}:${ip}`, limit, windowMs)
}
