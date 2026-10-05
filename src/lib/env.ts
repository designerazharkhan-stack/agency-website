/**
 * Runtime environment access.
 *
 * Everything here is PUBLIC. Firebase's web SDK configuration is not a secret
 * — access is controlled by Firestore/Storage Security Rules and by Firebase
 * Authentication, never by hiding a key from the bundle.
 *
 * No private key, service-account JSON or admin credential ever enters this
 * file or this application.
 */

const env = import.meta.env

/** Raw value lookup with trimming. */
function raw(key: keyof ImportMetaEnv): string {
  const value = env[key]
  return typeof value === 'string' ? value.trim() : ''
}

export const firebaseEnv = {
  apiKey: raw('VITE_FIREBASE_API_KEY'),
  authDomain: raw('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: raw('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: raw('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: raw('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: raw('VITE_FIREBASE_APP_ID'),
  measurementId: raw('VITE_FIREBASE_MEASUREMENT_ID'),
  vapidKey: raw('VITE_FIREBASE_VAPID_KEY'),
} as const

export const siteEnv = {
  siteUrl: raw('VITE_SITE_URL') || 'https://agency-website.web.app',
  contactEmail: raw('VITE_CONTACT_EMAIL') || 'hello@agencywebsite.com',
  contactPhone: raw('VITE_CONTACT_PHONE') || '+1 (415) 555-0182',
  useEmulators: raw('VITE_USE_FIREBASE_EMULATORS') === 'true',
  adminEnabled: raw('VITE_ENABLE_ADMIN') !== 'false',
} as const

/**
 * True when enough of the Firebase web config is present to boot the SDK.
 * When false the app runs entirely on bundled default content and the admin
 * area renders a "not configured" screen instead of throwing.
 */
export const isFirebaseConfigured: boolean =
  Boolean(firebaseEnv.apiKey) &&
  Boolean(firebaseEnv.projectId) &&
  Boolean(firebaseEnv.authDomain) &&
  Boolean(firebaseEnv.appId)

export const firebaseEnvMissing: string[] = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
].filter((key) => !raw(key as keyof ImportMetaEnv))

/** Absolute URL helper used by the SEO manager. */
export function absoluteUrl(path = '/', siteUrl = siteEnv.siteUrl): string {
  const base = siteUrl.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

export const buildInfo = {
  time: typeof __APP_BUILD_TIME__ === 'string' ? __APP_BUILD_TIME__ : 'dev',
  firebaseConfigured: isFirebaseConfigured,
} as const
