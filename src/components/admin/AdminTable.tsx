import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AdminColumn<T> {
  key: string
  header: ReactNode
  /** Cell renderer. Falls back to `String(row[key])` when omitted. */
  render?: (row: T) => ReactNode
  className?: string
  headerClassName?: string
  /** Hidden on small screens to keep cards readable on phones. */
  hideOnMobile?: boolean
  width?: string
}

export interface AdminTableProps<T> {
  columns: Array<AdminColumn<T>>
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  empty?: ReactNode
  caption?: string
  className?: string
}

/**
 * Responsive table: a real `<table>` on tablet and desktop, stacked definition
 * cards on phones. Row actions stay reachable by keyboard either way.
 */
export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  caption,
  className,
}: AdminTableProps<T>) {
  if (!rows.length && empty) return <>{empty}</>

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850/60',
        className,
      )}
    >
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/[0.02]">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  'px-5 py-3.5 text-[0.65rem] font-medium uppercase tracking-wide2 text-bone-dim',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-white/[0.045] transition-colors last:border-0',
                onRowClick && 'cursor-pointer hover:bg-white/[0.025]',
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-5 py-4 align-middle text-bone-muted', column.className)}
                >
                  {column.render
                    ? column.render(row)
                    : String((row as unknown as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards keep every column readable without horizontal scrolling. */}
      <ul className="divide-y divide-white/[0.05] md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="p-4">
            <dl className="space-y-2.5">
              {columns.map((column, index) => {
                if (column.hideOnMobile) return null
                return (
                  <div
                    key={column.key}
                    className={cn(
                      'flex flex-col gap-1',
                      index === 0 && 'border-b border-white/[0.05] pb-2.5',
                    )}
                  >
                    <dt className="text-[0.6rem] uppercase tracking-wide2 text-bone-dim">{column.header}</dt>
                    <dd className="text-sm text-bone-muted">
                      {column.render
                        ? column.render(row)
                        : String((row as unknown as Record<string, unknown>)[column.key] ?? '')}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
