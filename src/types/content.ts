/**
 * Content model for the whole site.
 *
 * Every collection document carries these base fields so the admin UI and
 * the Firestore rules can work generically.
 */

export interface Timestamped {
  /** Firestore Timestamp is narrowed to this shape for serialisability. */
  createdAt?: string | null
  updatedAt?: string | null
}

export interface DocMeta extends Timestamped {
  id: string
  /** Ordering hint for admin lists. */
  order?: number
  published?: boolean
  draft?: boolean
}

export interface SeoFields {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  /** 'index' | 'noindex' */
  robots?: 'index' | 'noindex'
}

/* -------------------------------------------------------------------------- */
/*  Site settings (singleton documents)                                       */
/* -------------------------------------------------------------------------- */

export interface BrandSettings {
  logoUrl?: string
  logoMarkUrl?: string
  siteName: string
  tagline: string
  description: string
  foundedYear?: string
}

export interface HeroSettings {
  eyebrow?: string
  headlineLine1: string
  headlineAccent: string
  subheadline: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  imageUrl?: string
  stats: Array<{ id: string; value: string; label: string }>
  marquee: string[]
}

export interface CtaSettings {
  eyebrow?: string
  headline: string
  body?: string
  buttonLabel: string
  buttonHref: string
}

export interface ContactSettings {
  email: string
  phone: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  mapUrl?: string
  availabilityNote?: string
  whatsapp?: string
}

export interface SocialLink {
  id: string
  label: string
  href: string
  icon: SocialIconKey
}

export type SocialIconKey =
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'youtube'
  | 'behance'
  | 'dribbble'
  | 'github'
  | 'tiktok'
  | 'pinterest'

export interface SeoSettings {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  twitterHandle?: string
  siteUrl?: string
  locale?: string
  themeColor?: string
}

export interface ThemeSettings {
  accentHex?: string
  heroEnabled?: boolean
  showTestimonials?: boolean
  showPricing?: boolean
  showBlog?: boolean
}

export interface SharedZoneBrand extends BrandSettings {
  faviconUrl?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export interface SharedZone {
  brand: SharedZoneBrand
  theme: ThemeSettings
  announcement: {
    enabled: boolean
    text: string
    href: string
    buttonText: string
  }
  contact: ContactSettings & { businessHours: string[] }
  socials: SocialLink[]
  trust: {
    clientCount: string
    projectsCount: string
    experienceYears: string
    rating: string
    stats: Array<{ id: string; value: string; label: string }>
    badges: string[]
    certifications: string[]
    awards: string[]
  }
  cta: CtaSettings
  footer: {
    tagline: string
    quickLinks: NavItem[]
    serviceLinks: NavItem[]
    offices: Array<{ id: string; city: string; address: string; phone?: string }>
    legalNote?: string
    copyrightText: string
    newsletter: {
      enabled: boolean
      heading: string
      description: string
      buttonText: string
      href: string
    }
  }
  seo: SeoSettings
}

/* -------------------------------------------------------------------------- */
/*  Collections                                                               */
/* -------------------------------------------------------------------------- */

export interface ServiceDoc extends DocMeta {
  slug: string
  title: string
  shortTitle?: string
  excerpt: string
  description: string
  icon: string
  deliverables: string[]
  features: string[]
  startingPrice?: number
  accentHex?: string
  featured?: boolean
  seo?: SeoFields
}

export interface ProjectMetric {
  id: string
  value: string
  label: string
}

export interface ProjectDoc extends DocMeta {
  slug: string
  title: string
  client: string
  category: string
  services: string[]
  excerpt: string
  /** Markdown-ish rich body used on the detail page. */
  challenge: string
  approach: string
  outcome: string
  coverImage: string
  gallery: Array<{ id: string; url: string; caption?: string }>
  /** Short marks for the "meta" column on the detail page. */
  meta: Array<{ id: string; label: string; value: string }>
  metrics: ProjectMetric[]
  testimonial?: TestimonialDoc
  featured: boolean
  year?: string
  liveUrl?: string
  seo?: SeoFields
}

export interface BlogPostDoc extends DocMeta {
  slug: string
  title: string
  excerpt: string
  /** Body is Markdown rendered with a small safe subset renderer. */
  content: string
  coverImage: string
  tags: string[]
  category: string
  author: AuthorRef
  readMinutes: number
  featured: boolean
  seo?: SeoFields
}

export interface AuthorRef {
  name: string
  role: string
  avatarUrl?: string
  bio?: string
}

export interface PricingPlanDoc extends DocMeta {
  name: string
  tagline: string
  price: number
  currency: string
  period: string
  features: string[]
  highlighted: boolean
  ctaLabel: string
  ctaHref: string
  badge?: string
  /** Set for "Contact us" style plans. */
  custom?: boolean
}

export interface TestimonialDoc extends DocMeta {
  quote: string
  name: string
  role: string
  company: string
  avatarUrl?: string
  rating: number
  featured: boolean
  projectSlug?: string
}

export interface ProcessStepDoc extends DocMeta {
  number: string
  title: string
  description: string
  deliverables: string[]
}

export interface ValuePropDoc extends DocMeta {
  title: string
  description: string
  icon: string
  stat?: string
  statLabel?: string
}

export interface StatDoc extends DocMeta {
  value: string
  label: string
}

export interface FaqDoc extends DocMeta {
  question: string
  answer: string
}

export interface TeamMemberDoc extends DocMeta {
  name: string
  role: string
  bio: string
  avatarUrl?: string
  specialty: string[]
  linkedin?: string
  twitter?: string
}

export interface ClientLogoDoc extends DocMeta {
  name: string
  url?: string
}

export interface NavItem {
  label: string
  href: string
}

export interface AwardDoc extends DocMeta {
  title: string
  organisation: string
  year: string
  href?: string
}

/* -------------------------------------------------------------------------- */
/*  Aggregated site content                                                  */
/* -------------------------------------------------------------------------- */

export interface SiteContent {
  brand: BrandSettings
  hero: HeroSettings
  cta: CtaSettings
  contact: ContactSettings
  socials: SocialLink[]
  seo: SeoSettings
  theme: ThemeSettings
  navigation: NavItem[]
  /** Canonical site-wide content, projected into the legacy page settings above. */
  sharedZone?: SharedZone
  footer: {
    tagline: string
    offices: Array<{ id: string; city: string; address: string; phone?: string }>
    legalNote?: string
  }
}

export interface AboutContent {
  values: ValuePropDoc[]
  stats: StatDoc[]
  team: TeamMemberDoc[]
  clients: ClientLogoDoc[]
  awards: AwardDoc[]
  process: ProcessStepDoc[]
  faqs: FaqDoc[]
}

/* -------------------------------------------------------------------------- */
/*  Contact form (submissions)                                               */
/* -------------------------------------------------------------------------- */

export type InquiryStatus = 'new' | 'read' | 'archived'

export interface ContactSubmissionDoc {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  budget?: string
  services?: string[]
  message: string
  status: InquiryStatus
  createdAt: string | null
  updatedAt: string | null
}

/** Publicly readable agency settings and the concrete Firestore record models. */
export type SiteSettings = SiteContent
export type Service = ServiceDoc
export type Project = ProjectDoc
export type BlogPost = BlogPostDoc
export type Testimonial = TestimonialDoc
export type PricingPlan = PricingPlanDoc
export type ContactMessage = ContactSubmissionDoc

/** Client-side view of an authenticated admin account and its verified claim. */
export interface Admin {
  uid: string
  email: string
  displayName: string
  photoUrl: string | null
  isAdmin: boolean
  isPending: boolean
}

export interface InquiryFormValues {
  name: string
  email: string
  phone?: string
  company?: string
  budget?: string
  services: string[]
  message: string
  /** Honeypot — must stay empty. */
  website?: string
}
