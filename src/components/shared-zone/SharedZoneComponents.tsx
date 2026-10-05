import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Logo } from '@/components/layout/Logo'
import { LinkButton } from '@/components/ui/Button'
import { useSharedZone } from '@/context/SharedZoneContext'
import { resolveSocialIcon } from '@/lib/icons'
import { safeHref } from '@/lib/utils'
import type { CtaSettings, SocialLink } from '@/types/content'

export function SiteBrand({ compact = false }: { compact?: boolean }) {
  const { brand } = useSharedZone()
  return <Logo brand={brand} compact={compact} />
}

export function AnnouncementBar() {
  const { announcement } = useSharedZone()
  if (!announcement.enabled || !announcement.text.trim()) return null

  return (
    <div className="border-b border-gold-500/20 bg-ink-900 px-4 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
        <p className="min-w-0 text-xs leading-relaxed text-bone-muted sm:text-sm">{announcement.text}</p>
        {announcement.href ? (
          <SharedLink
            to={announcement.href}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wide2 text-gold-200 underline decoration-gold-500/30 underline-offset-4 hover:text-gold-100"
          >
            {announcement.buttonText || 'Learn more'}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </SharedLink>
        ) : null}
      </div>
    </div>
  )
}

export function SharedLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  const href = safeHref(to)
  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    return (
      <a href={href} className={className} target={/^https?:/i.test(href) ? '_blank' : undefined} rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return <Link to={href} className={className}>{children}</Link>
}

export function SocialLinks({
  links,
  iconOnly = false,
}: {
  links?: SocialLink[]
  iconOnly?: boolean
}) {
  const shared = useSharedZone()
  const items = (links ?? shared.socials).filter((social) => social.href.trim())
  if (!items.length) return null

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.map((social) => {
        const Icon = resolveSocialIcon(social.icon)
        return (
          <li key={social.id}>
            <a
              href={safeHref(social.href)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-200"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {!iconOnly ? <span className="text-[0.65rem] uppercase tracking-wide2">{social.label}</span> : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function GlobalContact({ compact = false }: { compact?: boolean }) {
  const { contact } = useSharedZone()

  return (
    <ul className="space-y-4">
      {contact.email ? (
        <li>
          <a
            href={safeHref(`mailto:${contact.email}`)}
            className="flex min-h-11 min-w-0 items-center gap-3 break-all text-sm text-bone-muted transition-colors hover:text-gold-200"
          >
            <Mail className="h-4 w-4 shrink-0 text-gold-500/60" aria-hidden="true" />
            {contact.email}
          </a>
        </li>
      ) : null}
      {contact.phone ? (
        <li>
          <a
            href={safeHref(`tel:${contact.phone.replace(/[^\d+]/g, '')}`)}
            className="flex min-h-11 min-w-0 items-center gap-3 break-words text-sm text-bone-muted transition-colors hover:text-gold-200"
          >
            <Phone className="h-4 w-4 shrink-0 text-gold-500/60" aria-hidden="true" />
            {contact.phone}
          </a>
        </li>
      ) : null}
      {contact.whatsapp ? (
        <li>
          <a
            href={safeHref(`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 min-w-0 items-center gap-3 text-sm text-bone-muted transition-colors hover:text-gold-200"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-gold-500/60" aria-hidden="true" />
            WhatsApp
          </a>
        </li>
      ) : null}
      {contact.addressLine1 ? (
        <li className="flex items-start gap-3 text-sm leading-relaxed text-bone-dim">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/60" aria-hidden="true" />
          <span>
            {contact.addressLine1}
            {contact.addressLine2 ? <>, {contact.addressLine2}</> : null}
            <br />
            {[contact.city, contact.country].filter(Boolean).join(', ')}
            {contact.mapUrl ? (
              <a
                href={safeHref(contact.mapUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block min-h-10 text-[0.68rem] uppercase tracking-wide2 text-gold-300 underline underline-offset-4"
              >
                View on map
              </a>
            ) : null}
          </span>
        </li>
      ) : null}
      {!compact && contact.businessHours.length ? (
        <li className="border-t border-white/[0.06] pt-3 text-xs leading-relaxed text-bone-dim">
          {contact.businessHours.map((hours) => <p key={hours}>{hours}</p>)}
        </li>
      ) : null}
    </ul>
  )
}

export function TrustStats({ compact = false }: { compact?: boolean }) {
  const { trust } = useSharedZone()
  const stats = [
    { id: 'shared-projects', value: trust.projectsCount, label: 'Projects delivered' },
    { id: 'shared-years', value: trust.experienceYears, label: 'Years of experience' },
    { id: 'shared-rating', value: trust.rating, label: 'Average rating' },
    ...(trust.clientCount ? [{ id: 'shared-clients', value: trust.clientCount, label: 'Clients' }] : []),
    ...trust.stats,
  ].filter((stat) => stat.value.trim())
  if (!stats.length && !trust.badges.length && !trust.certifications.length && !trust.awards.length) return null

  if (compact) {
    return (
      <div className="mt-16 border-t border-white/[0.07] pt-8 sm:mt-20 sm:pt-10">
        <dl className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex min-w-0 flex-col gap-2">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="gold-text break-words font-display text-3xl font-light leading-none sm:text-5xl">
                {stat.value}
              </dd>
              <dd className="text-[0.62rem] uppercase tracking-wide2 text-bone-dim sm:text-[0.68rem]">{stat.label}</dd>
            </div>
          ))}
        </dl>
        {trust.badges.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {trust.badges.map((badge) => <li key={badge} className="chip">{badge}</li>)}
          </ul>
        ) : null}
      </div>
    )
  }

  return (
    <section className="border-y border-white/[0.06] bg-ink-950/70 py-8 sm:py-10" aria-label="Agency credentials">
      <div className="shell">
        {stats.length ? (
          <dl className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex min-w-0 flex-col gap-2">
                <dt className="gold-text break-words font-display text-3xl font-light leading-none sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="text-[0.62rem] uppercase tracking-wide2 text-bone-dim sm:text-[0.68rem]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {trust.badges.length ? (
          <ul className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.06] pt-5">
            {trust.badges.map((badge) => (
              <li key={badge} className="chip">{badge}</li>
            ))}
          </ul>
        ) : null}
        {trust.certifications.length || trust.awards.length ? (
          <ul className="mt-5 grid gap-3 border-t border-white/[0.06] pt-5 sm:grid-cols-2">
            {[...trust.certifications, ...trust.awards].map((credential) => (
              <li key={credential} className="break-words text-xs leading-relaxed text-bone-dim">
                {credential}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

export function GlobalCTA({ cta }: { cta?: CtaSettings }) {
  const { cta: sharedCta, contact } = useSharedZone()
  const content = cta ?? sharedCta

  return (
    <div className="reveal panel-gold relative overflow-hidden px-5 py-10 text-center sm:px-12 sm:py-16">
      <span className="hairline absolute inset-x-6 top-0 sm:inset-x-10" aria-hidden="true" />
      {content.eyebrow ? (
        <span className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/[0.08] px-4 py-1.5 text-[0.62rem] uppercase tracking-luxe text-gold-200">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse-gold rounded-full bg-gold-300" aria-hidden="true" />
          {content.eyebrow}
        </span>
      ) : null}
      <h2 className="display mx-auto mt-7 max-w-4xl text-display-sm">{content.headline}</h2>
      {content.body ? <p className="lede mx-auto mt-5 max-w-2xl">{content.body}</p> : null}
      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
        <LinkButton to={content.buttonHref} size="lg" iconRight={<ArrowUpRight className="h-4 w-4" />}>
          {content.buttonLabel}
        </LinkButton>
        <LinkButton to="/portfolio" variant="ghost" size="lg">See the work first</LinkButton>
      </div>
      <p className="mt-7 break-words text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
        Or email us directly ·{' '}
        <SharedLink to={contact.email ? `mailto:${contact.email}` : '/contact'} className="text-gold-300 underline decoration-gold-500/40 underline-offset-4">
          we reply within two working hours
        </SharedLink>
      </p>
    </div>
  )
}
