import { Link } from 'react-router-dom'
import { ArrowUpRight, Quote, Star } from 'lucide-react'

import { Badge } from '@/components/ui/Section'
import { resolveIcon } from '@/lib/icons'
import { cn, formatDate, formatPrice, truncate } from '@/lib/utils'
import type {
  BlogPostDoc,
  PricingPlanDoc,
  ProcessStepDoc,
  ProjectDoc,
  ServiceDoc,
  TestimonialDoc,
  ValuePropDoc,
} from '@/types/content'

/* -------------------------------------------------------------------------- */
/*  Project card                                                              */
/* -------------------------------------------------------------------------- */

export function ProjectCard({
  project,
  index = 0,
  size = 'default',
}: {
  project: ProjectDoc
  index?: number
  size?: 'default' | 'wide'
}) {
  return (
    <article
      className={cn(
        'reveal group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850 card-hover',
        size === 'wide' ? 'lg:col-span-2' : '',
      )}
      data-reveal-index={index % 3}
    >
      <Link to={`/portfolio/${project.slug}`} className="block">
        <div className={cn('relative overflow-hidden', size === 'wide' ? 'aspect-[16/8]' : 'aspect-[4/3]')}>
          <img
            src={project.coverImage}
            alt={`${project.client} — ${project.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent opacity-80"
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
            <Badge tone="gold" className="backdrop-blur-md">
              {project.category}
            </Badge>
            <span className="font-mono text-[0.62rem] text-bone-dim">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-[0.68rem] uppercase tracking-wide2 text-gold-300">{project.client}</p>
            <h3 className="mt-2 font-display text-2xl font-light leading-tight text-bone sm:text-[1.75rem]">
              {project.title}
            </h3>

            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="max-w-md text-sm leading-relaxed text-bone-muted opacity-0 transition-all duration-700 ease-luxe group-hover:opacity-100">
                {truncate(project.excerpt, 120)}
              </p>
              <span
                className="flex h-10 w-10 shrink-0 translate-y-2 items-center justify-center rounded-full border border-gold-500/40 bg-ink-950/60 text-gold-200 opacity-0 backdrop-blur transition-all duration-700 ease-luxe group-hover:translate-y-0 group-hover:opacity-100"
                aria-hidden="true"
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {project.metrics?.length ? (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                {project.metrics.slice(0, 2).map((metric) => (
                  <li key={metric.id} className="flex items-baseline gap-1.5">
                    <span className="font-display text-lg font-light text-gold-200">{metric.value}</span>
                    <span className="text-[0.62rem] uppercase tracking-wide2 text-bone-dim">{metric.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Service card                                                              */
/* -------------------------------------------------------------------------- */

export function ServiceCard({ service, index = 0 }: { service: ServiceDoc; index?: number }) {
  const Icon = resolveIcon(service.icon)

  return (
    <article
      className="reveal group relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-ink-850/60 p-7 card-hover"
      data-reveal-index={index % 3}
    >
      <span
        className="absolute inset-x-7 top-0 h-px bg-gold-sheen opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/[0.07] text-gold-200 transition-all duration-700 ease-luxe group-hover:border-gold-500/50 group-hover:bg-gold-500/[0.12]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-mono text-[0.62rem] text-bone-dim/60">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-6 font-display text-2xl font-light text-bone">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-bone-muted">{service.excerpt}</p>

      {service.deliverables?.length ? (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {service.deliverables.slice(0, 3).map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
        {service.startingPrice ? (
          <span className="text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
            From{' '}
            <span className="text-gold-200">{formatPrice(service.startingPrice)}</span>
          </span>
        ) : (
          <span className="text-[0.68rem] uppercase tracking-wide2 text-bone-dim">Scoped individually</span>
        )}
        <Link
          to={`/services#${service.slug}`}
          className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-wide2 text-gold-300 transition-colors hover:text-gold-100"
        >
          Details
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Blog post card                                                            */
/* -------------------------------------------------------------------------- */

export function PostCard({
  post,
  index = 0,
  featured,
}: {
  post: BlogPostDoc
  index?: number
  featured?: boolean
}) {
  return (
    <article
      className={cn(
        'reveal group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850/60 card-hover',
        featured && 'lg:grid lg:grid-cols-2 lg:items-stretch',
      )}
      data-reveal-index={index % 3}
    >
      <Link
        to={`/blog/${post.slug}`}
        className={cn('block overflow-hidden', featured ? 'lg:h-full' : 'aspect-[16/10]')}
      >
        <div className={cn('h-full w-full overflow-hidden', featured ? 'min-h-[16rem] lg:min-h-full' : '')}>
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.05]"
          />
        </div>
      </Link>

      <div className={cn('flex flex-1 flex-col p-6', featured && 'lg:justify-center lg:p-10')}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="gold">{post.category}</Badge>
          <span className="text-[0.66rem] uppercase tracking-wide2 text-bone-dim">
            {post.readMinutes} min read
          </span>
        </div>

        <h3
          className={cn(
            'mt-4 font-display font-light leading-tight text-bone',
            featured ? 'text-3xl lg:text-4xl' : 'text-xl',
          )}
        >
          <Link to={`/blog/${post.slug}`} className="transition-colors duration-400 hover:text-gold-200">
            {post.title}
          </Link>
        </h3>

        <p className={cn('mt-3 flex-1 text-sm leading-relaxed text-bone-muted', featured && 'text-base')}>
          {post.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
          <div className="flex items-center gap-3">
            {post.author?.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt=""
                className="h-8 w-8 rounded-full border border-white/10 object-cover"
                loading="lazy"
              />
            ) : null}
            <div className="leading-tight">
              <p className="text-xs text-bone">{post.author?.name}</p>
              <p className="text-[0.66rem] text-bone-dim">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-gold-400 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Testimonial                                                               */
/* -------------------------------------------------------------------------- */

export function TestimonialCard({
  testimonial,
  index = 0,
}: {
  testimonial: TestimonialDoc
  index?: number
}) {
  return (
    <figure
      className="reveal relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-ink-850/60 p-7 card-hover"
      data-reveal-index={index % 3}
    >
      <Quote
        className="absolute right-7 top-7 h-8 w-8 rotate-180 text-gold-500/12"
        aria-hidden="true"
        strokeWidth={1}
      />

      <div className="flex items-center gap-1" aria-label={`${testimonial.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, star) => (
          <Star
            key={star}
            className={cn('h-3.5 w-3.5', star < testimonial.rating ? 'text-gold-300' : 'text-white/10')}
            fill={star < testimonial.rating ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="mt-6 flex-1 font-display text-xl font-light leading-relaxed text-bone sm:text-[1.35rem]">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3.5 border-t border-white/[0.06] pt-5">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full border border-gold-500/25 object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/25 bg-gold-500/10 font-display text-gold-200">
            {testimonial.name.charAt(0)}
          </span>
        )}
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-bone">{testimonial.name}</p>
          <p className="truncate text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Pricing plan                                                              */
/* -------------------------------------------------------------------------- */

export function PlanCard({
  plan,
  index = 0,
  compact,
}: {
  plan: PricingPlanDoc
  index?: number
  compact?: boolean
}) {
  return (
    <article
      className={cn(
        'reveal relative flex h-full flex-col rounded-2xl p-7 transition-all duration-700 ease-luxe sm:p-8',
        plan.highlighted
          ? 'border border-gold-500/35 bg-gradient-to-b from-ink-800 to-ink-900 shadow-gold-glow'
          : 'border border-white/[0.07] bg-ink-850/60 hover:border-white/15',
      )}
      data-reveal-index={index % 4}
    >
      {plan.highlighted ? (
        <span
          className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gold-sheen"
          aria-hidden="true"
        />
      ) : null}

      {plan.badge ? (
        <span className="absolute right-6 top-6 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[0.6rem] uppercase tracking-wide2 text-gold-200">
          {plan.badge}
        </span>
      ) : null}

      <h3 className="font-display text-3xl font-light text-bone">{plan.name}</h3>
      <p className="mt-2 text-sm text-bone-dim">{plan.tagline}</p>

      <div className="mt-7 flex items-baseline gap-2">
        <span className="gold-text font-display text-5xl font-light leading-none">
          {plan.custom ? 'Custom' : formatPrice(plan.price, plan.currency)}
        </span>
        {!plan.custom ? (
          <span className="text-[0.68rem] uppercase tracking-wide2 text-bone-dim">{plan.period}</span>
        ) : null}
      </div>

      <ul className={cn('mt-8 flex-1 space-y-3', compact && 'mt-6')}>
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-bone-muted">
            <span
              className={cn(
                'mt-[0.55em] h-1 w-1 shrink-0 rotate-45',
                plan.highlighted ? 'bg-gold-300' : 'bg-gold-500/60',
              )}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to={plan.ctaHref || '/contact'}
        className={cn('btn mt-8 w-full', plan.highlighted ? 'btn-primary btn-sheen' : 'btn-ghost')}
      >
        {plan.ctaLabel}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Value prop                                                                */
/* -------------------------------------------------------------------------- */

export function ValueCard({ value, index = 0 }: { value: ValuePropDoc; index?: number }) {
  const Icon = resolveIcon(value.icon)

  return (
    <article
      className="reveal group relative rounded-2xl border border-white/[0.07] bg-ink-850/50 p-7 card-hover"
      data-reveal-index={index % 3}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/[0.07] text-gold-200">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <h3 className="mt-6 font-display text-2xl font-light text-bone">{value.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-bone-muted">{value.description}</p>

      {value.stat ? (
        <div className="mt-6 flex items-baseline gap-2.5 border-t border-white/[0.06] pt-5">
          <span className="gold-text font-display text-3xl font-light">{value.stat}</span>
          <span className="text-[0.64rem] uppercase leading-snug tracking-wide2 text-bone-dim">
            {value.statLabel}
          </span>
        </div>
      ) : null}
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Process step                                                              */
/* -------------------------------------------------------------------------- */

export function ProcessStep({
  step,
  index,
}: {
  step: ProcessStepDoc
  index: number
}) {
  return (
    <li className="reveal relative grid gap-6 border-t border-white/[0.07] py-9 md:grid-cols-12 md:gap-10" data-reveal-index={index % 4}>
      <div className="md:col-span-3">
        <span className="gold-text font-display text-5xl font-light leading-none">{step.number}</span>
        <h3 className="mt-4 font-display text-3xl font-light text-bone">{step.title}</h3>
      </div>

      <div className="md:col-span-5">
        <p className="text-[0.98rem] leading-relaxed text-bone-muted">{step.description}</p>
      </div>

      <div className="md:col-span-4">
        <ul className="space-y-2.5">
          {step.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-bone-dim">
              <span className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45 bg-gold-500/70" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
