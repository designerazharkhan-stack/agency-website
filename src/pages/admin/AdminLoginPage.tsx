import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react'

import { LogoMark, Wordmark } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { useAuth } from '@/context/AuthContext'
import { isFirebaseConfigured } from '@/lib/env'
import { safeInternalPath } from '@/lib/utils'

/**
 * Admin sign-in.
 *
 * Email + password only, through Firebase Authentication. There is no public
 * registration: accounts are created by an existing administrator, and the
 * first one is bootstrapped with the documented Admin SDK script. The
 * `admin` custom claim on the token is what actually grants access.
 */
export default function AdminLoginPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, status, error, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = safeInternalPath(params.get('redirect'))

  useEffect(() => {
    if (status === 'signed-in') navigate(redirectTo, { replace: true })
  }, [status, navigate, redirectTo])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()

    const nextErrors: typeof fieldErrors = {}
    if (!email.trim()) nextErrors.email = 'Enter your admin email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) nextErrors.email = 'That email address looks invalid.'
    if (!password) nextErrors.password = 'Enter your password.'
    else if (password.length < 6) nextErrors.password = 'Passwords are at least 6 characters.'

    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(redirectTo, { replace: true })
    } catch {
      /* the context already exposes a human-readable message */
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5 py-12">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="panel p-7 sm:p-9">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs text-bone-dim transition-colors hover:text-gold-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to the website
          </Link>

          <div className="flex items-center gap-3">
            <LogoMark size={38} />
            <Wordmark name="Agency Website" className="text-2xl" />
          </div>

          <h1 className="display mt-7 text-display-xs">Dashboard sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-bone-muted">
            Content management for the website. Access is granted per user by a Firebase custom claim — signing in with
            a valid account is not enough on its own.
          </p>

          {!isFirebaseConfigured ? (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-gold-500/30 bg-gold-500/[0.07] p-4"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-bone-muted">
                Firebase is not configured yet, so sign-in is disabled. Add your web app credentials to{' '}
                <code className="font-mono text-gold-200">.env.local</code> — see{' '}
                <code className="font-mono text-gold-200">docs/FIREBASE_SETUP.md</code>.
              </p>
            </div>
          ) : null}

          <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={fieldErrors.email}
              placeholder="you@agencywebsite.com"
              disabled={!isFirebaseConfigured || submitting}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={fieldErrors.password}
              disabled={!isFirebaseConfigured || submitting}
              actions={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-bone-dim transition-colors hover:text-gold-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {error ? (
              <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={submitting}
              disabled={!isFirebaseConfigured}
              icon={submitting ? undefined : <Lock className="h-4 w-4" aria-hidden="true" />}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 border-t border-white/[0.07] pt-6">
            <p className="flex items-start gap-2.5 text-xs leading-relaxed text-bone-dim">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80" aria-hidden="true" />
              <span>
                First time here? An administrator must create your account and run{' '}
                <code className="font-mono text-gold-300">npm run grant:admin -- you@example.com</code> to attach the{' '}
                <code className="font-mono text-gold-300">admin</code> claim. Full instructions in{' '}
                <code className="font-mono text-gold-300">docs/FIRST_ADMIN.md</code>.
              </span>
            </p>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-wide2 text-bone-dim">
          {submitting ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> : null}
          Protected by Firebase Authentication + Firestore Security Rules
        </p>
      </div>
    </div>
  )
}
