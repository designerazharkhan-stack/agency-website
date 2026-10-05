import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import { GlobalContact, SharedLink, SiteBrand, SocialLinks } from '@/components/shared-zone/SharedZoneComponents'
import { useSharedZone } from '@/context/SharedZoneContext'

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

export function SiteFooter() {
  const zone = useSharedZone()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink-950 noise">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <span
        className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gold-500/[0.07] blur-[120px]"
        aria-hidden="true"
      />

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-3">
            <SiteBrand />
            <p className="mt-6 max-w-sm break-words text-sm leading-relaxed text-bone-dim">
              {zone.footer.tagline}
            </p>
            <div className="mt-7"><SocialLinks iconOnly /></div>
          </div>

          {/* Links */}
          <nav className="lg:col-span-2" aria-label="Explore">
            <h3 className="mb-5 text-[0.66rem] uppercase tracking-luxe text-gold-400">Explore</h3>
            <ul className="space-y-3">
              {zone.footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <SharedLink
                    to={link.href}
                    className="inline-flex min-h-11 items-center break-words text-sm text-bone-dim transition-colors duration-400 hover:text-gold-200"
                  >
                    {link.label}
                  </SharedLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label="Services">
            <h3 className="mb-5 text-[0.66rem] uppercase tracking-luxe text-gold-400">Services</h3>
            <ul className="space-y-3">
              {zone.footer.serviceLinks.map((link) => (
                <li key={link.href}>
                  <SharedLink to={link.href} className="inline-flex min-h-11 items-center break-words text-sm text-bone-dim transition-colors hover:text-gold-200">
                    {link.label}
                  </SharedLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Offices */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[0.66rem] uppercase tracking-luxe text-gold-400">Offices</h3>
            <ul className="space-y-5">
              {zone.footer.offices.map((office) => (
                <li key={office.id} className="space-y-1.5">
                  <p className="font-display text-lg font-light text-bone">{office.city}</p>
                  <p className="text-sm leading-relaxed text-bone-dim">{office.address}</p>
                  {office.phone ? (
                    <a href={`tel:${office.phone.replace(/[^\d+]/g, '')}`} className="inline-block min-h-11 py-2 text-sm text-bone-dim underline decoration-gold-500/30 underline-offset-4 transition-colors hover:text-gold-200">
                      {office.phone}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0 lg:col-span-3">
            <h3 className="mb-5 text-[0.66rem] uppercase tracking-luxe text-gold-400">Start something</h3>
            <GlobalContact compact />

            <SharedLink
              to={zone.cta.buttonHref || '/contact'}
              className="group mt-7 inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-wide2 text-gold-200 transition-colors hover:text-gold-100"
            >
              {zone.cta.buttonLabel || 'Book a consultation'}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </SharedLink>
          </div>
        </div>

        {zone.footer.newsletter.enabled ? (
          <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-gold-500/20 bg-gold-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-light text-bone">{zone.footer.newsletter.heading}</h3>
              <p className="mt-1 text-sm text-bone-dim">{zone.footer.newsletter.description}</p>
            </div>
            <SharedLink to={zone.footer.newsletter.href} className="btn-ghost min-h-11 shrink-0">
              {zone.footer.newsletter.buttonText}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </SharedLink>
          </div>
        ) : null}

        <div className="mt-14 border-t border-white/[0.06] pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <p className="text-xs text-bone-dim">
                © {year} {zone.brand.siteName}. {zone.footer.copyrightText}
              </p>
              {zone.footer.legalNote ? (
                <p className="max-w-xl text-[0.7rem] leading-relaxed text-bone-dim/70">{zone.footer.legalNote}</p>
              ) : null}
            </div>

            <ul className="flex flex-wrap items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[0.7rem] uppercase tracking-wide2 text-bone-dim transition-colors hover:text-gold-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  className="text-[0.7rem] uppercase tracking-wide2 text-bone-dim/50 transition-colors hover:text-gold-200"
                >
                  Studio login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export const Footer = SiteFooter
