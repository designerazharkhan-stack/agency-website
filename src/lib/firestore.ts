/**
 * Firestore collection paths — the single source of truth for the data model.
 *
 * Layout:
 *   settings/{docId}                      singleton settings (brand, hero, seo…)
 *   {collection}/{docId}                  editable content collections
 *   submissions/{docId}                   public contact form submissions
 *
 * Public content lives in one flat namespace so that a single Security Rules
 * predicate can express "published OR owner". Admin-only collections
 * (`submissions`) are never publicly readable.
 */

import type { CollectionReference, DocumentReference, Firestore } from 'firebase/firestore'
import { collection, doc } from 'firebase/firestore'

export const COLLECTIONS = {
  settings: 'settings',
  services: 'services',
  projects: 'projects',
  posts: 'posts',
  plans: 'plans',
  testimonials: 'testimonials',
  values: 'values',
  stats: 'stats',
  process: 'process',
  team: 'team',
  clients: 'clients',
  awards: 'awards',
  faqs: 'faqs',
  submissions: 'submissions',
} as const

export type CollectionKey = Exclude<keyof typeof COLLECTIONS, 'settings'>

/** Settings document ids. */
export const SETTINGS_DOCS = {
  brand: 'brand',
  hero: 'hero',
  cta: 'cta',
  contact: 'contact',
  socials: 'socials',
  seo: 'seo',
  theme: 'theme',
  navigation: 'navigation',
  footer: 'footer',
} as const

export type SettingsDocKey = keyof typeof SETTINGS_DOCS

export function collectionRef(db: Firestore, key: CollectionKey): CollectionReference {
  return collection(db, COLLECTIONS[key])
}

export function settingsRef(db: Firestore, key: SettingsDocKey): DocumentReference {
  return doc(db, COLLECTIONS.settings, SETTINGS_DOCS[key])
}

/** Storage path helpers. */
export const storagePaths = {
  logo: () => 'brand/logo',
  media: (sub = '') => `media${sub ? `/${sub}` : ''}`,
  posts: () => 'media/posts',
  projects: () => 'media/projects',
  team: () => 'media/team',
  testimonials: () => 'media/testimonials',
  seo: () => 'media/seo',
  submission: () => 'media/submissions',
}
