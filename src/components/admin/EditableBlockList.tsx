import { useEffect, useState, type ReactNode } from 'react'
import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { LoadingState } from './States'
import { cn } from '@/lib/utils'

export interface EditableBlockListProps<T extends { id: string }> {
  items: T[]
  loading?: boolean
  saving?: boolean
  create: () => T
  onSave: (items: T[]) => Promise<void>
  renderItem: (props: {
    item: T
    index: number
    update: (patch: Partial<T>) => void
    remove: () => void
    move: (direction: -1 | 1) => void
    isFirst: boolean
    isLast: boolean
  }) => ReactNode
  label?: string
  addLabel: string
  emptyHint?: string
  className?: string
}

/**
 * Draft-based editor for the ordered homepage/about blocks.
 *
 * Edits stay local until “Save changes” is pressed, so a Firestore write never
 * happens per keystroke. Live snapshots still stream in, but they are ignored
 * while there are unsaved edits so the form cannot jump under the cursor.
 */
export function EditableBlockList<T extends { id: string }>({
  items,
  loading,
  saving,
  create,
  onSave,
  renderItem,
  label,
  addLabel,
  emptyHint,
  className,
}: EditableBlockListProps<T>) {
  const [draft, setDraft] = useState<T[]>(items)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!dirty) setDraft(items)
  }, [items, dirty])

  const update = (index: number, patch: Partial<T>) => {
    setDraft((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    )
    setDirty(true)
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= draft.length) return
    setDraft((current) => {
      const copy = [...current]
      const [item] = copy.splice(index, 1)
      copy.splice(target, 0, item)
      return copy
    })
    setDirty(true)
  }

  const remove = (index: number) => {
    setDraft((current) => current.filter((_, i) => i !== index))
    setDirty(true)
  }

  const handleSave = async () => {
    setError(null)
    try {
      await onSave(draft)
      setDirty(false)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save these entries.')
    }
  }

  if (loading) return <LoadingState label="Loading entries" rows={3} />

  return (
    <div className={cn('space-y-4', className)}>
      {label ? <p className="field-label mb-0">{label}</p> : null}
      {error ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </p>
      ) : null}

      <ul className="space-y-3">
        {draft.map((item, index) => (
          <li key={item.id} className="rounded-xl border border-white/[0.07] bg-white/[0.012] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[0.62rem] uppercase tracking-wide2 text-bone-dim">
                {String((item as unknown as Record<string, unknown>).title ??
                  (item as unknown as Record<string, unknown>).label ??
                  (item as unknown as Record<string, unknown>).value ??
                  (item as unknown as Record<string, unknown>).name ??
                  `Entry ${index + 1}`)}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="quiet"
                  className="!px-2 !py-1 text-bone-dim"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  ↑
                </Button>
                <Button
                  variant="quiet"
                  className="!px-2 !py-1 text-bone-dim"
                  onClick={() => move(index, 1)}
                  disabled={index === draft.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </Button>
                <Button
                  variant="quiet"
                  className="!px-2 !py-1 text-bone-dim hover:text-red-300"
                  onClick={() => remove(index)}
                  aria-label="Remove entry"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {renderItem({
              item,
              index,
              update: (patch) => update(index, patch),
              remove: () => remove(index),
              move: (direction) => move(index, direction),
              isFirst: index === 0,
              isLast: index === draft.length - 1,
            })}
          </li>
        ))}
      </ul>

      {draft.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-xs text-bone-dim">
          {emptyHint ?? 'Nothing here yet.'}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDraft((current) => [...current, create()])
            setDirty(true)
          }}
          icon={<Plus className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          {addLabel}
        </Button>

        <div className="flex items-center gap-2">
          {dirty ? (
            <>
              <Button variant="quiet" onClick={() => { setDraft(items); setDirty(false) }} icon={<RotateCcw className="h-4 w-4" />}>
                Discard
              </Button>
              <Button onClick={() => void handleSave()} loading={saving} icon={<Save className="h-4 w-4" />}>
                Save changes
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
