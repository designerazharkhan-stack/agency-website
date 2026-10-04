import { useState } from 'react'
import { ArrowUpRight, Check, HelpCircle, Minus } from 'lucide-react'

import { PlanCard } from '@/components/cards'
import { PageHero, PageSection } from '@/components/layout/PageHero'
import { Container, SectionHeading } from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getFaqs, getPlans } from '@/lib/content'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'

const INCLUDED = [
  'A named senior team — the people you meet are the people who deliver',
  'Fixed fee against written deliverables, agreed before we start',
  'Weekly working sessions with the people doing the work',
  'Source, assets and documentation transferred in full on handover',
  'WCAG 2.2 AA accessibility and a Core Web Vitals budget as standard',
  '30 days of post-launch support included in every project',
]

const NOT_INCLUDED = [
  'No account manager between you and the work',
  'No junior delivery team, no rotating cast',
  'No surprise invoices — scope changes are quoted before they happen',
  'No lock-in: retainers are cancellable with thirty days notice',
]

export default function PricingPage() {
  const site = useSiteContent()
  useReveal()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const { data } = useAsync(async () => {
    const [plans, faqs] = await Promise.all([getPlans(), getFaqs()])
    return { plans, faqs }
  }, [])

  useSeo({
    title: 'Pricing',
    description:
      'Fixed-fee engagements, published starting prices and monthly retainers. What is included, what is not, and what changes the number.',
    path: '/pricing',
    site: site.seo,
  })

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Priced in writing,"
        accent="before we start"
        description="Numbers below are honest starting points, not a negotiating position. What moves them is scope, timeline and how much of the work already exists."
      >
        <LinkButton to="/contact" size="lg" iconRight={<ArrowUpRight className="h-4 w-4" />}>
          Request a fixed quote
        </LinkButton>
      </PageHero>

      {/* Plans */}
      <PageSection>
        <Container>
          <div className="grid gap-5 lg:grid-cols-4">
            {(data?.plans ?? []).map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} compact />
            ))}
          </div>

          <p className="mt-10 text-center text-[0.7rem] leading-relaxed text-bone-dim">
            Prices exclude third-party costs (licences, print, hosting above plan, media spend). We mark those
            separately and never hide them inside a number.
          </p>
        </Container>
      </PageSection>

      {/* What's included / not */}
      <PageSection className="bg-ink-900/40">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="reveal panel-gold p-8 sm:p-10">
              <h2 className="font-display text-3xl font-light text-bone">Always included</h2>
              <ul className="mt-8 space-y-4">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-bone-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="reveal panel p-8 sm:p-10" data-reveal-index={1}>
              <h2 className="font-display text-3xl font-light text-bone">Never included</h2>
              <ul className="mt-8 space-y-4">
                {NOT_INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-bone-muted">
                    <Minus className="mt-1 h-3 w-3 shrink-0 text-bone-dim" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </PageSection>

      {/* What moves the number */}
      <PageSection>
        <Container>
          <SectionHeading
            eyebrow="Transparency"
            title="Four things that"
            accent="change the number"
            description="We would rather you knew this before the first call than wondered about it afterwards."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Starting point',
                body: 'A rebrand with no existing guidelines and a site with no content is materially more work than the reverse. We inventory honestly in week one.',
              },
              {
                title: 'Number of markets',
                body: 'Each additional language or region means content, review, legal and QA. It is rarely linear, and we never assume it is.',
              },
              {
                title: 'Decision speed',
                body: 'Feedback within 48 hours keeps the schedule. A fortnight of internal review costs roughly four weeks and we will say so.',
              },
              {
                title: 'Timeline pressure',
                body: 'Compressed deadlines are possible and priced accordingly. They never come with a reduction in scope — only in flexibility elsewhere.',
              },
            ].map((item, index) => (
              <article
                key={item.title}
                className="reveal rounded-2xl border border-white/[0.07] bg-ink-850/50 p-7"
                data-reveal-index={index % 4}
              >
                <span className="font-mono text-[0.62rem] text-gold-500/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-2xl font-light text-bone">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </PageSection>

      {/* FAQ accordion */}
      {data?.faqs?.length ? (
        <PageSection className="border-t border-white/[0.06]">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <SectionHeading
                  eyebrow="Questions"
                  title="About money,"
                  accent="plainly"
                  description="The commercial questions people are reluctant to ask, answered without hedging."
                />
                <LinkButton
                  to="/contact"
                  className="mt-9"
                  variant="ghost"
                  iconRight={<ArrowUpRight className="h-4 w-4" />}
                >
                  Ask about your budget
                </LinkButton>
              </div>

              <div className="lg:col-span-8">
                <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {data.faqs.map((faq, index) => {
                    const open = openFaq === index
                    return (
                      <li key={faq.id} className="reveal">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(open ? null : index)}
                          aria-expanded={open}
                          className="flex w-full items-start justify-between gap-6 py-6 text-left"
                        >
                          <span
                            className={cn(
                              'font-display text-lg font-light transition-colors sm:text-xl',
                              open ? 'text-gold-200' : 'text-bone',
                            )}
                          >
                            {faq.question}
                          </span>
                          <HelpCircle
                            className={cn(
                              'mt-1 h-4 w-4 shrink-0 text-bone-dim transition-transform duration-500',
                              open && 'rotate-90 text-gold-400',
                            )}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          className={cn(
                            'grid transition-all duration-600 ease-luxe',
                            open ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0',
                          )}
                        >
                          <p className="overflow-hidden text-sm leading-relaxed text-bone-muted">{faq.answer}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </Container>
        </PageSection>
      ) : null}
    </>
  )
}
