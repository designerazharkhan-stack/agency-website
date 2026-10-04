import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Minus, Quote } from 'lucide-react'

import { ServiceCard } from '@/components/cards'
import { PageHero, PageSection } from '@/components/layout/PageHero'
import { Container, SectionHeading } from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getProcessSteps, getServices } from '@/lib/content'
import { useSeo } from '@/lib/seo'
import { cn, formatPrice } from '@/lib/utils'

const ENGAGEMENT_MODELS = [
  {
    name: 'Fixed fee',
    best: 'Scope is defined',
    body: 'A number agreed against written deliverables. Best when you already know what you want built. Change the scope and we re-quote before starting the work.',
  },
  {
    name: 'Time & materials',
    best: 'Scope is uncertain',
    body: 'Senior people at a published day rate against an agreed ceiling. Best when the work involves discovery you cannot specify up front. You see the burn weekly.',
  },
  {
    name: 'Retainer',
    best: 'Scope is continuous',
    body: 'A fixed monthly commitment against a rolling backlog. Booked quarterly, cancellable with thirty days notice, and re-prioritised together each month.',
  },
]

export default function ServicesPage() {
  const site = useSiteContent()
  useReveal()

  const { data } = useAsync(async () => {
    const [services, steps] = await Promise.all([getServices(), getProcessSteps()])
    return { services, steps }
  }, [])

  useSeo({
    title: 'Services',
    description:
      'Brand strategy, web design and development, product design, motion and 3D, content and search, growth, embedded engineering and care retainers.',
    path: '/services',
    site: site.seo,
  })

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four disciplines."
        accent="One standard."
        description="We are deliberately small. Every engagement is led by the people you meet first, and we will tell you plainly when a project does not need us."
      >
        <LinkButton to="/contact" size="lg" iconRight={<ArrowUpRight className="h-4 w-4" />}>
          Request a proposal
        </LinkButton>
      </PageHero>

      {/* Services */}
      <PageSection>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.services ?? []).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </Container>
      </PageSection>

      {/* Detailed breakdown, anchored per service */}
      <PageSection className="bg-ink-900/40">
        <Container>
          <SectionHeading
            eyebrow="In detail"
            title="What you"
            accent="actually receive"
            description="Every engagement includes the full list below. There is no reduced version for smaller budgets — the scope changes instead."
          />

          <div className="mt-14 space-y-5">
            {(data?.services ?? []).map((service, index) => (
              <article
                key={service.id}
                id={service.slug}
                className="reveal scroll-mt-28 rounded-2xl border border-white/[0.07] bg-ink-850/50 p-6 transition-colors duration-500 hover:border-gold-500/25 sm:p-9"
                data-reveal-index={index % 3}
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-5">
                    <p className="font-mono text-[0.62rem] text-gold-500/60">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-light text-bone sm:text-4xl">
                      {service.title}
                    </h3>
                    <p className="mt-5 text-sm leading-relaxed text-bone-muted">{service.description}</p>

                    {service.startingPrice ? (
                      <p className="mt-7 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
                        From{' '}
                        <span className="gold-text text-lg">{formatPrice(service.startingPrice)}</span>
                      </p>
                    ) : null}

                    <Link
                      to={`/contact?service=${service.slug}`}
                      className="group mt-6 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-gold-300 transition-colors hover:text-gold-100"
                    >
                      Enquire about this
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:gap-10">
                    <div>
                      <h4 className="text-[0.62rem] uppercase tracking-luxe text-gold-400">Deliverables</h4>
                      <ul className="mt-5 space-y-2.5">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-bone-muted">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[0.62rem] uppercase tracking-luxe text-gold-400">How it works</h4>
                      <ul className="mt-5 space-y-2.5">
                        {service.features.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-bone-muted">
                            <Minus className="mt-1 h-3 w-3 shrink-0 text-bone-dim" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </PageSection>

      {/* Engagement models */}
      <PageSection>
        <Container>
          <SectionHeading
            eyebrow="How we charge"
            title="Three ways to"
            accent="structure the work"
            description="We will recommend one. You are free to argue, and occasionally you are right."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {ENGAGEMENT_MODELS.map((model, index) => (
              <article
                key={model.name}
                className={cn('reveal panel p-7', index === 0 && 'lg:border-gold-500/25')}
                data-reveal-index={index}
              >
                <p className="text-[0.62rem] uppercase tracking-luxe text-gold-400">{model.best}</p>
                <h3 className="mt-4 font-display text-3xl font-light text-bone">{model.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">{model.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </PageSection>

      {/* Process recap */}
      <PageSection className="bg-ink-900/40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Process"
                title="Same five stages,"
                accent="every time"
                description="Which ever services you buy, the shape of the engagement does not change. Consistency is what lets a project survive contact with a real organisation."
              />
              <LinkButton to="/about#process" variant="ghost" className="mt-9" iconRight={<ArrowUpRight className="h-4 w-4" />}>
                About the studio
              </LinkButton>
            </div>

            <ol className="lg:col-span-7">
              {(data?.steps ?? []).map((step, index) => (
                <li
                  key={step.id}
                  className="reveal flex gap-6 border-t border-white/[0.07] py-6 last:border-b"
                  data-reveal-index={index % 4}
                >
                  <span className="gold-text font-display text-2xl font-light">{step.number}</span>
                  <div>
                    <h3 className="font-display text-2xl font-light text-bone">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-bone-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </PageSection>

      {/* Guarantee */}
      <PageSection>
        <Container>
          <div className="panel-gold overflow-hidden p-8 sm:p-12">
            <Quote className="h-8 w-8 text-gold-500/30" aria-hidden="true" strokeWidth={1} />
            <blockquote className="mt-6 font-display text-2xl font-light leading-snug text-bone sm:text-3xl lg:text-4xl">
              “If the work does not move the metric we agreed in week one, we will keep working on it at no
              additional cost until it does. That commitment is written into every contract we sign.”
            </blockquote>
            <p className="mt-8 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
              Elena Marchetti · Founder & Strategy Director
            </p>
          </div>
        </Container>
      </PageSection>
    </>
  )
}
