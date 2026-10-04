import { useMemo } from 'react'

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
import { useAsync } from '@/hooks/useAsync'
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

export default function HomePage() {
  const site = useSiteContent()
  useReveal()

  const { data } = useAsync(
    async () => {
      const [services, projects, values, steps, testimonials, plans, posts, clients] =
        await Promise.all([
          getServices(),
          getProjects(),
          getValues(),
          getProcessSteps(),
          getTestimonials(),
          getPlans(),
          getPosts(),
          getClients(),
        ])
      return { services, projects, values, steps, testimonials, plans, posts, clients }
    },
    [],
  )

  const content = useMemo(
    () => ({
      services: data?.services ?? [],
      projects: data?.projects ?? [],
      values: data?.values ?? [],
      steps: data?.steps ?? [],
      testimonials: data?.testimonials ?? [],
      plans: data?.plans ?? [],
      posts: data?.posts ?? [],
      clients: data?.clients ?? [],
    }),
    [data],
  )

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
