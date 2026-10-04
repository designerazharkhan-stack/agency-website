import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Quote } from 'lucide-react'

import { TestimonialCard } from '@/components/cards'
import { PageHero, PageSection } from '@/components/layout/PageHero'
import { Container, SectionHeading } from '@/components/ui/Section'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getTestimonials } from '@/lib/content'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export default function TestimonialsPage() {
  const site = useSiteContent()
  useReveal()
  const [filter, setFilter] = useState<'all' | 'featured'>('all')

  const { data } = useAsync(() => getTestimonials(), [])

  useSeo({
    title: 'Testimonials',
    description:
      'What clients say after the work shipped — from named people at named companies, with the projects the work was for.',
    path: '/testimonials',
    site: site.seo,
  })

  const testimonials = data ?? []

  const list = useMemo(() => {
    const base = filter === 'featured' ? testimonials.filter((item) => item.featured) : testimonials
    return [...base].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  }, [testimonials, filter])

  const average = useMemo(() => {
    if (!testimonials.length) return '—'
    const total = testimonials.reduce((sum, item) => sum + (item.rating ?? 5), 0)
    return (total / testimonials.length).toFixed(1)
  }, [testimonials])

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Every quote is"
        accent="from a named person"
        description="Given after the work shipped, not after the invoice cleared. Where a client asked us not to publish their name, we have described them precisely instead."
        meta={[
          { label: 'Client rating', value: `${average}/5` },
          { label: 'Testimonials', value: String(testimonials.length) },
          { label: 'Repeat clients', value: '94%' },
          { label: 'References available', value: 'On request' },
        ]}
      />

      <PageSection>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="In their words"
              title="The part we"
              accent="did not write"
              description="We do not edit these beyond removing identifying detail where a client asked us to."
            />

            <div className="flex shrink-0 gap-2">
              {(['all', 'featured'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-wide2 transition-all duration-400',
                    filter === key
                      ? 'border-gold-500/50 bg-gold-500/10 text-gold-100'
                      : 'border-white/10 bg-white/[0.02] text-bone-dim hover:border-white/25 hover:text-bone',
                  )}
                >
                  {key === 'all' ? 'All' : 'Featured'}
                </button>
              ))}
            </div>
          </div>

          {list.length ? (
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          ) : (
            <p className="mt-14 text-bone-dim">No testimonials in this view yet.</p>
          )}
        </Container>
      </PageSection>

      {/* Reference block */}
      <PageSection className="relative overflow-hidden bg-ink-900/40">
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-gold-500/[0.06] blur-[140px]"
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="panel-gold p-8 text-center sm:p-14">
            <Quote className="mx-auto h-8 w-8 text-gold-500/30" aria-hidden="true" strokeWidth={1} />
            <h2 className="display mx-auto mt-8 max-w-3xl text-display-sm">
              We will put you in touch with a client we worked badly for.
            </h2>
            <p className="lede mx-auto mt-6 max-w-2xl">
              Every engagement includes that offer. It is a stronger reference than a happy customer, because it
              tells you what we are like when something is difficult — which is the part that matters.
            </p>
            <Link
              to="/contact"
              className="group mt-10 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-gold-200 transition-colors hover:text-gold-100"
            >
              Ask for references
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Container>
      </PageSection>
    </>
  )
}
