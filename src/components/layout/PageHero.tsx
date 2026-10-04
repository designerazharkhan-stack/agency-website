import type { ReactNode } from 'react'

import { Container, Eyebrow, Orb } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

export interface Crumb {
  label: string
  to?: string
}

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  image,
  meta,
  children,
  className,
  compact,
}: {
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  image?: string
  meta?: Array<{ label: string; value: string }>
  children?: ReactNode
  className?: string
  compact?: boolean
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-white/[0.06]',
        compact ? 'pb-14 pt-14 sm:pb-16 sm:pt-20' : 'pb-20 pt-16 sm:pb-24 sm:pt-24',
        className,
      )}
    >
      <div className="absolute inset-0 -z-20 bg-ink-radial" aria-hidden="true" />
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.13]"
            loading="eager"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/85 via-ink-950/92 to-ink-950" aria-hidden="true" />
        </>
      ) : (
        <div className="grid-lines pointer-events-none absolute inset-0 -z-20 opacity-50" aria-hidden="true" />
      )}
      <Orb className="-right-24 -top-32" color="rgba(194,154,60,0.16)" size={520} />

      <Container className="relative">
        <div className="max-w-4xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

          <h1
            className={cn(
              'display mt-7',
              compact ? 'text-display-md' : 'text-display-lg',
            )}
          >
            {title}
            {accent ? (
              <>
                {' '}
                <span className="gold-text animate-shimmer">{accent}</span>
              </>
            ) : null}
          </h1>

          {description ? <p className="lede mt-8 max-w-2xl">{description}</p> : null}

          {meta?.length ? (
            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/[0.07] pt-8 sm:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-[0.62rem] uppercase tracking-wide2 text-bone-dim">{item.label}</dt>
                  <dd className="gold-text mt-2 font-display text-3xl font-light">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {children ? <div className="mt-10">{children}</div> : null}
        </div>
      </Container>
    </section>
  )
}

/** Standard page body spacing. */
export function PageSection({
  children,
  className,
  id,
  tight = false,
}: {
  children: ReactNode
  className?: string
  id?: string
  tight?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        tight ? 'relative py-12 sm:py-16 lg:py-20' : 'relative py-16 sm:py-20 lg:py-24',
        className,
      )}
    >
      {children}
    </section>
  )
}
