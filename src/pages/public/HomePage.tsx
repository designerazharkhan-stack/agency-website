import { useEffect, useState } from 'react'

import {
  defaultClients,
  defaultPlans,
  defaultPosts,
  defaultProcess,
  defaultProjects,
  defaultServices,
  defaultTestimonials,
  defaultValues,
} from '@/data/defaults'
import { CapabilityMarquee, Hero } from '@/components/home/Hero'
import { ClientStrip, FeaturedWorkSection, ServicesSection } from '@/components/home/Sections'
import {
  FinalCtaSection,
  LatestPostsSection,
  PricingPreviewSection,
  ProcessSection,
  TestimonialsSection,
  WhyUsSection,
} from '@/components/home/Blocks'
import { useSiteContent } from '@/context/ContentContext'
import { useReveal } from '@/hooks/useReveal'
import {
  getClients,
  getPlans,
  getPosts,
  getProcessSteps,
  getProjects,
  getServices,
  getTestimonials,
  getValues,
} from '@/lib/content'
import { useSeo } from '@/lib/seo'

const initialHomeContent = {
  services: defaultServices,
  projects: defaultProjects,
  values: defaultValues,
  steps: defaultProcess,
  testimonials: defaultTestimonials,
  plans: defaultPlans,
  posts: defaultPosts,
  clients: defaultClients,
}

export default function HomePage() {
  const site = useSiteContent()
  useReveal()
  const [content, setContent] = useState(initialHomeContent)

  useEffect(() => {
    let active = true
    const load = <K extends keyof typeof initialHomeContent>(
      key: K,
      request: () => Promise<(typeof initialHomeContent)[K]>,
    ) => {
      void request().then((value) => {
        if (active) setContent((current) => ({ ...current, [key]: value }))
      }).catch((error: unknown) => {
        console.error(`[home] Could not load "${key}" content; keeping bundled defaults.`, error)
      })
    }

    load('services', getServices)
    load('projects', getProjects)
    load('values', getValues)
    load('steps', getProcessSteps)
    load('testimonials', getTestimonials)
    load('plans', getPlans)
    load('posts', getPosts)
    load('clients', getClients)

    return () => {
      active = false
    }
  }, [])

  useSeo({
    title: site.seo?.title ?? site.brand.siteName,
    description: site.seo?.description ?? site.brand.description,
    keywords: site.seo?.keywords,
    ogImage: site.seo?.ogImage,
    path: '/',
    site: site.seo,
  })

  return (
    <>
      {site.theme?.heroEnabled !== false ? <Hero hero={site.hero} /> : null}
      <CapabilityMarquee items={site.hero?.marquee ?? []} />
      <ClientStrip names={content.clients.map((client) => client.name)} />

      <ServicesSection services={content.services} />
      <FeaturedWorkSection projects={content.projects} />
      <WhyUsSection values={content.values} />
      <ProcessSection steps={content.steps} />

      {site.theme?.showTestimonials !== false ? (
        <TestimonialsSection testimonials={content.testimonials} />
      ) : null}

      {site.theme?.showPricing !== false ? <PricingPreviewSection plans={content.plans} /> : null}
      {site.theme?.showBlog !== false ? <LatestPostsSection posts={content.posts} /> : null}

      <FinalCtaSection cta={site.cta} />
    </>
  )
}
