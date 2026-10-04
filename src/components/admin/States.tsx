import type { ReactNode } from 'react'
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { EmptyState as PublicEmptyState } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

/** Skeleton block used while a dashboard collection loads. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-white/[0.045]', className)} aria-hidden="true" />
}

/** Full-panel loading state with an accessible live region. */
export function LoadingState({
  label = 'Loading content',
  rows = 3,
  className,
}: {
  label?: string
  rows?: number
  className?: string
}) {
  return (
    <div className={cn('panel space-y-4 p-6', className)} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin-slow rounded-full border border-gold-500/30 border-t-gold-300" aria-hidden="true" />
        <span className="text-sm text-bone-muted">{label}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className={cn('h-16', index === 0 && 'h-20')} />
        ))}
      </div>
    </div>
  )
}

/** Compact inline spinner for toolbars and table cells. */
export function InlineLoading({ label = 'Working' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-bone-dim" role="status">
      <span className="h-3.5 w-3.5 animate-spin-slow rounded-full border border-gold-500/30 border-t-gold-300" aria-hidden="true" />
      {label}
    </span>
  )
}

/** Error panel with a retry affordance. */
export function ErrorState({
  title = 'Could not load this',
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}: {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-4 rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-xl font-light text-bone">{title}</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-bone-muted">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button variant="outline-light" size="sm" onClick={onRetry} icon={<RefreshCw className="h-3.5 w-3.5" />}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

/** Empty list state used by every admin table and public filtered view. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <PublicEmptyState
      icon={<Inbox className="h-7 w-7" aria-hidden="true" />}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}
