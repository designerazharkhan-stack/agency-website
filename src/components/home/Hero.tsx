import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'

import { LinkButton } from '@/components/ui/Button'
import { Container, Eyebrow, Orb } from '@/components/ui/Section'
import { useSiteContent } from '@/context/ContentContext'
import type { HeroSettings } from '@/types/content'

/**
 * Hero. Typographic by default (no image required), with an optional image
 * panel that collapses below the copy on mobile.
 */
export function Hero({ hero }: { hero: HeroSettings }) {
  const site = useSiteContent()
  const reduce = useReducedMotion()

  const words = (hero.headlineAccent || '').split(' ').filter(Boolean)

  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-24 lg:pb-40 lg:pt-28">
      {/* Atmosphere */}
      <div className="absolute inset-0 -z-20 bg-ink-radial" aria-hidden="true" />
      <div className="grid-lines pointer-events-none absolute inset-0 -z-20 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-b from-transparent to-ink-950"
        aria-hidden="true"
      />
      <Orb className="-right-32 -top-24" color="rgba(194,154,60,0.20)" size={620} />
      <Orb className="-left-40 top-1/3" color="rgba(92,69,32,0.24)" size={520} />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-7">
            {hero.eyebrow ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Eyebrow>{hero.eyebrow}</Eyebrow>
              </motion.div>
            ) : null}

            <h1 className="display mt-8 text-display-lg">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {hero.headlineLine1}
              </motion.span>

              <motion.span
                className="mt-2 block"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="gold-text animate-shimmer">
                  {words.map((word, index) => (
                    <span key={`${word}-${index}`} className="inline-block">
                      {word}
                      {index < words.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </span>
              </motion.span>
            </h1>

            <motion.p
              className="lede mt-9 max-w-xl text-lg sm:text-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.subheadline}
            </motion.p>

            <motion.div
              className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              <LinkButton
                to={hero.primaryCtaHref}
                size="lg"
                iconRight={<ArrowUpRight className="h-4 w-4" />}
              >
                {hero.primaryCtaLabel}
              </LinkButton>
              <LinkButton to={hero.secondaryCtaHref} variant="ghost" size="lg">
                {hero.secondaryCtaLabel}
              </LinkButton>
            </motion.div>

            <motion.p
              className="mt-8 flex items-center gap-2 text-[0.7rem] uppercase tracking-wide2 text-bone-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-400/70" aria-hidden="true" />
              {site.contact?.availabilityNote ?? 'Currently booking new projects.'}
            </motion.p>
          </div>

          {/* Image panel */}
          {hero.imageUrl ? (
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, scale: 0.97, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                <div className="absolute -inset-3 -z-10 rounded-[1.75rem] border border-gold-500/20" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-2xl">
                  <div
                    className={reduce ? 'relative' : 'relative animate-slow-zoom'}
                    style={{ aspectRatio: '4 / 5' }}
                  >
                    <img
                      src={hero.imageUrl}
                      alt="Selected studio work"
                      className="h-full w-full object-cover"
                      fetchPriority="high"
                    />
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-luxe text-gold-300">Now in progress</p>
                      <p className="mt-1.5 font-display text-2xl font-light text-bone">
                        Q3 {new Date().getFullYear()} — two slots
                      </p>
                    </div>
                    <Link
                      to="/portfolio"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-ink-950/50 text-bone backdrop-blur transition-colors duration-500 hover:border-gold-400/70 hover:text-gold-200"
                      aria-label="View selected work"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* Stats */}
        {hero.stats?.length ? (
          <motion.dl
            className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/[0.07] pt-10 sm:mt-24 lg:grid-cols-4"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.stats.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-2">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="gold-text font-display text-4xl font-light leading-none sm:text-5xl">
                  {stat.value}
                </dd>
                <p className="text-[0.66rem] uppercase tracking-wide2 text-bone-dim">{stat.label}</p>
              </div>
            ))}
          </motion.dl>
        ) : null}
      </Container>

      {/* Scroll cue */}
      <a
        href="#services"
        aria-label="Scroll to services"
        className="mx-auto mt-16 hidden w-fit flex-col items-center gap-2 text-bone-dim transition-colors hover:text-gold-200 lg:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-luxe">Scroll</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </a>
    </section>
  )
}

/** Infinite scrolling capability marquee. */
export function CapabilityMarquee({ items }: { items: string[] }) {
  if (!items.length) return null
  const doubled = [...items, ...items]

  return (
    <div className="relative border-y border-white/[0.07] bg-ink-900/40 py-5">
      <div className="mask-fade-x overflow-hidden">
        <ul className="flex w-max animate-marquee items-center gap-14 pr-14">
          {doubled.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center gap-14">
              <span className="whitespace-nowrap font-display text-xl font-light tracking-wide text-bone-muted sm:text-2xl">
                {item}
              </span>
              <span className="h-1 w-1 rotate-45 bg-gold-500/70" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only">Capabilities: {items.join(', ')}</p>
    </div>
  )
}
