import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  emptyIdentity,
  observeAuth,
  refreshIdentity as refreshIdentityService,
  signIn as signInService,
  signOut as signOutService,
  type AdminIdentity,
} from '@/lib/auth'
import { firebaseReady } from '@/lib/firebase'

export type AuthStatus = 'initialising' | 'signed-out' | 'signed-in' | 'unauthorised' | 'unavailable'

interface AuthContextValue {
  status: AuthStatus
  identity: AdminIdentity
  error: string | null
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('initialising')
  const [identity, setIdentity] = useState<AdminIdentity>(emptyIdentity)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseReady) {
      setStatus('unavailable')
      setIdentity(emptyIdentity())
      return
    }

    setStatus('initialising')
    const unsubscribe = observeAuth(
      (next) => {
        setIdentity(next)
        if (!next.uid) setStatus('signed-out')
        else setStatus(next.isAdmin ? 'signed-in' : 'unauthorised')
      },
      (authError) => {
        setError(authError.message)
        setStatus('signed-out')
      },
    )
    return unsubscribe
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null)
    setStatus('initialising')
    try {
      const next = await signInService(email, password)
      setIdentity(next)
      setStatus(next.isAdmin ? 'signed-in' : 'unauthorised')
      if (!next.isAdmin) {
        setError(
          'Signed in, but this account does not carry the admin claim. Run the "grant admin" script for this UID.',
        )
      }
    } catch (signInError) {
      setStatus('signed-out')
      const code = (signInError as { code?: string }).code ?? ''
      const message = {
        'auth/invalid-credential': 'Those credentials do not match an account.',
        'auth/user-not-found': 'No account exists with that email address.',
        'auth/wrong-password': 'That password is incorrect.',
        'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/network-request-failed': 'Network error. Check your connection and try again.',
      }[code]
      setError(message ?? (signInError instanceof Error ? signInError.message : 'Sign in failed.'))
      throw signInError
    }
  }, [])

  const signOut = useCallback(async () => {
    await signOutService().catch(() => undefined)
    setIdentity(emptyIdentity())
    setStatus('signed-out')
    setError(null)
  }, [])

  const refresh = useCallback(async () => {
    const next = await refreshIdentityService(identity)
    setIdentity(next)
    setStatus(next.uid ? (next.isAdmin ? 'signed-in' : 'unauthorised') : 'signed-out')
  }, [identity])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      identity,
      error,
      isAdmin: status === 'signed-in' && identity.isAdmin,
      signIn,
      signOut,
      refresh,
      clearError,
    }),
    [status, identity, error, signIn, signOut, refresh, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
