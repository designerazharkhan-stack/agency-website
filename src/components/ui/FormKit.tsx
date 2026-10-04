import { useRef, useState, type ReactNode } from 'react'
import { GripVertical, ImageIcon, Loader2, Plus, Trash2, Upload } from 'lucide-react'

import { Button } from './Button'
import { Input, Textarea } from './Field'
import { ICON_CHOICES, resolveIcon } from '@/lib/icons'
import { uploadImage, type UploadScope } from '@/lib/storage'
import { cn, initials, slugify } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  Image field                                                               */
/* -------------------------------------------------------------------------- */

export function ImageField({
  label,
  value,
  onChange,
  scope,
  hint,
  aspect = '16/9',
  className,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  scope: UploadScope
  hint?: string
  aspect?: string
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setBusy(true)
    setError(null)
    try {
      const uploaded = await uploadImage({ scope, file })
      onChange(uploaded.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      <span className="field-label">{label}</span>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className="group relative w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-900 sm:w-44"
          style={{ aspectRatio: aspect.replace('/', ' / ') }}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-bone-dim/60">
              <ImageIcon className="h-5 w-5" />
              <span className="text-[0.62rem] uppercase tracking-wide2">No image</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://images.example.com/photo.jpg"
            className="font-mono text-xs"
            aria-label={`${label} URL`}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              icon={busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            >
              {busy ? 'Uploading…' : 'Upload'}
            </Button>
            {value ? (
              <Button variant="quiet" size="sm" onClick={() => onChange('')}>
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-bone-dim">
            {error ? <span className="text-red-300">{error}</span> : (hint ?? 'Upload compresses to max 2200px, or paste a URL.')}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Tag input                                                                 */
/* -------------------------------------------------------------------------- */

export function TagInput({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
  hint,
}: {
  label: string
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  hint?: string
}) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const cleaned = slugify(draft)
    if (!cleaned) {
      setDraft('')
      return
    }
    if (!value.includes(cleaned)) onChange([...value, cleaned])
    setDraft('')
  }

  return (
    <div className="space-y-2">
      <span className="field-label">{label}</span>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              commit()
            }
            if (event.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1))
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button variant="ghost" onClick={commit} icon={<Plus className="h-4 w-4" />} aria-label={`Add ${label}`} />
      </div>

      {value.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li key={tag} className="chip-gold">
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== tag))}
                className="ml-1 text-gold-400 transition-colors hover:text-gold-100"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {hint ? <p className="text-xs text-bone-dim">{hint}</p> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  String list (features, deliverables…)                                     */
/* -------------------------------------------------------------------------- */

export function StringListField({
  label,
  value,
  onChange,
  placeholder = 'List item',
  hint,
  addLabel = 'Add item',
  minRows = 3,
}: {
  label: string
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  hint?: string
  addLabel?: string
  minRows?: number
}) {
  const update = (index: number, next: string) => {
    const copy = [...value]
    copy[index] = next
    onChange(copy)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="field-label mb-0">{label}</span>
        <span className="text-[0.65rem] text-bone-dim">{value.length} items</span>
      </div>

      <ul className="space-y-2">
        {value.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <GripVertical className="h-3.5 w-3.5 shrink-0 text-white/15" aria-hidden="true" />
            <Input
              value={item}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              variant="quiet"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`Remove item ${index + 1}`}
              className="!px-2 text-bone-dim hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>

      {value.length < minRows ? (
        <Button variant="ghost" size="sm" onClick={() => onChange([...value, ''])} icon={<Plus className="h-3.5 w-3.5" />}>
          {addLabel}
        </Button>
      ) : null}
      {hint ? <p className="text-xs text-bone-dim">{hint}</p> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Repeater for object arrays (metrics, gallery, meta, stats)                */
/* -------------------------------------------------------------------------- */

export interface RepeaterFieldSpec {
  key: string
  label: string
  placeholder?: string
  type?: 'text' | 'textarea' | 'image'
  scope?: UploadScope
}

export function RepeaterField<T extends { id: string }>({
  label,
  value,
  onChange,
  fields,
  addLabel = 'Add entry',
  create,
  max,
  emptyHint,
}: {
  label: string
  value: T[]
  onChange: (next: T[]) => void
  fields: RepeaterFieldSpec[]
  addLabel?: string
  create: () => T
  max?: number
  emptyHint?: string
}) {
  const update = (index: number, patch: Partial<T>) => {
    const copy = [...value]
    copy[index] = { ...copy[index], ...patch }
    onChange(copy)
  }
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const copy = [...value]
    const [item] = copy.splice(index, 1)
    copy.splice(target, 0, item)
    onChange(copy)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="field-label mb-0">{label}</span>
        <span className="text-[0.65rem] text-bone-dim">
          {value.length}
          {max ? ` / ${max}` : ''}
        </span>
      </div>

      <ul className="space-y-3">
        {value.map((item, index) => (
          <li key={item.id} className="rounded-xl border border-white/[0.07] bg-white/[0.012] p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[0.65rem] uppercase tracking-wide2 text-bone-dim">
                {String((item as unknown as Record<string, unknown>)[fields[0]?.key ?? 'id'] ?? '') ||
                  `Entry ${index + 1}`}
              </span>
              <div className="flex items-center gap-0.5">
                <Button variant="quiet" className="!px-2 !py-1 text-bone-dim" onClick={() => move(index, -1)} aria-label="Move up">
                  ↑
                </Button>
                <Button
                  variant="quiet"
                  className="!px-2 !py-1 text-bone-dim"
                  onClick={() => move(index, 1)}
                  aria-label="Move down"
                >
                  ↓
                </Button>
                <Button
                  variant="quiet"
                  className="!px-2 !py-1 text-bone-dim hover:text-red-300"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  aria-label="Remove entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => {
                const current = String((item as unknown as Record<string, unknown>)[field.key] ?? '')
                const input = (
                  <Input
                    key={field.key}
                    value={current}
                    onChange={(event) => update(index, { [field.key]: event.target.value } as Partial<T>)}
                    placeholder={field.placeholder}
                    className="text-sm"
                  />
                )
                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="sm:col-span-2">
                      <Textarea
                        value={current}
                        onChange={(event) => update(index, { [field.key]: event.target.value } as Partial<T>)}
                        placeholder={field.placeholder}
                        rows={3}
                      />
                    </div>
                  )
                }
                if (field.type === 'image' && field.scope) {
                  return (
                    <div key={field.key} className="sm:col-span-2">
                      <ImageField
                        label={field.label}
                        value={current}
                        scope={field.scope}
                        onChange={(next) => update(index, { [field.key]: next } as Partial<T>)}
                        aspect="16/9"
                      />
                    </div>
                  )
                }
                return <div key={field.key}>{input}</div>
              })}
            </div>
          </li>
        ))}
      </ul>

      {(!max || value.length < max) && (
        <Button variant="ghost" size="sm" onClick={() => onChange([...value, create()])} icon={<Plus className="h-3.5 w-3.5" />}>
          {addLabel}
        </Button>
      )}
      {emptyHint && value.length === 0 ? <p className="text-xs text-bone-dim">{emptyHint}</p> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Icon picker                                                               */
/* -------------------------------------------------------------------------- */

export function IconPicker({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <span className="field-label">{label}</span>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
        {ICON_CHOICES.map((key) => {
          const Icon = resolveIcon(key)
          const active = key === value
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={key}
              aria-label={key}
              aria-pressed={active}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg border transition-all duration-300',
                active
                  ? 'border-gold-500/60 bg-gold-500/15 text-gold-100'
                  : 'border-white/[0.07] bg-white/[0.015] text-bone-dim hover:border-gold-500/30 hover:text-gold-200',
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>
      {hint ? <p className="text-xs text-bone-dim">{hint}</p> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Slug field with live preview                                              */
/* -------------------------------------------------------------------------- */

export function SlugField({
  value,
  onChange,
  previewBase = '',
}: {
  value: string
  onChange: (next: string) => void
  previewBase?: string
}) {
  return (
    <Input
      label="URL slug"
      value={value}
      onChange={(event) => onChange(slugify(event.target.value))}
      hint={previewBase ? `Renders as ${previewBase}/${value || '…'}` : undefined}
      className="font-mono text-xs"
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Avatar preview                                                            */
/* -------------------------------------------------------------------------- */

export function AvatarPreview({
  url,
  name,
  size = 56,
}: {
  url?: string
  name: string
  size?: number
}) {
  return url ? (
    <img
      src={url}
      alt={name}
      className="shrink-0 rounded-full border border-gold-500/25 object-cover"
      style={{ width: size, height: size }}
      loading="lazy"
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border border-gold-500/25 bg-gold-500/10 font-display text-gold-200"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  Form section wrapper                                                       */
/* -------------------------------------------------------------------------- */

export function FormCard({
  title,
  description,
  children,
  actions,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('panel p-5 sm:p-7', className)}>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div>
          <h3 className="font-display text-2xl font-light text-bone">{title}</h3>
          {description ? <p className="mt-1 text-sm text-bone-dim">{description}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </section>
  )
}
