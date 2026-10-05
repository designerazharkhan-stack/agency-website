import { ArrowUpRight, Check, MoveDown } from 'lucide-react'

import { PlanCard, PostCard, ProcessStep, TestimonialCard, ValueCard } from '@/components/cards'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { GlobalCTA } from '@/components/shared-zone/SharedZoneComponents'
import { useReveal } from '@/hooks/useReveal'
import { ViewAllLink } from './Sections'
import type {
  BlogPostDoc,
  CtaSettings,
  PricingPlanDoc,
  ProcessStepDoc,
  TestimonialDoc,
  ValuePropDoc,
} from '@/types/content'

/* -------------------------------------------------------------------------- */

export function WhyUsSection({ values }: { values: ValuePropDoc[] }) {
  useReveal()
  if (!values.length) return null

  return (
    <Section className="relative">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why studios choose us"
          title="Six reasons that are"
          accent="operational, not aspirational"
          description="None of this is a claim about taste. Each point below is a decision we made about how the business runs — you can hold us to all of them."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.slice(0, 6).map((value, index) => (
            <ValueCard key={value.id} value={value} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

export function ProcessSection({ steps }: { steps: ProcessStepDoc[] }) {
  useReveal()
  if (!steps.length) return null

  return (
    <Section className="relative bg-ink-900/40">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(194,154,60,0.07),transparent_70%)]"
        aria-hidden="true"
      />

      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="How we work"
            title="A process"
            accent="built to be audited"
            description="Five stages, defined deliverables, and a weekly working session you are welcome to sit in. Nothing here happens for the first time in a reveal at the end."
          />
          <LinkButton to="/about#process" variant="ghost" className="shrink-0" iconRight={<MoveDown className="h-4 w-4" />}>
            Full process
          </LinkButton>
        </div>

        <ol className="mt-14 lg:mt-16">
          {steps.map((step, index) => (
            <ProcessStep key={step.id} step={step} index={index} />
          ))}
        </ol>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

export function TestimonialsSection({
  testimonials,
  showAll,
}: {
  testimonials: TestimonialDoc[]
  showAll?: boolean
}) {
  useReveal()
  if (!testimonials.length) return null

  const featured = testimonials.filter((item) => item.featured)
  const list = (featured.length ? featured : testimonials).slice(0, showAll ? 24 : 6)

  return (
    <Section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-40 top-1/4 -z-10 h-[26rem] w-[26rem] rounded-full bg-gold-500/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What clients say"
            title="The only section"
            accent="that matters"
            description="Every quote below is from a named person at a named company, given after the work shipped."
          />
          {showAll ? (
            <ViewAllLink to="/testimonials" label="All testimonials" />
          ) : null}
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {list.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

export function PricingPreviewSection({ plans }: { plans: PricingPlanDoc[] }) {
  useReveal()
  if (!plans.length) return null

  const preview = plans.slice(0, 3)

  return (
    <Section className="relative bg-ink-900/40">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Engagements"
            title="Priced in writing,"
            accent="before we start"
            description="Fixed fee against defined deliverables. If the scope changes we tell you the cost before we do the work — that is the entire pricing philosophy."
          />
          <LinkButton to="/pricing" variant="ghost" className="shrink-0" iconRight={<ArrowUpRight className="h-4 w-4" />}>
            Full pricing
          </LinkButton>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3">
          {preview.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            'Fixed fee, agreed up front',
            'Senior team only',
            'You own everything',
            'No lock-in retainers',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wide2 text-bone-dim">
              <Check className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

export function LatestPostsSection({ posts }: { posts: BlogPostDoc[] }) {
  useReveal()
  if (!posts.length) return null

  const [lead, ...rest] = posts.slice(0, 4)

  return (
    <Section className="relative">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Journal"
            title="What we have"
            accent="learned the hard way"
            description="Written for people who have to make the decision, not for an algorithm."
          />
          <ViewAllLink to="/blog" label="All writing" />
        </div>

        <div className="mt-14 grid gap-5 lg:mt-16">
          {lead ? <PostCard post={lead} featured /> : null}
          <div className="grid gap-5 sm:grid-cols-3">
            {rest.map((post, index) => (
              <PostCard key={post.id} post={post} index={index + 1} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

export function FinalCtaSection({ cta }: { cta: CtaSettings }) {
  useReveal()

  return (
    <Section tight className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-ink-radial" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/[0.09] blur-[150px]"
        aria-hidden="true"
      />

      <Container>
        <GlobalCTA cta={cta} />
      </Container>
    </Section>
  )
}
