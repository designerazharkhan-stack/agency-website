import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import type { BrandSettings } from '@/types/content'

/**
 * Monogram mark. Rendered as inline SVG so it stays crisp at any size and
 * needs no network request. The client can replace it with a real logo file
 * via `/admin` → Branding → logo URL.
 */
export function LogoMark({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="agency-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#846020" />
          <stop offset="34%" stopColor="#DFC884" />
          <stop offset="58%" stopColor="#F6EED6" />
          <stop offset="82%" stopColor="#C29A3C" />
          <stop offset="100%" stopColor="#A67C2A" />
        </linearGradient>
      </defs>
      <path
        d="M24 3.5 43 14.2v19.6L24 44.5 5 33.8V14.2L24 3.5Z"
        fill="none"
        stroke="url(#agency-mark)"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <path
        d="M24 11.2 35.4 17.6v12.8L24 36.8 12.6 30.4V17.6L24 11.2Z"
        fill="none"
        stroke="url(#agency-mark)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <path
        d="M24 18.6 30.4 22.4 24 26.2 17.6 22.4 24 18.6Zm0 0v14.8m6.4-11v-3.8"
        fill="none"
        stroke="url(#agency-mark)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Wordmark({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-[1.45rem] font-light leading-none tracking-[0.12em] text-bone',
        className,
      )}
    >
      {name.toUpperCase()}
    </span>
  )
}

export interface LogoProps {
  brand: BrandSettings
  className?: string
  compact?: boolean
  to?: string
}

export function Logo({ brand, className, compact, to = '/' }: LogoProps) {
  const custom = brand.logoUrl

  return (
    <Link
      to={to}
      className={cn('group inline-flex items-center gap-3', className)}
      aria-label={`${brand.siteName} — home`}
    >
      {custom ? (
        <img
          src={custom}
          alt={brand.siteName}
          className="h-9 w-auto max-w-[10rem] object-contain transition-opacity duration-500 group-hover:opacity-80"
        />
      ) : (
        <>
          <LogoMark className="transition-transform duration-700 ease-luxe group-hover:rotate-[8deg]" />
          {!compact ? <Wordmark name={brand.siteName} /> : null}
        </>
      )}
    </Link>
  )
}
