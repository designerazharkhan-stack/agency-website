import {
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from 'react'

import { cn } from '@/lib/utils'
import type { FieldErrors } from '@/lib/validators'

interface FieldShellProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
  htmlFor?: string
  actions?: ReactNode
}

export function FieldShell({
  label,
  hint,
  error,
  required,
  className,
  children,
  htmlFor,
  actions,
}: FieldShellProps) {
  return (
    <div className={cn('w-full', className)}>
      {label || actions ? (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label ? (
            <label className="field-label mb-0" htmlFor={htmlFor}>
              {label}
              {required ? <span className="ml-1 text-gold-400">*</span> : null}
            </label>
          ) : (
            <span />
          )}
          {actions}
        </div>
      ) : null}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-300">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-bone-dim">{hint}</p>
      ) : null}
    </div>
  )
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string
  hint?: string
  error?: string
  className?: string
  wrapperClassName?: string
  prefix?: ReactNode
  actions?: ReactNode
}

export function Input({
  label,
  hint,
  error,
  className,
  wrapperClassName,
  prefix,
  actions,
  required,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
      htmlFor={inputId}
      actions={actions}
    >
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bone-dim">{prefix}</span>
        ) : null}
        <input
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn('field', prefix ? 'pl-9' : undefined, error ? 'field-err' : undefined, className)}
          {...rest}
        />
      </div>
    </FieldShell>
  )
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  wrapperClassName?: string
  className?: string
}

export function Textarea({
  label,
  hint,
  error,
  className,
  wrapperClassName,
  required,
  id,
  rows = 4,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
      htmlFor={inputId}
    >
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn('field resize-y leading-relaxed', error && 'field-err', className)}
        {...rest}
      />
    </FieldShell>
  )
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  options: Array<{ value: string; label: string }>
  wrapperClassName?: string
  className?: string
}

export function Select({
  label,
  hint,
  error,
  options,
  className,
  wrapperClassName,
  required,
  id,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
      htmlFor={inputId}
    >
      <select
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn('field cursor-pointer pr-8', error && 'field-err', className)}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink-850 text-bone">
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  id?: string
}) {
  const generatedId = useId()
  const switchId = id ?? generatedId

  return (
    <label
      htmlFor={switchId}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.015] p-3.5 transition-colors',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-gold-500/25',
      )}
    >
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          className={cn(
            'block h-5 w-9 rounded-full border transition-all duration-300',
            checked ? 'border-gold-500/60 bg-gold-500/40' : 'border-white/15 bg-white/[0.06]',
          )}
        />
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-all duration-300 ease-luxe',
            checked ? 'translate-x-4 bg-gold-200 shadow-gold-glow-sm' : 'translate-x-0 bg-bone-dim',
          )}
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-bone">{label}</span>
        {description ? <span className="text-xs leading-relaxed text-bone-dim">{description}</span> : null}
      </span>
    </label>
  )
}

export function Checkbox({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 text-sm text-bone-muted', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-ink-900 text-gold-500 focus:ring-gold-500/40 focus:ring-offset-0"
      />
      {label}
    </label>
  )
}

/** Read-only value display for generated ids and paths. */
export function ReadOnlyValue({ value, mono = true }: { value: string; mono?: boolean }) {
  return (
    <code
      className={cn(
        'block truncate rounded-lg border border-white/[0.07] bg-ink-900/70 px-3 py-2 text-xs text-bone-dim',
        mono && 'font-mono',
      )}
    >
      {value}
    </code>
  )
}

export type { FieldErrors }
