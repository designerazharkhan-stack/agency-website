import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LogOut, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { LogoMark } from '@/components/layout/Logo'
import { useAuth } from '@/context/AuthContext'
import { siteEnv } from '@/lib/env'

/**
 * Route guard for the whole `/admin` area.
 *
 * Authorisation is decided by the Firebase custom claim `admin === true`, and
 * every write is independently re-checked by Firestore and Storage Security
 * Rules. This component is UX only — it hides screens, it does not grant
 * access. There is deliberately no "sign up" path: accounts are created by an
 * existing administrator or through the documented first-admin script.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, identity, signOut } = useAuth()
  const location = useLocation()
  const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`)

  if (status === 'initialising') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950" role="status" aria-live="polite">
        <span className="flex flex-col items-center gap-4">
          <LogoMark size={40} />
          <span className="h-6 w-6 animate-spin-slow rounded-full border border-gold-500/25 border-t-gold-300" aria-hidden="true" />
          <span className="text-[0.68rem] uppercase tracking-luxe text-bone-dim">Checking your session</span>
        </span>
      </div>
    )
  }

  if (status === 'unavailable' || !siteEnv.adminEnabled) {
    return <AdminUnavailable onSignOut={status === 'signed-in' ? signOut : undefined} />
  }

  if (status === 'signed-out') {
    return <Navigate to={`/admin/login?redirect=${redirectTo}`} replace />
  }

  if (status === 'unauthorised') {
    return <NotAnAdmin email={identity.email} onSignOut={signOut} />
  }

  return <>{children}</>
}

/** Shown when Firebase has no configuration, so the reason is never a blank page. */
export function AdminUnavailable({ onSignOut }: { onSignOut?: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 py-16">
      <div className="panel w-full max-w-2xl p-8 sm:p-10">
        <LogoMark size={40} />
        <h1 className="display mt-6 text-display-xs">The dashboard needs your Firebase project</h1>
        <p className="lede mt-4 text-base">
          No Firebase web configuration was found, so the admin area cannot authenticate or write content. The public
          site is fully functional on bundled demo content in the meantime.
        </p>

        <ol className="mt-8 space-y-4 text-sm text-bone-muted">
          <li className="flex gap-3">
            <span className="chip-gold shrink-0">1</span>
            <span>
              Copy <code className="font-mono text-xs text-gold-200">.env.example</code> to{' '}
              <code className="font-mono text-xs text-gold-200">.env.local</code>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="chip-gold shrink-0">2</span>
            <span>
              In the Firebase console open <em>Project settings → Your apps</em> and register a Web app, then paste the
              six <code className="font-mono text-xs text-gold-200">VITE_FIREBASE_*</code> values.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="chip-gold shrink-0">3</span>
            <span>
              Enable <em>Authentication → Email/Password</em>, create your admin account, and grant it the{' '}
              <code className="font-mono text-xs text-gold-200">admin</code> custom claim.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="chip-gold shrink-0">4</span>
            <span>
              Deploy the rules in <code className="font-mono text-xs text-gold-200">firebase/</code> with{' '}
              <code className="font-mono text-xs text-gold-200">npm run deploy:rules</code>, then restart the dev
              server.
            </span>
          </li>
        </ol>

        <p className="mt-8 text-xs leading-relaxed text-bone-dim">
          Full walkthrough: <code className="font-mono text-gold-300">docs/FIRST_ADMIN.md</code> and{' '}
          <code className="font-mono text-gold-300">docs/FIREBASE_SETUP.md</code>. No credentials are stored in this
          repository — the Firebase web config is public by design and access is controlled by Security Rules.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/" className="btn-ghost">
            Back to the site
          </a>
          {onSignOut ? (
            <Button variant="quiet" onClick={() => void onSignOut()} icon={<LogOut className="h-4 w-4" />}>
              Sign out
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Signed in, but without the admin custom claim. */
function NotAnAdmin({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 py-16">
      <div className="panel w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="display text-display-xs">This account is not an administrator</h1>
        <p className="mt-4 text-sm leading-relaxed text-bone-muted">
          You are signed in as <span className="text-bone">{email || 'an unknown address'}</span>, but the{' '}
          <code className="font-mono text-xs text-gold-200">admin</code> custom claim is not set on this user. Content
          writes are rejected by Firestore Security Rules, so nothing here is editable.
        </p>
        <p className="mt-5 rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-left text-xs leading-relaxed text-bone-dim">
          Grant access from a trusted machine with the Admin SDK (never from the browser):
          <code className="mt-2 block whitespace-pre-wrap font-mono text-[0.7rem] text-gold-300">
            {`node scripts/grant-admin.mjs you@example.com\n# then sign out and back in here`}
          </code>
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={() => void onSignOut()} icon={<LogOut className="h-4 w-4" />}>
            Sign out
          </Button>
          <a href="/" className="btn-outline-light">
            Back to the site
          </a>
        </div>
      </div>
    </div>
  )
}
