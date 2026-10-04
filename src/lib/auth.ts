/**
 * Firebase Authentication — email/password only, session persisted in
 * `localStorage`. No privileged roles are read from the client; whether a
 * signed-in user may write is decided entirely by Firestore/Storage rules
 * checking `request.auth.token.admin === true`.
 */

import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  type Auth,
  type User,
  type UserCredential,
} from 'firebase/auth'

import { assertFirebaseConfigured, getFirebaseAuth } from './firebase'
import type { Admin } from '@/types/content'

/** Custom claim written by a Cloud Function when an admin is promoted. */
const ADMIN_CLAIM = 'admin'

export type AdminIdentity = Admin

export function emptyIdentity(): AdminIdentity {
  return { uid: '', email: '', displayName: '', photoUrl: null, isAdmin: false, isPending: false }
}

let persistenceReady = false

async function ready(): Promise<Auth> {
  assertFirebaseConfigured()
  const auth = await getFirebaseAuth()
  if (!persistenceReady) {
    await setPersistence(auth, browserLocalPersistence)
    persistenceReady = true
  }
  return auth
}

async function toIdentity(user: User): Promise<AdminIdentity> {
  const token = await getIdTokenResult(user)
  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Admin',
    photoUrl: user.photoURL,
    isAdmin: token.claims[ADMIN_CLAIM] === true || token.claims[ADMIN_CLAIM] === 'true',
    isPending: false,
  }
}

/** Observe the auth session. Returns the unsubscribe function. */
export function observeAuth(
  onChange: (identity: AdminIdentity) => void,
  onError: (error: Error) => void,
): () => void {
  let cancelled = false
  let unsubscribe: (() => void) | null = null

  const run = async () => {
    try {
      const auth = await ready()
      if (cancelled) return
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (!user) {
            onChange(emptyIdentity())
            return
          }
          toIdentity(user)
            .then((identity) => {
              if (!cancelled) onChange(identity)
            })
            .catch((error: unknown) => {
              if (!cancelled) {
                onError(error instanceof Error ? error : new Error('Could not read your session.'))
              }
            })
        },
        (error) => {
          if (!cancelled) onError(error instanceof Error ? error : new Error('Auth listener failed.'))
        },
      )
    } catch (error) {
      onChange(emptyIdentity())
      onError(error instanceof Error ? error : new Error('Could not reach Firebase Auth.'))
    }
  }

  void run()

  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

export async function signIn(email: string, password: string): Promise<AdminIdentity> {
  const auth = await ready()
  const credential: UserCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
  return toIdentity(credential.user)
}

export async function register(email: string, password: string, displayName: string): Promise<AdminIdentity> {
  const auth = await ready()
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() })
  }
  return toIdentity(credential.user)
}

export async function signInWithGoogle(): Promise<AdminIdentity> {
  const auth = await ready()
  const { GoogleAuthProvider, signInWithPopup: popup } = await import('firebase/auth')
  const credential = await popup(auth, new GoogleAuthProvider())
  return toIdentity(credential.user)
}

export async function resetPassword(email: string): Promise<void> {
  const auth = await ready()
  await sendPasswordResetEmail(auth, email.trim())
}

export async function signOut(): Promise<void> {
  const auth = await ready()
  await fbSignOut(auth)
}

/**
 * Force a fresh token read. Required after an admin claim is granted or
 * revoked, otherwise the client keeps a stale claim until the token expires.
 */
export async function refreshIdentity(identity: AdminIdentity): Promise<AdminIdentity> {
  if (!identity.uid) return emptyIdentity()
  const auth = await getFirebaseAuth()
  const user = auth.currentUser
  if (!user) return emptyIdentity()
  await user.getIdToken(true)
  return toIdentity(user)
}

export { ADMIN_CLAIM }
