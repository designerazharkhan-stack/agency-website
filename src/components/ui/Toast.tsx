import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

import { useToasts, type ToastMessage } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const TONES = {
  success: { icon: CheckCircle2, ring: 'border-emerald-500/30', accent: 'text-emerald-300', bar: 'bg-emerald-400/70' },
  error: { icon: AlertCircle, ring: 'border-red-500/30', accent: 'text-red-300', bar: 'bg-red-400/70' },
  info: { icon: Info, ring: 'border-gold-500/30', accent: 'text-gold-200', bar: 'bg-gold-400/70' },
} as const

export function ToastViewport() {
  const { messages, dismiss } = useToasts()

  if (messages.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-6 sm:top-6 sm:bottom-auto sm:items-end"
      role="status"
      aria-live="polite"
    >
      {messages.map((message) => (
        <ToastCard key={message.id} message={message} onDismiss={() => dismiss(message.id)} />
      ))}
    </div>
  )
}

function ToastCard({ message, onDismiss }: { message: ToastMessage; onDismiss: () => void }) {
  const tone = TONES[message.tone]
  const Icon = tone.icon

  return (
    <div
      className={cn(
        'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border bg-ink-850/95 pl-4 pr-3 py-3.5 shadow-lift backdrop-blur-xl',
        tone.ring,
      )}
    >
      <span className={cn('absolute inset-y-0 left-0 w-[2px]', tone.bar)} aria-hidden="true" />
      <div className="flex items-start gap-3">
        <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tone.accent)} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-bone">{message.title}</p>
          {message.description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-bone-dim">{message.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-1 text-bone-dim transition-colors hover:text-bone"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
