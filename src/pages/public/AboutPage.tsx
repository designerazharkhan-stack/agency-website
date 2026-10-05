import { Link } from 'react-router-dom'
import { ArrowUpRight, Award as AwardIcon, Linkedin, Twitter } from 'lucide-react'

import { ProcessStep, ValueCard } from '@/components/cards'
import { PageHero, PageSection } from '@/components/layout/PageHero'
import { Container, Orb, SectionHeading } from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { AvatarPreview } from '@/components/ui/FormKit'
import { TrustStats } from '@/components/shared-zone/SharedZoneComponents'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getAwards, getClients, getFaqs, getProcessSteps, getTeam, getValues } from '@/lib/content'
import { useSeo } from '@/lib/seo'
import { safeHref } from '@/lib/utils'

export default function AboutPage() {
  const site = useSiteContent()
  useReveal()

  const { data } = useAsync(
    async () => {
      const [values, team, clients, awards, steps, faqs] = await Promise.all([
        getValues(),
        getTeam(),
        getClients(),
        getAwards(),
        getProcessSteps(),
        getFaqs(),
      ])
      return { values, team, clients, awards, steps, faqs }
    },
    [],
  )

  useSeo({
    title: 'About the studio',
    description:
      'An independent, founder-owned design and digital studio. Twelve projects a year, senior-only teams, and work we put numbers against.',
    path: '/about',
    site: site.seo,
  })

  return (
    <>
      <PageHero
        eyebrow="The studio"
        title="Independent since"
        accent="2014"
        description="We have stayed deliberately small. Twelve projects a year, senior-only teams, and every engagement carrying a number we committed to moving before we started."
      />
      <TrustStats />

      {/* Manifesto */}
      <PageSection>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Why we exist"
                title="Most good work"
                accent="never gets seen"
                description="There is no shortage of competent people producing competent work for organisations whose quality is invisible from the outside. That gap is the entire business."
              />
            </div>

            <div className="space-y-6 lg:col-span-7">
              {[
                'We believe the bottleneck is not talent, it is positioning. The hardest and most valuable part of most projects happens before anything is drawn — deciding what you are, who for, and why it is different. We spend real time there, and it is the part clients tell us they value most.',
                'We do not scale the team to fit the pipeline. That means turning down work we cannot staff with seniors, which means turning down roughly a third of what we are asked for. It is why our waitlist exists.',
                'We put outcomes in writing, including the baseline measurement. If we miss the number, that is our problem to explain rather than yours to discover in a board meeting eight months later.',
                'We hand over everything — source, documentation, training — and we design our work so that eventually you will not need us. Several clients have reached that point. It is the best possible outcome and we do not treat it as churn.',
              ].map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="reveal font-display text-xl font-light leading-relaxed text-bone/90 sm:text-2xl"
                  data-reveal-index={index % 3}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </PageSection>

      {/* Values */}
      <PageSection className="bg-ink-900/40">
        <Container>
          <SectionHeading
            eyebrow="How we operate"
            title="Six commitments"
            accent="you can audit"
            description="These are not values on a wall. Each one is a decision about how we run, and each has cost us money."
          />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.values ?? []).map((value, index) => (
              <ValueCard key={value.id} value={value} index={index} />
            ))}
          </div>
        </Container>
      </PageSection>

      {/* Process */}
      <PageSection id="process" className="scroll-mt-24">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="Five stages,"
            accent="defined deliverables"
            description="The shape does not change between a £15,000 site and a nine-month brand programme. Consistency is what keeps a project moving when the organisation around it does not."
          />
          <ol className="mt-16">
            {(data?.steps ?? []).map((step, index) => (
              <ProcessStep key={step.id} step={step} index={index} />
            ))}
          </ol>
        </Container>
      </PageSection>

      {/* Team */}
      <PageSection className="relative overflow-hidden bg-ink-900/40">
        <Orb className="-left-40 top-10" color="rgba(92,69,32,0.22)" size={520} />
        <Container className="relative">
          <SectionHeading
            eyebrow="The people"
            title="Senior only,"
            accent="no rotation"
            description="There is no junior delivery team and no account layer. The people below are the people who do the work, and they stay on it from the first call to the handover."
          />

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.team ?? []).map((member, index) => (
              <article
                key={member.id}
                className="reveal group rounded-2xl border border-white/[0.07] bg-ink-850/50 p-7 card-hover"
                data-reveal-index={index % 3}
              >
                <AvatarPreview url={member.avatarUrl} name={member.name} size={72} />

                <h3 className="mt-6 font-display text-2xl font-light text-bone">{member.name}</h3>
                <p className="mt-1 text-[0.68rem] uppercase tracking-wide2 text-gold-400">{member.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">{member.bio}</p>

                {member.specialty?.length ? (
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {member.specialty.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-6 flex gap-2 border-t border-white/[0.06] pt-5">
                  {member.linkedin ? (
                    <a
                      href={safeHref(member.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-200"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {member.twitter ? (
                    <a
                      href={safeHref(member.twitter)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on X`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-200"
                    >
                      <Twitter className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </PageSection>

      {/* Clients + awards */}
      <PageSection>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="Clients" title="Who we have" accent="worked with" />
              <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {(data?.clients ?? []).map((client, index) => (
                  <li
                    key={client.id}
                    className="reveal flex items-center gap-3 border-b border-white/[0.06] py-4"
                    data-reveal-index={index % 4}
                  >
                    <span className="font-mono text-[0.6rem] text-gold-500/50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-lg font-light text-bone/85">{client.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Recognition" title="Judged by" accent="other people" />
              <ul className="mt-12 space-y-4">
                {(data?.awards ?? []).map((award, index) => (
                  <li
                    key={award.id}
                    className="reveal flex items-start gap-4 rounded-xl border border-white/[0.07] bg-ink-850/40 p-5"
                    data-reveal-index={index % 3}
                  >
                    <AwardIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm text-bone">{award.title}</p>
                      <p className="mt-1 text-[0.66rem] uppercase tracking-wide2 text-bone-dim">
                        {award.organisation} · {award.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </PageSection>

      {/* FAQ */}
      {data?.faqs?.length ? (
        <PageSection className="border-t border-white/[0.06] bg-ink-900/40">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <SectionHeading
                  eyebrow="Questions"
                  title="The ones"
                  accent="we actually get"
                  description="If yours is not here, ask directly — we answer these on first contact anyway."
                />
                <LinkButton to="/contact" className="mt-9" iconRight={<ArrowUpRight className="h-4 w-4" />}>
                  Ask us something
                </LinkButton>
              </div>

              <div className="lg:col-span-8">
                <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {data.faqs.map((faq, index) => (
                    <div key={faq.id} className="reveal py-7" data-reveal-index={index % 3}>
                      <dt className="font-display text-xl font-light text-bone sm:text-2xl">{faq.question}</dt>
                      <dd className="mt-3 text-sm leading-relaxed text-bone-muted">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Container>
        </PageSection>
      ) : null}

      {/* Careers nudge */}
      <PageSection>
        <Container>
          <div className="panel-gold flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <h2 className="font-display text-3xl font-light text-bone">We are not hiring</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone-muted">
                Occasionally we take on one freelancer per quarter, for a specific specialist need. If you are a
                3D artist or an accessibility specialist, get in touch — we will keep you in mind for a real brief.
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex shrink-0 items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-gold-200 transition-colors hover:text-gold-100"
            >
              Introduce yourself
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Container>
      </PageSection>
    </>
  )
}
