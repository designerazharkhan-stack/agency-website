import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react'

import { ProjectCard } from '@/components/cards'
import { PageHero, PageSection } from '@/components/layout/PageHero'
import { Container, EmptyState } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getProjects } from '@/lib/content'
import { useSeo } from '@/lib/seo'
import { cn, seededShuffle } from '@/lib/utils'

type FilterMode = 'all' | 'featured'

export default function PortfolioPage() {
  const site = useSiteContent()
  useReveal()

  const [category, setCategory] = useState('All')
  const [mode, setMode] = useState<FilterMode>('all')

  const { data, loading } = useAsync(() => getProjects(), [])

  const projects = data ?? []

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((project) => project.category))).sort()
    return ['All', ...unique]
  }, [projects])

  const filtered = useMemo(() => {
    let list = projects
    if (category !== 'All') list = list.filter((project) => project.category === category)
    if (mode === 'featured') list = list.filter((project) => project.featured)
    if (mode === 'all') return list
    return seededShuffle(list, category, list.length)
  }, [projects, category, mode])

  useSeo({
    title: 'Portfolio',
    description:
      'Selected brand, digital product and website engagements — with the numbers each one moved, and the constraint that made it difficult.',
    path: '/portfolio',
    site: site.seo,
  })

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="The work, with"
        accent="the receipts"
        description="Every case study includes the problem as we understood it, the constraint we did not choose, and what the numbers did afterwards. No client names withheld without a very good reason."
      />

      {/* Filters */}
      <div className="sticky top-[var(--nav-h)] z-40 border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-xl">
        <Container className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    'shrink-0 snap-start rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-wide2 transition-all duration-400',
                    category === item
                      ? 'border-gold-500/50 bg-gold-500/10 text-gold-100'
                      : 'border-white/10 bg-white/[0.02] text-bone-dim hover:border-white/25 hover:text-bone',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <Button
              variant="quiet"
              className="shrink-0 self-start !px-0 text-bone-dim sm:self-auto"
              onClick={() => setMode((current) => (current === 'all' ? 'featured' : 'all'))}
              icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
            >
              {mode === 'all' ? 'Show featured only' : 'Show everything'}
            </Button>
          </div>
        </Container>
      </div>

      <PageSection>
        <Container>
          {loading && !projects.length ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-2xl border border-white/[0.05] bg-ink-850/50"
                />
              ))}
            </div>
          ) : filtered.length ? (
            <>
              <p className="mb-8 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
                {filtered.length} project{filtered.length === 1 ? '' : 's'}
                {category !== 'All' ? ` in ${category}` : ''}
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    size={index % 5 === 0 ? 'wide' : 'default'}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Nothing in this category yet"
              description="Try another filter, or ask us directly — the archive goes back to 2014 and we are happy to walk you through it."
              action={
                <Button variant="ghost" onClick={() => setCategory('All')} iconRight={<ArrowUpRight className="h-4 w-4" />}>
                  Clear filters
                </Button>
              }
            />
          )}
        </Container>
      </PageSection>

      {/* Not found nudge */}
      <PageSection tight className="border-t border-white/[0.06] bg-ink-900/40">
        <Container>
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="font-display text-3xl font-light text-bone">
              Looking for something specific?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-bone-muted">
              A significant amount of our work cannot be shown publicly — NDA, or simply because the client
              would prefer it stayed quiet. If the brief matches something you need, ask and we will tell you
              honestly whether we have done it.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-gold-300 transition-colors hover:text-gold-100"
            >
              Ask us directly
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Container>
      </PageSection>
    </>
  )
}
