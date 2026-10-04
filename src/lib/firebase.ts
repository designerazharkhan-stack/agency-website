/**
 * Lazy Firebase bootstrap.
 *
 * Nothing is initialised until a feature actually needs it, which keeps the
 * initial bundle small and lets the public site run (on bundled default
 * content) when Firebase has not been configured yet.
 */

import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'
import { firebaseEnv, isFirebaseConfigured, siteEnv } from './env'

let appPromise: Promise<FirebaseApp> | null = null
let authPromise: Promise<Auth> | null = null
let dbPromise: Promise<Firestore> | null = null
let storagePromise: Promise<FirebaseStorage> | null = null

async function getApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = (async () => {
      const { getApp, getApps, initializeApp } = await import('firebase/app')
      const config = {
        apiKey: firebaseEnv.apiKey,
        authDomain: firebaseEnv.authDomain,
        projectId: firebaseEnv.projectId,
        storageBucket: firebaseEnv.storageBucket,
        messagingSenderId: firebaseEnv.messagingSenderId,
        appId: firebaseEnv.appId,
        measurementId: firebaseEnv.measurementId || undefined,
      }
      return getApps().length ? getApp() : initializeApp(config)
    })()
  }
  return appPromise
}

export async function getFirebaseAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = (async () => {
      const { connectAuthEmulator, getAuth } = await import('firebase/auth')
      const app = await getApp()
      const auth = getAuth(app)
      if (siteEnv.useEmulators) {
        try {
          connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
        } catch {
          /* already connected */
        }
      }
      return auth
    })()
  }
  return authPromise
}

export async function getDb(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const { connectFirestoreEmulator, getFirestore } = await import('firebase/firestore')
      const app = await getApp()
      const db = getFirestore(app)
      if (siteEnv.useEmulators) {
        try {
          connectFirestoreEmulator(db, '127.0.0.1', 8080)
        } catch {
          /* already connected */
        }
      }
      return db
    })()
  }
  return dbPromise
}

export async function getStorage(): Promise<FirebaseStorage> {
  if (!storagePromise) {
    storagePromise = (async () => {
      const { connectStorageEmulator, getStorage: getFsStorage } = await import('firebase/storage')
      const app = await getApp()
      const storage = getFsStorage(app)
      if (siteEnv.useEmulators) {
        try {
          connectStorageEmulator(storage, '127.0.0.1', 9199)
        } catch {
          /* already connected */
        }
      }
      return storage
    })()
  }
  return storagePromise
}

/**
 * Guard used by every admin write path. Throws a typed error so the UI can
 * surface a useful message instead of a generic permission-denied string.
 */
export function assertFirebaseConfigured(): void {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Copy .env.example to .env.local and add your Firebase web app credentials.',
    )
  }
}

export const firebaseReady = isFirebaseConfigured
