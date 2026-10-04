import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Container({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('shell', className)} {...rest}>
      {children}
    </div>
  )
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  tight?: boolean
  id?: string
}

export function Section({ as: Tag = 'section', tight, className, children, id, ...rest }: SectionProps) {
  return (
    <Tag id={id} className={cn(tight ? 'section-tight' : 'section', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function Eyebrow({
  children,
  center,
  className,
}: {
  children: ReactNode
  center?: boolean
  className?: string
}) {
  return <span className={cn(center ? 'eyebrow-center' : 'eyebrow', className)}>{children}</span>
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow ? <Eyebrow center={align === 'center'}>{eyebrow}</Eyebrow> : null}
      <Tag
        className={cn(
          'display text-display-sm',
          align === 'center' && 'max-w-3xl',
        )}
      >
        {title}
        {accent ? (
          <>
            {' '}
            <span className="gold-text animate-shimmer">{accent}</span>
          </>
        ) : null}
      </Tag>
      {description ? (
        <p className={cn('lede max-w-2xl', align === 'center' && 'mx-auto')}>{description}</p>
      ) : null}
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'gold' | 'outline' | 'success' | 'danger'
  className?: string
}) {
  const tones = {
    neutral: 'border-white/10 bg-white/[0.04] text-bone-muted',
    gold: 'border-gold-500/30 bg-gold-500/10 text-gold-200',
    outline: 'border-white/20 bg-transparent text-bone-dim',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    danger: 'border-red-500/30 bg-red-500/10 text-red-200',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-wide2',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('hairline-t', className)} aria-hidden="true" />
}

export function Panel({
  children,
  className,
  gold,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  gold?: boolean
  as?: ElementType
}) {
  return <Tag className={cn(gold ? 'panel-gold' : 'panel', className)}>{children}</Tag>
}

export function StatBlock({
  value,
  label,
  className,
  align = 'left',
}: {
  value: string
  label: string
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', align === 'center' && 'items-center text-center', className)}>
      <span className="gold-text font-display text-4xl font-light leading-none sm:text-5xl">{value}</span>
      <span className="text-[0.68rem] uppercase tracking-wide2 text-bone-dim">{label}</span>
    </div>
  )
}

/** Decorative glow orb. */
export function Orb({
  className,
  color = 'rgba(194,154,60,0.22)',
  size = 480,
}: {
  className?: string
  color?: string
  size?: number
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('orb', className)}
      style={{ width: size, height: size, background: color, filter: `blur(${Math.round(size / 4)}px)` }}
    />
  )
}

/** Full-height section with an image-backed overlay. */
export function ImageBackdrop({
  src,
  alt = '',
  className,
  opacity = 0.28,
  children,
}: {
  src?: string
  alt?: string
  className?: string
  opacity?: number
  children?: ReactNode
}) {
  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden={alt ? undefined : true}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ opacity }}
        />
      ) : null}
      <div className="absolute inset-0 bg-ink-radial" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/70 to-ink-950" />
      {children}
    </div>
  )
}

/** Empty-state block used by the admin lists and public filtered lists. */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.012] px-6 py-14 text-center',
        className,
      )}
    >
      {icon ? <div className="text-gold-400/70">{icon}</div> : null}
      <div className="space-y-2">
        <p className="font-display text-2xl font-light text-bone">{title}</p>
        {description ? <p className="mx-auto max-w-md text-sm text-bone-dim">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
