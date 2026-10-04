import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'

import { Logo } from './Logo'
import { Button, LinkButton } from '@/components/ui/Button'
import { useScrolledPast } from '@/hooks/useScroll'
import { useSiteContent } from '@/context/ContentContext'
import { cn, safeHref } from '@/lib/utils'
import type { BrandSettings, NavItem } from '@/types/content'

export function Navbar() {
  const site = useSiteContent()
  const scrolled = useScrolledPast(20)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const nav: NavItem[] = site.navigation?.length
    ? site.navigation
    : [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
    ]

  const cta = site.hero?.primaryCtaHref ? site.hero.primaryCtaLabel : 'Start a project'

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-700 ease-luxe',
          scrolled
            ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-2xl'
            : 'border-b border-transparent bg-gradient-to-b from-ink-950/80 to-transparent',
        )}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Logo brand={site.brand} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative px-4 py-2 text-[0.78rem] uppercase tracking-wide2 transition-colors duration-400',
                    isActive ? 'text-gold-200' : 'text-bone-muted hover:text-bone',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gold-sheen transition-transform duration-500 ease-luxe',
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={safeHref(site.contact?.phone ? `tel:${site.contact.phone.replace(/[^\d+]/g, '')}` : 'tel:+14155550182')}
              className="flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-bone-dim transition-colors hover:text-gold-200"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden xl:inline">{site.contact?.phone}</span>
            </a>
            <LinkButton
              to={site.hero?.primaryCtaHref || '/contact'}
              size="sm"
              iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              {cta}
            </LinkButton>
          </div>

          <Button
            variant="quiet"
            className="!px-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className={cn('hairline transition-opacity duration-500', scrolled ? 'opacity-100' : 'opacity-0')} />
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        nav={nav}
        ctaLabel={cta}
        ctaHref={site.hero?.primaryCtaHref ?? '/contact'}
        phone={site.contact?.phone ?? ''}
        socials={site.socials ?? []}
        brand={site.brand}
      />
    </>
  )
}

function MobileMenu({
  open,
  onClose,
  nav,
  ctaLabel,
  ctaHref,
  phone,
  socials,
  brand,
}: {
  open: boolean
  onClose: () => void
  nav: NavItem[]
  ctaLabel: string
  ctaHref: string
  phone: string
  socials: Array<{ id: string; label: string; href: string }>
  brand: BrandSettings
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[110] lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
      inert={!open}
      role="dialog"
      aria-modal="true"
      aria-label={`${brand.siteName} navigation`}
    >
      <div
        className={cn(
          'absolute inset-0 bg-ink-950/85 backdrop-blur-md transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto border-l border-white/[0.07] bg-ink-900 px-7 pb-10 pt-6 transition-transform duration-600 ease-luxe',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ transitionDuration: '500ms' }}
      >
        <div className="mb-10 flex items-center justify-between">
          <Logo brand={brand} compact />
          <Button variant="quiet" className="!px-2" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-col" aria-label="Mobile">
          {nav.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="group flex items-baseline gap-4 border-b border-white/[0.06] py-4"
            >
              <span className="font-mono text-[0.6rem] text-gold-500/60">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-3xl font-light text-bone transition-colors duration-400 group-hover:text-gold-200">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-5 pt-10">
          <LinkButton to={ctaHref} className="w-full" size="lg" iconRight={<ArrowUpRight className="h-4 w-4" />}>
            {ctaLabel}
          </LinkButton>

          {phone ? (
            <a href={safeHref(`tel:${phone.replace(/[^\d+]/g, '')}`)} className="block text-center text-sm text-bone-dim">
              {phone}
            </a>
          ) : null}

          {socials.length ? (
            <ul className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={safeHref(social.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.68rem] uppercase tracking-wide2 text-bone-dim transition-colors hover:text-gold-200"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
