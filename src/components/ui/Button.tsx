import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'ghost' | 'outline-light' | 'quiet' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'btn-primary btn-sheen',
  ghost: 'btn-ghost',
  'outline-light': 'btn-outline-light',
  quiet: 'btn-quiet',
  danger: 'btn border border-red-500/40 bg-red-500/10 text-red-200 hover:border-red-400/70 hover:bg-red-500/20',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn('btn', VARIANTS[variant], SIZES[size], className)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconRight,
    fullWidth,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, cn(fullWidth && 'w-full', className))}
      {...rest}
    >
      {loading ? <Spinner className="h-3.5 w-3.5" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
})

export interface LinkButtonProps {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  icon?: ReactNode
  iconRight?: ReactNode
  external?: boolean
  'aria-label'?: string
}

export function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  iconRight,
  external,
  ...rest
}: LinkButtonProps) {
  const classes = buttonClass(variant, size, className)

  if (external || /^(https?:|mailto:|tel:)/i.test(to)) {
    return (
      <a href={to} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {icon}
        {children}
        {iconRight}
      </a>
    )
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin', className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
