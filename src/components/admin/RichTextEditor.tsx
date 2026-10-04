import { useRef, useState } from 'react'
import { Eye, Heading2, Heading3, Italic, Link2, List, ListOrdered, Pencil, Quote, Bold, Code } from 'lucide-react'

import { Markdown } from '@/lib/markdown'
import { cn, estimateReadMinutes } from '@/lib/utils'

type Wrap = 'bold' | 'italic' | 'code'

interface Tool {
  label: string
  icon: typeof Bold
  apply: (selected: string) => string | null
}

const TOOLS: Tool[] = [
  { label: 'Bold', icon: Bold, apply: (s) => (s ? `**${s}**` : null) },
  { label: 'Italic', icon: Italic, apply: (s) => (s ? `_${s}_` : null) },
  { label: 'Inline code', icon: Code, apply: (s) => (s ? `\`${s}\`` : null) },
  { label: 'Link', icon: Link2, apply: (s) => `[${s || 'link text'}](https://)` },
  { label: 'Quote', icon: Quote, apply: (s) => `> ${s || 'Quoted line'}` },
  { label: 'Bulleted list', icon: List, apply: (s) => `- ${s || 'List item'}` },
  { label: 'Numbered list', icon: ListOrdered, apply: (s) => `1. ${s || 'List item'}` },
  { label: 'Heading 2', icon: Heading2, apply: () => '\n## Section heading\n' },
  { label: 'Heading 3', icon: Heading3, apply: () => '\n### Subheading\n' },
]

/**
 * Markdown editor — deliberately dependency-free.
 *
 * The site already renders Markdown through a hardened subset renderer
 * (`@/lib/markdown`), so the admin writes the same syntax the public article
 * page consumes: no HTML is ever injected, which removes the stored-XSS class
 * of bug entirely. A live preview uses that exact renderer, so what an editor
 * sees is what a visitor gets.
 */
export function RichTextEditor({
  label = 'Content',
  value,
  onChange,
  rows = 18,
  hint,
  className,
}: {
  label?: string
  value: string
  onChange: (next: string) => void
  rows?: number
  hint?: string
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  const applyTool = (tool: Tool, kind?: Wrap) => {
    const node = textareaRef.current
    if (!node) return
    const start = node.selectionStart
    const end = node.selectionEnd
    const selected = value.slice(start, end)

    let next: string
    let caret: number

    if (kind === 'bold' || kind === 'italic' || kind === 'code') {
      const marker = kind === 'bold' ? '**' : kind === 'italic' ? '_' : '`'
      next = `${value.slice(0, start)}${marker}${selected}${marker}${value.slice(end)}`
      caret = start + marker.length + selected.length + marker.length
    } else {
      const fragment = tool.apply(selected)
      if (fragment === null) return
      next = `${value.slice(0, start)}${fragment}${value.slice(end)}`
      caret = start + fragment.length
    }

    onChange(next)
    window.requestAnimationFrame(() => {
      node.focus()
      node.setSelectionRange(caret, caret)
    })
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="field-label mb-0">{label}</span>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
          {(['write', 'preview'] as const).map((value_) => (
            <button
              key={value_}
              type="button"
              onClick={() => setTab(value_)}
              aria-pressed={tab === value_}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-wide2 transition-colors',
                tab === value_
                  ? 'bg-gold-500/15 text-gold-200'
                  : 'text-bone-dim hover:text-bone-muted',
              )}
            >
              {value_ === 'write' ? (
                <Pencil className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Eye className="h-3 w-3" aria-hidden="true" />
              )}
              {value_ === 'write' ? 'Write' : 'Preview'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <>
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-ink-900/80 p-1.5">
            {TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => applyTool(tool)}
                  title={tool.label}
                  aria-label={tool.label}
                  className="rounded-lg p-2 text-bone-dim transition-colors hover:bg-white/[0.05] hover:text-gold-200"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              )
            })}
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            rows={rows}
            onChange={(event) => onChange(event.target.value)}
            placeholder={'Write in Markdown.\n\n## Section heading\n\n- Bullet point\n- Another point\n\n**Bold** and _italic_ work too.'}
            aria-label={label}
            className="field resize-y font-mono text-[0.82rem] leading-relaxed"
          />
        </>
      ) : (
        <div className="min-h-[18rem] rounded-xl border border-white/10 bg-ink-900/60 p-5">
          {value.trim() ? (
            <Markdown content={value} className="prose-luxe" />
          ) : (
            <p className="text-sm text-bone-dim">Nothing to preview yet — switch back to Write and start typing.</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-bone-dim">
        <span>{hint ?? 'Markdown supported: headings, lists, quotes, links, bold, code.'}</span>
        <span className="font-mono">
          {value.trim() ? `${value.trim().split(/\s+/).length} words · ~${estimateReadMinutes(value)} min read` : '0 words'}
        </span>
      </div>
    </div>
  )
}
