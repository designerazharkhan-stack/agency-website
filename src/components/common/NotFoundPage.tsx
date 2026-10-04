import { Suspense, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Compass, Home, Search } from 'lucide-react'

import { buttonClass } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { useSeo } from '@/lib/seo'


const SUGGESTIONS = [
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]

/** 404 page. Rendered inside the public shell so navigation stays available. */
export function NotFoundPage() {
  const { pathname } = useLocation()

  useSeo({
    title: 'Page not found',
    description: 'The page you were looking for does not exist or has moved.',
    path: pathname,
    robots: 'noindex',
  })

  return (
    <Section className="noise">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="gold-text font-display text-[7rem] font-light leading-none sm:text-[10rem]">404</span>
          <h1 className="display mt-4 text-display-sm">This page took a different route</h1>
          <p className="lede mt-5 max-w-xl text-base">
            The address{' '}
            <code className="rounded-md border border-white/10 bg-ink-850 px-2 py-0.5 font-mono text-sm text-gold-200">
              {pathname}
            </code>{' '}
            is not part of this site. It may have been renamed, retired, or never existed.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/" className={buttonClass('primary', 'lg')}>
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
            <Link to="/contact" className={buttonClass('outline-light', 'lg')}>
              <Compass className="h-4 w-4" aria-hidden="true" />
              Tell us what you needed
            </Link>
          </div>

          <div className="mt-14 w-full">
            <p className="eyebrow justify-center">Popular destinations</p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              {SUGGESTIONS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="chip transition-colors duration-500 hover:border-gold-500/40 hover:text-gold-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 flex items-center gap-2 text-xs text-bone-dim">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Looking for something specific? The blog and portfolio are searchable.
          </p>
          <Link to="/portfolio" className="btn-quiet mt-2 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Browse selected work
          </Link>
        </div>
      </Container>
    </Section>
  )
}

/** Full-page fallback used by the route-level `React.lazy` boundaries. */
export function RouteFallback({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] items-center justify-center px-6 py-24">
      <span className="flex flex-col items-center gap-4">
        <span
          className="h-9 w-9 animate-spin-slow rounded-full border border-gold-500/25 border-t-gold-300"
          aria-hidden="true"
        />
        <span className="text-[0.68rem] uppercase tracking-luxe text-bone-dim">{label}</span>
      </span>
    </div>
  )
}

/** Suspense boundary with consistent loading chrome. */
export function RouteSuspense({ children, label }: { children: ReactNode; label?: string }) {
  return <Suspense fallback={<RouteFallback label={label} />}>{children}</Suspense>
}
