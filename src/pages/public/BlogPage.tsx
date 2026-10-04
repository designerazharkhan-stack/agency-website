import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'

import { PostCard } from '@/components/cards'
import { PageHero, PageSection } from '@/components/layout/PageHero'
import { Container, EmptyState } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync, useDebounced } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getPosts } from '@/lib/content'
import { markdownToPlainText } from '@/lib/markdown'
import { useSeo } from '@/lib/seo'
import { cn, truncate } from '@/lib/utils'

export default function BlogPage() {
  const site = useSiteContent()
  useReveal()

  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const tag = searchParams.get('tag') ?? 'All'
  const debounced = useDebounced(query, 260)

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const { data, loading } = useAsync(() => getPosts(), [])

  useSeo({
    title: 'Journal',
    description:
      'Writing for people who have to make the decision: on brand strategy, performance, motion budgets, rebrand failure modes and how to choose a studio.',
    path: '/blog',
    site: site.seo,
  })

  const posts = data ?? []

  const tags = useMemo(() => {
    const all = new Set<string>()
    posts.forEach((post) => post.tags?.forEach((item) => all.add(item)))
    if (posts.some((post) => post.featured)) all.add('Featured')
    return ['All', 'Featured', ...Array.from(all).sort()]
  }, [posts])

  const filtered = useMemo(() => {
    let list = posts
    if (tag === 'Featured') list = list.filter((post) => post.featured)
    else if (tag !== 'All') list = list.filter((post) => post.tags?.includes(tag))

    const needle = debounced.trim().toLowerCase()
    if (needle) {
      list = list.filter((post) => {
        const haystack = `${post.title} ${post.excerpt} ${post.category} ${(post.tags ?? []).join(' ')} ${markdownToPlainText(post.content, 4000)}`
        return haystack.toLowerCase().includes(needle)
      })
    }
    return list
  }, [posts, tag, debounced])

  const [lead, ...rest] = filtered

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Written for the"
        accent="person deciding"
        description="No trend reports, no listicles. Everything here is an argument we have had with a client and eventually won."
      >
        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-dim"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setParam('q', event.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="field !py-3 pl-11 pr-10"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setParam('q', '')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-bone-dim transition-colors hover:text-bone"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </PageHero>

      {/* Tag filters */}
      {tags.length > 2 ? (
        <div className="border-b border-white/[0.06] bg-ink-900/30">
          <Container className="py-4">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
              {tags.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setParam('tag', item)}
                  className={cn(
                    'shrink-0 rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-wide2 transition-all duration-400',
                    tag === item
                      ? 'border-gold-500/50 bg-gold-500/10 text-gold-100'
                      : 'border-white/10 bg-white/[0.02] text-bone-dim hover:border-white/25 hover:text-bone',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      <PageSection>
        <Container>
          {loading && !posts.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/5] animate-pulse rounded-2xl border border-white/[0.05] bg-ink-850/50"
                />
              ))}
            </div>
          ) : filtered.length ? (
            <>
              <p className="mb-8 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
                {filtered.length} article{filtered.length === 1 ? '' : 's'}
                {tag !== 'All' ? ` tagged ${tag}` : ''}
                {debounced ? ` matching “${truncate(debounced, 30)}”` : ''}
              </p>

              {lead ? <PostCard post={lead} featured /> : null}

              {rest.length ? (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index + 1} />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              title="No articles match that"
              description="Try a broader search term, or clear the filters to see everything we have written."
              action={
                <Button
                  variant="ghost"
                  onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                >
                  Clear filters
                </Button>
              }
            />
          )}
        </Container>
      </PageSection>
    </>
  )
}
