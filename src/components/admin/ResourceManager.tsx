import { useMemo, useState, type ReactNode } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input, Switch } from '@/components/ui/Field'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Section'
import { AdminTable, type AdminColumn } from './AdminTable'
import { EmptyState, ErrorState, LoadingState } from './States'
import type { AdminCollectionState } from '@/hooks/useAdminCollection'
import type { WritableCollection } from '@/lib/content'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'published' | 'drafts'

export interface ResourceManagerProps<T extends { id: string; published?: boolean }> {
  collection: WritableCollection
  singular: string
  /** e.g. "No services yet — add the first one to publish it on /services." */
  emptyTitle: string
  emptyDescription: string
  state: AdminCollectionState<T>
  columns: Array<AdminColumn<T>>
  rowKey: (row: T) => string
  createBlank: () => T
  renderForm: (props: { item: T; update: (patch: Partial<T>) => void }) => ReactNode
  /** Values joined for the search box. */
  searchText?: (item: T) => string
  /** Extra filter chips, e.g. portfolio categories or blog categories. */
  filters?: Array<{ label: string; value: string; match: (item: T) => boolean }>
  onSave: (item: T, id?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onTogglePublished: (id: string, next: boolean) => Promise<void>
  addLabel?: string
  modalSize?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Shared CRUD surface used by Services, Portfolio, Blog, Testimonials and
 * Pricing. Each section supplies its own fields and columns; list handling,
 * search, status filters, the edit modal, publish toggles, delete confirmation
 * and error handling are identical everywhere and therefore implemented once.
 */
export function ResourceManager<T extends { id: string; published?: boolean }>({
  collection,
  singular,
  emptyTitle,
  emptyDescription,
  state,
  columns,
  rowKey,
  createBlank,
  renderForm,
  searchText,
  filters,
  onSave,
  onDelete,
  onTogglePublished,
  addLabel,
  modalSize = 'lg',
}: ResourceManagerProps<T>) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [filter, setFilter] = useState<string>('all')
  const [editing, setEditing] = useState<T | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<T | null>(null)
  const [busyRow, setBusyRow] = useState<string | null>(null)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.items.filter((item) => {
      if (status === 'published' && item.published !== true) return false
      if (status === 'drafts' && item.published === true) return false
      if (filter !== 'all') {
        const match = filters?.find((entry) => entry.value === filter)?.match
        if (match && !match(item)) return false
      }
      if (!needle) return true
      return searchText ? searchText(item).toLowerCase().includes(needle) : true
    })
  }, [state.items, query, status, filter, filters, searchText])

  const startCreate = () => {
    setEditing(createBlank())
    setCreating(true)
    setError(null)
  }

  const startEdit = (item: T) => {
    setEditing({ ...item })
    setCreating(false)
    setError(null)
  }

  const closeModal = () => {
    setEditing(null)
    setCreating(false)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    setError(null)
    try {
      await onSave(editing, creating ? undefined : editing.id)
      closeModal()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setSaving(true)
    try {
      await onDelete(pendingDelete.id)
      setPendingDelete(null)
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (item: T) => {
    setBusyRow(item.id)
    try {
      await onTogglePublished(item.id, item.published !== true)
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not change the status.')
    } finally {
      setBusyRow(null)
    }
  }

  const tableColumns: Array<AdminColumn<T>> = [
    ...columns,
    {
      key: 'status',
      header: 'Status',
      width: '11rem',
      render: (row) => (
        <div onClick={(event) => event.stopPropagation()}>
          <Switch
            checked={row.published === true}
            onChange={() => void handleToggle(row)}
            label={row.published === true ? 'Live' : 'Draft'}
            description={row.published === true ? 'Visible to visitors' : 'Hidden from visitors'}
            disabled={busyRow === row.id}
            id={`publish-${row.id}`}
          />
        </div>
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      width: '8.5rem',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={() => startEdit(row)}
            className="btn-quiet !p-2 text-bone-dim hover:text-gold-200"
            aria-label={`Edit ${singular}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(row)}
            className="btn-quiet !p-2 text-bone-dim hover:text-red-300"
            aria-label={`Delete ${singular}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-dim"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${collection}…`}
              aria-label={`Search ${collection}`}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'published', 'drafts'] as StatusFilter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                aria-pressed={status === value}
                className={cn(
                  'chip whitespace-nowrap transition-colors duration-300',
                  status === value && 'border-gold-500/50 bg-gold-500/10 text-gold-200',
                )}
              >
                {value === 'all' ? 'All' : value === 'published' ? 'Published' : 'Drafts'}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={startCreate} icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
          {addLabel ?? `Add ${singular}`}
        </Button>
      </div>

      {filters && filters.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={cn('chip', filter === 'all' && 'border-gold-500/50 bg-gold-500/10 text-gold-200')}
          >
            All categories
          </button>
          {filters.map((entry) => (
            <button
              key={entry.value}
              type="button"
              onClick={() => setFilter(entry.value)}
              aria-pressed={filter === entry.value}
              className={cn('chip', filter === entry.value && 'border-gold-500/50 bg-gold-500/10 text-gold-200')}
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <ErrorState title="Action failed" message={error} /> : null}

      {state.loading ? (
        <LoadingState label={`Loading ${collection}`} />
      ) : state.error ? (
        <ErrorState message={state.error} onRetry={state.reload} />
      ) : state.items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            <Button onClick={startCreate} icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
              {addLabel ?? `Add ${singular}`}
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-xs text-bone-dim">
            <Badge tone={state.source === 'firebase' ? 'success' : 'gold'}>
              {state.source === 'firebase' ? 'Live from Firestore' : 'Demo content'}
            </Badge>
            <span>
              Showing {visible.length} of {state.items.length} {collection}
            </span>
          </div>

          <AdminTable
            columns={tableColumns}
            rows={visible}
            rowKey={rowKey}
            onRowClick={startEdit}
            caption={`Manage ${collection}`}
          />
        </>
      )}

      <Modal
        open={editing !== null}
        onClose={closeModal}
        title={creating ? `New ${singular}` : `Edit ${singular}`}
        description={creating ? 'It appears on the site as soon as you publish it.' : 'Changes go live immediately on save.'}
        size={modalSize}
        footer={
          <>
            <Button variant="outline-light" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} loading={saving}>
              {creating ? `Create ${singular}` : 'Save changes'}
            </Button>
          </>
        }
      >
        {editing ? (
          <div className="space-y-6">
            {error ? <ErrorState title="Could not save" message={error} /> : null}
            {renderForm({
              item: editing,
              update: (patch) => setEditing((current) => (current ? { ...current, ...patch } : current)),
            })}
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void handleDelete()}
        loading={saving}
        title={`Delete this ${singular}?`}
        description="This permanently removes the document from Firestore. Published pages that link to it will show the empty state. This cannot be undone."
        confirmLabel="Delete permanently"
      />
    </div>
  )
}
