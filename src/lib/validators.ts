/**
 * Validation helpers for the admin forms and the public contact form.
 * Deliberately dependency-free and shared so rules never drift between the
 * dashboard and the live form.
 */

export type FieldErrors<T> = Partial<Record<keyof T, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i
const PHONE_RE = /^[+()\d][\d\s()+-]{6,}$/

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

export function isUrl(value: string): boolean {
  return URL_RE.test(value.trim())
}

export function isPhone(value: string): boolean {
  return PHONE_RE.test(value.trim())
}

export interface SlugShape {
  slug: string
}

export function validateSlug(value: string): string | undefined {
  if (!value.trim()) return 'A URL slug is required.'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim())) {
    return 'Use lowercase letters, numbers and single hyphens only.'
  }
  return undefined
}

export interface EmailShape {
  email: string
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'An email address is required.'
  if (!isEmail(value)) return 'That does not look like a valid email address.'
  return undefined
}

export interface TextShape {
  name: string
}

export function validateName(value: string): string | undefined {
  if (!value.trim()) return 'A name is required.'
  if (value.trim().length < 2) return 'That name looks too short.'
  return undefined
}

export function validateUrlField(value: string, label = 'This URL'): string | undefined {
  if (!value.trim()) return undefined
  if (!isUrl(value)) return `${label} must start with http:// or https://`
  return undefined
}

export function requiredText(value: string, label = 'This field'): string | undefined {
  if (!value.trim()) return `${label} is required.`
  return undefined
}

export function collectErrors<T extends object>(
  checks: Array<[keyof T, string | undefined]>,
): FieldErrors<T> {
  const errors: FieldErrors<T> = {}
  for (const [key, message] of checks) {
    if (message) errors[key] = message
  }
  return errors
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0
}
