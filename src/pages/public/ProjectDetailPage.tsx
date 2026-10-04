import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ExternalLink, Quote } from 'lucide-react'

import { TestimonialCard } from '@/components/cards'
import { Container, SectionHeading } from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getProjects } from '@/lib/content'
import { useSeo } from '@/lib/seo'
import { Markdown } from '@/lib/markdown'
import type { ProjectDoc } from '@/types/content'

export default function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const site = useSiteContent()
  useReveal()

  const { data, loading } = useAsync(() => getProjects(), [])

  const projects = data ?? []
  const project = projects.find((item) => item.slug === slug)

  const index = projects.findIndex((item) => item.slug === slug)
  const next = projects.length ? projects[(index + 1) % projects.length] : null

  useSeo({
    title: project?.seo?.title ?? project?.title ?? 'Project',
    description: project?.seo?.description ?? project?.excerpt ?? '',
    keywords: project?.seo?.keywords,
    ogImage: project?.coverImage,
    path: `/portfolio/${slug}`,
    type: 'article',
    overrides: project?.seo,
    site: site.seo,
  })

  if (loading && !project) {
    return (
      <Container className="py-32">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-16 w-full animate-pulse rounded bg-white/[0.06]" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-white/[0.06]" />
        </div>
      </Container>
    )
  }

  if (!project) return <Navigate to="/portfolio" replace />

  return (
    <article>
      <ProjectHero project={project} />

      <section className="relative border-b border-white/[0.06]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Narrative */}
            <div className="lg:col-span-7">
              <NarrativeBlock label="The challenge" content={project.challenge} index={0} />
              <NarrativeBlock label="Our approach" content={project.approach} index={1} />
              <NarrativeBlock label="The outcome" content={project.outcome} index={2} />

              {project.services?.length ? (
                <div className="reveal mt-14 border-t border-white/[0.07] pt-10">
                  <h3 className="text-[0.62rem] uppercase tracking-luxe text-gold-400">Disciplines used</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <li key={service} className="chip-gold">
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.liveUrl ? (
                <div className="reveal mt-8">
                  <LinkButton
                    to={project.liveUrl}
                    external
                    variant="ghost"
                    iconRight={<ExternalLink className="h-4 w-4" />}
                  >
                    Visit the live site
                  </LinkButton>
                </div>
              ) : null}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                {project.meta?.length ? (
                  <dl className="reveal divide-y divide-white/[0.06] border-y border-white/[0.06]">
                    {project.meta.map((item) => (
                      <div key={item.id} className="flex items-baseline justify-between gap-6 py-4">
                        <dt className="text-[0.66rem] uppercase tracking-wide2 text-bone-dim">{item.label}</dt>
                        <dd className="text-right text-sm text-bone">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {project.metrics?.length ? (
                  <div className="reveal panel-gold mt-8 p-7">
                    <h3 className="text-[0.62rem] uppercase tracking-luxe text-gold-400">Results</h3>
                    <dl className="mt-6 space-y-6">
                      {project.metrics.map((metric) => (
                        <div key={metric.id}>
                          <dd className="gold-text font-display text-4xl font-light leading-none">
                            {metric.value}
                          </dd>
                          <dt className="mt-2 text-[0.66rem] uppercase tracking-wide2 text-bone-dim">
                            {metric.label}
                          </dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      {project.gallery?.length ? (
        <section className="relative py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Behind it" title="The work," accent="in detail" />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {project.gallery.map((image, i) => (
                <figure
                  key={image.id}
                  className={cnReveal(i)}
                  style={i === 0 ? { gridColumn: 'span 2' } : undefined}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850">
                    <img
                      src={image.url}
                      alt={image.caption ?? `${project.title} — image ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full object-cover"
                    />
                  </div>
                  {image.caption ? (
                    <figcaption className="mt-3 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Client quote */}
      {project.testimonial ? (
        <section className="relative border-t border-white/[0.06] bg-ink-900/40 py-16 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <Quote className="h-8 w-8 text-gold-500/30" aria-hidden="true" strokeWidth={1} />
                <h2 className="mt-6 font-display text-3xl font-light text-bone">
                  What the client
                  <br />
                  said afterwards
                </h2>
              </div>
              <div className="lg:col-span-8">
                <TestimonialCard testimonial={project.testimonial} />
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Next project */}
      {next && next.slug !== project.slug ? (
        <section className="border-t border-white/[0.06]">
          <Link to={`/portfolio/${next.slug}`} className="group block">
            <Container className="group py-16 sm:py-20">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-luxe text-gold-400">Next project</p>
                  <h2 className="display mt-4 text-display-sm transition-colors duration-500 group-hover:text-gold-100">
                    {next.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone-muted">{next.excerpt}</p>
                </div>
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-200 transition-all duration-700 ease-luxe group-hover:border-gold-400 group-hover:bg-gold-500/10">
                  <ArrowUpRight className="h-6 w-6" />
                </span>
              </div>
            </Container>
          </Link>
        </section>
      ) : null}

      {/* Back to portfolio */}
      <div className="border-t border-white/[0.06] py-10">
        <Container>
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-bone-dim transition-colors hover:text-gold-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-x-1" />
            All work
          </Link>
        </Container>
      </div>
    </article>
  )
}

function cnReveal(index: number): string {
  return `reveal aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850 ${
    index % 4 === 0 ? 'sm:col-span-2' : ''
  }`
}

function NarrativeBlock({
  label,
  content,
  index,
}: {
  label: string
  content: string
  index: number
}) {
  if (!content) return null
  return (
    <section className="reveal" data-reveal-index={index}>
      <div className="flex items-center gap-4">
        <h2 className="text-[0.62rem] uppercase tracking-luxe text-gold-400">{label}</h2>
        <span className="h-px flex-1 bg-white/[0.07]" aria-hidden="true" />
      </div>
      <Markdown content={content} className="prose-luxe mt-7" />
    </section>
  )
}

function ProjectHero({ project }: { project: ProjectDoc }) {
  return (
    <header className="relative">
      <div className="relative h-[52vh] min-h-[24rem] w-full overflow-hidden sm:h-[62vh]">
        <img
          src={project.coverImage}
          alt={`${project.client} — ${project.title}`}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/70"
          aria-hidden="true"
        />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

        <Container className="absolute inset-x-0 bottom-0 pb-12 sm:pb-16">
          <Link
            to="/portfolio"
            className="group mb-8 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-wide2 text-bone-dim transition-colors hover:text-gold-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-x-1" />
            All work
          </Link>

          <p className="text-[0.68rem] uppercase tracking-luxe text-gold-300">
            {project.client}
            {project.year ? ` · ${project.year}` : ''}
          </p>
          <h1 className="display mt-4 max-w-4xl text-display-md text-shadow-luxe">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone-muted sm:text-lg">
            {project.excerpt}
          </p>
        </Container>
      </div>

      <div className="hairline" aria-hidden="true" />
    </header>
  )
}
