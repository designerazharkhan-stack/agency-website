import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

import { Logo } from './Logo'
import { useSiteContent } from '@/context/ContentContext'
import { resolveSocialIcon } from '@/lib/icons'
import { cn, safeHref } from '@/lib/utils'

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

const QUICK_LINKS = [
  { label: 'Work', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/about' },
  { label: 'Journal', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  const site = useSiteContent()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink-950 noise">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <span
        className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gold-500/[0.07] blur-[120px]"
        aria-hidden="true"
      />

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo brand={site.brand} />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone-dim">
              {site.footer?.tagline ?? site.brand.tagline}
            </p>

            {site.socials?.length ? (
              <ul className="mt-7 flex flex-wrap items-center gap-2">
                {site.socials.map((social) => {
                  const Icon = resolveSocialIcon(social.icon)
                  return (
                    <li key={social.id}>
                      <a
                        href={safeHref(social.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        title={social.label}
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]',
                          'text-bone-dim transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:border-gold-500/40 hover:text-gold-200',
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>

          {/* Links */}
          <nav className="lg:col-span-2" aria-label="Explore">
            <h3 className="mb-5 text-[0.66rem] uppercase tracking-luxe text-gold-400">Explore</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-bone-dim transition-colors duration-400 hover:text-gold-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Offices */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-[0.66rem] uppercase tracking-luxe text-gold-400">Offices</h3>
            <ul className="space-y-5">
              {(site.footer?.offices ?? []).map((office) => (
                <li key={office.id} className="space-y-1.5">
                  <p className="font-display text-lg font-light text-bone">{office.city}</p>
                  <p className="text-sm leading-relaxed text-bone-dim">{office.address}</p>
                  {office.phone ? (
                    <a
                      href={safeHref(`tel:${office.phone.replace(/[^\d+]/g, '')}`)}
                      className="inline-block text-sm text-bone-dim underline decoration-gold-500/30 underline-offset-4 transition-colors hover:text-gold-200"
                    >
                      {office.phone}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-[0.66rem] uppercase tracking-luxe text-gold-400">Start something</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={safeHref(`mailto:${site.contact?.email ?? ''}`)}
                  className="group flex items-center gap-3 text-sm text-bone-muted transition-colors hover:text-gold-200"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold-500/60" aria-hidden="true" />
                  {site.contact?.email}
                </a>
              </li>
              {site.contact?.phone ? (
                <li>
                  <a
                    href={safeHref(`tel:${site.contact.phone.replace(/[^\d+]/g, '')}`)}
                    className="group flex items-center gap-3 text-sm text-bone-muted transition-colors hover:text-gold-200"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold-500/60" aria-hidden="true" />
                    {site.contact.phone}
                  </a>
                </li>
              ) : null}
              {site.contact?.addressLine1 ? (
                <li className="flex items-start gap-3 text-sm leading-relaxed text-bone-dim">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/60" aria-hidden="true" />
                  <span>
                    {site.contact.addressLine1}
                    {site.contact.addressLine2 ? <>, {site.contact.addressLine2}</> : null}
                    <br />
                    {[site.contact.city, site.contact.country].filter(Boolean).join(', ')}
                  </span>
                </li>
              ) : null}
            </ul>

            <Link
              to="/contact"
              className="group mt-7 inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-wide2 text-gold-200 transition-colors hover:text-gold-100"
            >
              Book a consultation
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.06] pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <p className="text-xs text-bone-dim">
                © {year} {site.brand.siteName}. {site.brand.tagline}.
              </p>
              {site.footer?.legalNote ? (
                <p className="max-w-xl text-[0.7rem] leading-relaxed text-bone-dim/70">{site.footer.legalNote}</p>
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
