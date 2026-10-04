/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
  readonly VITE_FIREBASE_VAPID_KEY?: string
  readonly VITE_USE_FIREBASE_EMULATORS?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_CONTACT_PHONE?: string
  readonly VITE_ENABLE_ADMIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  __AGENCY_BUILD_TIME__?: string
}

declare const __APP_BUILD_TIME__: string
declare const __HAS_FIREBASE_CONFIG__: boolean
