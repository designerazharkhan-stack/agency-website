import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'

import { Button, LinkButton } from '@/components/ui/Button'
import { AnnouncementBar, SiteBrand, SocialLinks } from '@/components/shared-zone/SharedZoneComponents'
import { useScrolledPast } from '@/hooks/useScroll'
import { useSiteContent } from '@/context/ContentContext'
import { useSharedZone } from '@/context/SharedZoneContext'
import { cn, safeHref } from '@/lib/utils'
import type { NavItem } from '@/types/content'

export function Navbar() {
  const site = useSiteContent()
  const sharedZone = useSharedZone()
  const scrolled = useScrolledPast(20)
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

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

  const cta = sharedZone.cta.buttonLabel || 'Start a project'

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>

      <header
        data-public-navbar
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-700 ease-luxe',
          scrolled
            ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-2xl'
            : 'border-b border-transparent bg-gradient-to-b from-ink-950/80 to-transparent',
        )}
      >
        <AnnouncementBar />
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-3 xl:gap-6">
          <SiteBrand />

          <nav className="hidden items-center gap-0 lg:flex xl:gap-1" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative px-2 py-2 text-[0.7rem] uppercase tracking-wide2 transition-colors duration-400 xl:px-4 xl:text-[0.78rem]',
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

          <div className="hidden items-center gap-2 lg:flex xl:gap-4">
            {sharedZone.contact.phone ? (
              <a
                href={safeHref(`tel:${sharedZone.contact.phone.replace(/[^\d+]/g, '')}`)}
                aria-label={`Call ${sharedZone.contact.phone}`}
                className="flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-bone-dim transition-colors hover:text-gold-200"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden xl:inline">{sharedZone.contact.phone}</span>
              </a>
            ) : null}
            <LinkButton
              to={sharedZone.cta.buttonHref || '/contact'}
              size="sm"
              iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              {cta}
            </LinkButton>
          </div>

          <Button
            ref={menuButtonRef}
            variant="quiet"
            className="!px-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className={cn('hairline transition-opacity duration-500', scrolled ? 'opacity-100' : 'opacity-0')} />
      </header>

      <MobileMenu
        open={open}
        onClose={closeMenu}
        triggerRef={menuButtonRef}
        nav={nav}
        ctaLabel={cta}
        ctaHref={sharedZone.cta.buttonHref || '/contact'}
        phone={sharedZone.contact.phone}
      />
    </>
  )
}

function MobileMenu({
  open,
  onClose,
  triggerRef,
  nav,
  ctaLabel,
  ctaHref,
  phone,
}: {
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
  nav: NavItem[]
  ctaLabel: string
  ctaHref: string
  phone: string
}) {
  const { brand } = useSharedZone()
  const menuRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeElement = document.activeElement
      if (!menuRef.current?.contains(activeElement)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target.focus()
      } else if (event.shiftKey && activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      triggerRef.current?.focus()
    }
  }, [open, onClose, triggerRef])

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed inset-0 z-[110] lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      id="mobile-navigation"
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
        aria-hidden="true"
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
          <SiteBrand compact />
          <Button ref={closeButtonRef} variant="quiet" className="!px-2" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-col" aria-label="Mobile">
          {nav.map((item, index) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-baseline gap-4 border-b border-white/[0.06] py-4',
                  isActive && 'text-gold-200',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="font-mono text-[0.6rem] text-gold-500/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={cn(
                    'font-display text-3xl font-light transition-colors duration-400 group-hover:text-gold-200',
                    isActive ? 'text-gold-200' : 'text-bone',
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
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

          <div className="flex justify-center pt-2"><SocialLinks iconOnly /></div>
        </div>
      </div>
    </div>
  )
}
