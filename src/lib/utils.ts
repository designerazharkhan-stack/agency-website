/* Small, dependency-free helpers shared across the app. */

/** Conditional className joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Turn a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/** Guarantee a unique slug within a list of existing slugs. */
export function uniqueSlug(base: string, taken: string[]): string {
  const root = slugify(base) || 'item'
  if (!taken.includes(root)) return root
  let n = 2
  while (taken.includes(`${root}-${n}`)) n += 1
  return `${root}-${n}`
}

/**
 * Firestore writes require `undefined` fields to be removed, otherwise the SDK
 * throws `Cannot use "undefined" as a Firestore value`.
 */
export function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(value)) {
    if (val !== undefined) out[key] = val
  }
  return out as T
}

/** Deep merge that treats arrays as replacements. */
export function mergeDefaults<T>(defaults: T, incoming: unknown): T {
  if (incoming === null || incoming === undefined) return defaults
  if (Array.isArray(defaults) || typeof defaults !== 'object') {
    return incoming as T
  }
  if (typeof incoming !== 'object' || Array.isArray(incoming)) return defaults

  const result: Record<string, unknown> = { ...(defaults as Record<string, unknown>) }
  const source = incoming as Record<string, unknown>

  for (const key of Object.keys(source)) {
    const base = result[key]
    const next = source[key]
    if (base && typeof base === 'object' && !Array.isArray(base) && next && typeof next === 'object' && !Array.isArray(next)) {
      result[key] = mergeDefaults(base, next)
    } else if (next !== undefined) {
      result[key] = next
    }
  }
  return result as T
}

/** Format a price for display. */
export function formatPrice(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  if (!amount || amount <= 0) return 'Custom'
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `$${amount.toLocaleString()}`
  }
}

/** Compact number for stat displays: 1200 → 1.2k. */
export function formatCompact(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

/** ISO date → "14 January 2026". */
export function formatDate(iso: string | null | undefined, locale = 'en-US'): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** ISO date → "14 Jan 2026". */
export function formatDateShort(iso: string | null | undefined, locale = 'en-US'): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Relative time from an ISO string. */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.round((then - Date.now()) / 1000)
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  for (const [unit, secs] of units) {
    if (Math.abs(seconds) >= secs) return rtf.format(Math.round(seconds / secs), unit)
  }
  return 'just now'
}

/** Number of words in a Markdown-ish body → reading minutes. */
export function estimateReadMinutes(body: string, wordsPerMinute = 220): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / wordsPerMinute))
}

/** Truncate to a word boundary and add an ellipsis. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`
}

/** Deterministic short hash — used for stable gradient seeds and ids. */
export function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/** Ordered list — by `order` then `createdAt`, always returns a new array. */
export function byOrder<T>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const left = a as { order?: number; createdAt?: string | null }
    const right = b as { order?: number; createdAt?: string | null }
    const ao = left.order ?? 999
    const bo = right.order ?? 999
    if (ao !== bo) return ao - bo
    return String(left.createdAt ?? '').localeCompare(String(right.createdAt ?? ''))
  })
}

/** Pick a deterministic slice based on a seed string. */
export function seededShuffle<T>(items: T[], seed: string, count: number): T[] {
  return [...items]
    .map((item, index) => ({ item, key: hash(`${seed}-${index}`) }))
    .sort((a, b) => a.key - b.key)
    .slice(0, count)
    .map((entry) => entry.item)
}

/** Safe external URL: only allow http(s) and root-relative paths. */
export function safeHref(href: string | undefined | null): string {
  if (!href) return '#'
  const trimmed = href.trim()
  if (trimmed.startsWith('/')) return trimmed
  if (trimmed.startsWith('#')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed
  return '#'
}

/** Is this a string a safe http(s) URL (used for redirects after login)? */
export function safeInternalPath(path: string | undefined | null): string {
  if (!path) return '/admin'
  if (!path.startsWith('/')) return '/admin'
  if (path.startsWith('//')) return '/admin'
  return path
}

/** Split "First Last" into parts for accessible avatar initials. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

/** Local optimistic-concurrency guard for admin forms. */
export function unsavedChanges<T>(a: T, b: T): boolean {
  return JSON.stringify(a) !== JSON.stringify(b)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Build a query string, skipping empty values. */
export function buildQuery(params: Record<string, string | undefined | null>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}
