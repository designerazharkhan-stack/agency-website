/**
 * A deliberately small Markdown renderer that produces React elements rather
 * than an HTML string.
 *
 * Rendering to React nodes means user-authored CMS content can never inject
 * markup or script — there is no `dangerouslySetInnerHTML` anywhere in the
 * pipeline. Supported: ATX headings, paragraphs, bold, italic, inline code,
 * links, images, unordered/ordered lists, blockquotes, rules and code fences.
 */

import { Fragment, type ReactNode } from 'react'
import { safeHref } from './utils'

type Block =
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; lines: string[] }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language: string; code: string }
  | { type: 'rule' }

const HEADING_RE = /^(#{1,6})\s+(.*)$/
const RULE_RE = /^(?:-{3,}|\*{3,}|_{3,})$/
const UNORDERED_RE = /^[-*+]\s+(.*)$/
const ORDERED_RE = /^\d+[.)]\s+(.*)$/
const QUOTE_RE = /^>\s?(.*)$/
const FENCE_RE = /^```(\w*)\s*$/

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []

  let paragraph: string[] = []
  let quote: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let code: { language: string; lines: string[] } | null = null

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() })
      paragraph = []
    }
  }
  const flushQuote = () => {
    if (quote.length) {
      blocks.push({ type: 'quote', lines: quote })
      quote = []
    }
  }
  const flushList = () => {
    if (list) {
      blocks.push({ type: 'list', ordered: list.ordered, items: list.items })
      list = null
    }
  }
  const flushCode = () => {
    if (code) {
      blocks.push({ type: 'code', language: code.language, code: code.lines.join('\n') })
      code = null
    }
  }
  const flushAll = () => {
    flushParagraph()
    flushQuote()
    flushList()
    flushCode()
  }

  for (const line of lines) {
    if (code) {
      if (FENCE_RE.test(line.trim())) flushCode()
      else code.lines.push(line)
      continue
    }

    const trimmed = line.trim()

    if (!trimmed) {
      flushAll()
      continue
    }

    const fence = FENCE_RE.exec(trimmed)
    if (fence) {
      flushAll()
      code = { language: fence[1] ?? '', lines: [] }
      continue
    }

    if (RULE_RE.test(trimmed)) {
      flushAll()
      blocks.push({ type: 'rule' })
      continue
    }

    const heading = HEADING_RE.exec(trimmed)
    if (heading) {
      flushAll()
      const level = Math.min(4, Math.max(2, heading[1].length)) as 2 | 3 | 4
      blocks.push({ type: 'heading', level, text: heading[2].trim() })
      continue
    }

    const quoteMatch = QUOTE_RE.exec(trimmed)
    if (quoteMatch) {
      flushParagraph()
      flushList()
      quote.push(quoteMatch[1])
      continue
    }

    const unordered = UNORDERED_RE.exec(trimmed)
    const ordered = ORDERED_RE.exec(trimmed)
    if (unordered || ordered) {
      flushParagraph()
      flushQuote()
      const isOrdered = Boolean(ordered)
      if (!list || list.ordered !== isOrdered) {
        flushList()
        list = { ordered: isOrdered, items: [] }
      }
      list.items.push((unordered ? unordered[1] : ordered![1]).trim())
      continue
    }

    // Plain text line — accumulate into the current paragraph.
    flushQuote()
    flushList()
    paragraph.push(trimmed)
  }

  flushAll()
  return blocks
}

const INLINE_RE =
  /(!?\[([^\]]*)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)|(`([^`]+)`)/

/** Inline markdown → React nodes, recursion-safe on nested emphasis. */
export function renderInline(source: string, keyPrefix = 'i'): ReactNode[] {
  const nodes: ReactNode[] = []
  let remaining = source
  let index = 0
  let key = 0

  while (remaining.length > 0) {
    const match = INLINE_RE.exec(remaining)
    if (!match || match.index === undefined) {
      nodes.push(remaining)
      break
    }

    if (match.index > 0) nodes.push(remaining.slice(0, match.index))

    const [full, , linkText, linkHref, , boldText, , , italicText, , , , codeText] = match
    const id = `${keyPrefix}-${key++}`

    if (full.startsWith('!')) {
      nodes.push(
        <img
          key={id}
          src={safeHref(linkHref)}
          alt={linkText ?? ''}
          loading="lazy"
          decoding="async"
          className="w-full rounded-xl border border-white/10"
        />,
      )
    } else if (full.startsWith('[')) {
      const external = /^https?:\/\//i.test(linkHref ?? '')
      nodes.push(
        <a
          key={id}
          href={safeHref(linkHref)}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {linkText}
        </a>,
      )
    } else if (boldText) {
      nodes.push(<strong key={id}>{renderInline(boldText, id)}</strong>)
    } else if (italicText) {
      nodes.push(<em key={id}>{renderInline(italicText, id)}</em>)
    } else if (codeText) {
      nodes.push(<code key={id}>{codeText}</code>)
    }

    remaining = remaining.slice(match.index + full.length)
    index += full.length
  }

  void index
  return nodes
}

/** Strip markdown syntax for meta descriptions and search indexing. */
export function markdownToPlainText(source: string, maxLength = 200): string {
  const text = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`
}

export interface MarkdownProps {
  content: string
  className?: string
}

/** Render a Markdown string as styled React content. */
export function Markdown({ content, className }: MarkdownProps) {
  const blocks = parseMarkdown(content ?? '')

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const key = `b-${i}`
        switch (block.type) {
          case 'heading': {
            if (block.level === 2) return <h2 key={key}>{renderInline(block.text, key)}</h2>
            if (block.level === 3) return <h3 key={key}>{renderInline(block.text, key)}</h3>
            return <h4 key={key}>{renderInline(block.text, key)}</h4>
          }
          case 'quote':
            return (
              <blockquote key={key}>
                {block.lines.map((line, li) => (
                  <Fragment key={`${key}-${li}`}>
                    {li > 0 ? ' ' : null}
                    {renderInline(line, `${key}-${li}`)}
                  </Fragment>
                ))}
              </blockquote>
            )
          case 'list': {
            const items = block.items.map((item, li) => (
              <li key={`${key}-${li}`}>{renderInline(item, `${key}-${li}`)}</li>
            ))
            return block.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>
          }
          case 'code':
            return (
              <pre key={key} data-language={block.language || undefined}>
                <code>{block.code}</code>
              </pre>
            )
          case 'rule':
            return <hr key={key} />
          default:
            return <p key={key}>{renderInline(block.text, key)}</p>
        }
      })}
    </div>
  )
}
