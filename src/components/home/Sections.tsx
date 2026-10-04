import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import { ProjectCard, ServiceCard } from '@/components/cards'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { useReveal } from '@/hooks/useReveal'
import type { ProjectDoc, ServiceDoc } from '@/types/content'

/* -------------------------------------------------------------------------- */

export function ServicesSection({ services }: { services: ServiceDoc[] }) {
  useReveal()
  if (!services.length) return null

  return (
    <Section id="services" className="relative">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-gold-500/[0.05] blur-[140px]"
        aria-hidden="true"
      />

      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title="Four disciplines,"
            accent="one standard"
            description="We keep the team small so the work stays senior. Most engagements combine two or three of these — occasionally all of them."
          />
          <LinkButton
            to="/services"
            variant="ghost"
            className="shrink-0"
            iconRight={<ArrowUpRight className="h-4 w-4" />}
          >
            All services
          </LinkButton>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {services.slice(0, 6).map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

export function FeaturedWorkSection({ projects }: { projects: ProjectDoc[] }) {
  useReveal()
  const featured = projects.filter((project) => project.featured).slice(0, 4)
  const list = featured.length ? featured : projects.slice(0, 4)
  if (!list.length) return null

  return (
    <Section className="relative bg-ink-900/40">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <Container className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title="Evidence,"
            accent="not adjectives"
            description="A cross-section of recent engagements. Every one includes the numbers it moved, because that is the part that matters."
          />
          <LinkButton
            to="/portfolio"
            variant="ghost"
            className="shrink-0"
            iconRight={<ArrowUpRight className="h-4 w-4" />}
          >
            Full portfolio
          </LinkButton>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16">
          {list.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              size={index === 0 ? 'wide' : 'default'}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

export function ClientStrip({ names }: { names: string[] }) {
  if (!names.length) return null
  const doubled = [...names, ...names]

  return (
    <section className="border-y border-white/[0.06] bg-ink-950 py-12" aria-label="Selected clients">
      <Container>
        <p className="text-center text-[0.62rem] uppercase tracking-luxe text-bone-dim">
          Trusted by teams who cannot afford to be ordinary
        </p>
      </Container>
      <div className="mask-fade-x mt-8 overflow-hidden">
        <ul className="flex w-max animate-marquee items-center gap-12 sm:gap-16">
          {doubled.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="whitespace-nowrap font-display text-lg font-light tracking-wide2 text-bone-dim/70 sm:text-xl"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

export function ViewAllLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-gold-300 transition-colors hover:text-gold-100"
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}
