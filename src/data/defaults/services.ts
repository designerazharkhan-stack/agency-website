import type { ServiceDoc } from '@/types/content'

/**
 * Default service catalogue — the six disciplines the agency sells.
 *
 * Used as the offline fallback for the public site and as the seed payload for
 * the `/admin` → "Seed content" action. Editing these values in the dashboard
 * never touches this file; Firestore becomes the source of truth once seeded.
 */
export const defaultServices: ServiceDoc[] = [
  {
    id: 'svc-web-development',
    slug: 'web-development',
    title: 'Web Development',
    shortTitle: 'Web Dev',
    excerpt:
      'Hand-built marketing and platform websites engineered for Core Web Vitals, accessibility and a conversion rate you can defend in a board deck.',
    description:
      'Design and engineering sit in the same senior team, so nothing is lost in a handover. We prototype in the browser, test on real Android and iOS devices, and ship a component library your own developers can extend without calling us. Performance and accessibility budgets are agreed before the first page is designed, and enforced in CI on every pull request.',
    icon: 'code',
    deliverables: [
      'Technical architecture and content model',
      'Responsive, mobile-first build',
      'Component library and design tokens',
      'Headless CMS integration (Sanity, Contentful, Payload)',
      'Core Web Vitals and Lighthouse budget',
      'CI pipeline, preview deploys and rollback',
    ],
    features: [
      'React, TypeScript and Next.js delivery',
      'WCAG 2.2 AA accessibility baseline',
      'Lighthouse 95+ on every template at launch',
      'Analytics, consent and conversion event tracking',
    ],
    startingPrice: 12000,
    accentHex: '#C29A3C',
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: 'svc-wordpress-development',
    slug: 'wordpress-development',
    title: 'WordPress Development',
    shortTitle: 'WordPress',
    excerpt:
      'Bespoke WordPress builds — custom blocks, clean architecture and a genuinely usable editor — for teams who need to publish without a developer.',
    description:
      'Most WordPress problems are editorial problems dressed up as technical ones. We build on a lean custom theme with block patterns your writers actually use, keep the plugin count low enough to keep you fast, and hand over documentation that a new hire can act on. Hosting, migrations and staging environments are set up properly rather than improvised.',
    icon: 'layout',
    deliverables: [
      'Custom theme built on the block editor',
      'Reusable block patterns and field templates',
      'ACF or native block field architecture',
      'Staging, backup and migration plan',
      'Core Web Vitals and security hardening',
      'Editor training and written documentation',
    ],
    features: [
      'No page-builder lock-in',
      'Editorial workflow with preview and scheduled posts',
      'Managed hosting, backups and uptime monitoring',
      'Core Web Vitals above 90 on real mobile hardware',
    ],
    startingPrice: 6500,
    accentHex: '#DFC884',
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: 'svc-ui-ux-design',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    shortTitle: 'UI/UX',
    excerpt:
      'Research, flows and interface design for products people are forced to use every day. Retention over applause.',
    description:
      'We work inside your product reality — the constraints, the backlog and the release train. Research sprints feed directly into shipped increments, with measurable success criteria agreed before the first wireframe leaves the whiteboard. Every screen is designed mobile-first, documented with specs your engineers can build from, and reviewed in the browser rather than in a slide.',
    icon: 'pen-tool',
    deliverables: [
      'Usability research and interviews',
      'Information architecture and user flows',
      'Wireframes and interactive prototypes',
      'High-fidelity UI for web and mobile',
      'Design system with tokens and components',
      'Design QA and accessibility review during build',
    ],
    features: [
      'Prototypes tested with real users',
      'WCAG 2.2 AA contrast and target sizing',
      'Design QA on every sprint, not at launch',
      'Handover with specs, tokens and user stories',
    ],
    startingPrice: 9000,
    accentHex: '#EBDCB0',
    featured: true,
    published: true,
    order: 3,
  },
  {
    id: 'svc-seo',
    slug: 'seo',
    title: 'SEO',
    shortTitle: 'SEO',
    excerpt:
      'Technical SEO, topical authority and content systems that compound — not a monthly report full of vanity rankings.',
    description:
      'Search is an engineering problem before it is a content problem. We fix crawlability, structured data, internal linking and Core Web Vitals first, then build the topical authority your audience actually rewards. Reporting is in sessions, pipeline and revenue; rank tracking is a diagnostic, not the deliverable.',
    icon: 'search',
    deliverables: [
      'Technical audit and remediation plan',
      'Keyword and search-intent architecture',
      'Internal linking and information architecture',
      'Structured data and rich-result implementation',
      'Content briefs, production and editorial calendar',
      'Local and multi-location SEO where relevant',
    ],
    features: [
      'Zero duplicate content through migrations',
      'Sitemaps, canonicals and redirect maps enforced',
      'Human editorial — no AI filler',
      'Transparent reporting on traffic and revenue',
    ],
    startingPrice: 4500,
    accentHex: '#A67C2A',
    featured: true,
    published: true,
    order: 4,
  },
  {
    id: 'svc-ecommerce',
    slug: 'ecommerce',
    title: 'E-commerce',
    shortTitle: 'E-commerce',
    excerpt:
      'Stores engineered for revenue: fast product pages, honest merchandising, and checkouts that do not leak the sale.',
    description:
      'We build stores that survive contact with real customers — heavy catalogues, awkward variants, international tax, and the mobile checkout that decides whether you get the order. Platform choice follows your operational reality, and the build keeps your team in control of merchandising rather than dependent on us.',
    icon: 'boxes',
    deliverables: [
      'Store architecture and catalogue model',
      'Shopify, WooCommerce or headless commerce build',
      'Product, collection and search experience',
      'Checkout, payments, tax and shipping configuration',
      'CRM, email and analytics integration',
      'Conversion testing roadmap',
    ],
    features: [
      'Sub-two-second product pages on 4G mobile',
      'Structured data for rich results',
      'Abandoned recovery and lifecycle email flows',
      'Monthly revenue and funnel reporting',
    ],
    startingPrice: 14000,
    accentHex: '#C29A3C',
    featured: true,
    published: true,
    order: 5,
  },
  {
    id: 'svc-website-maintenance',
    slug: 'website-maintenance',
    title: 'Website Maintenance',
    shortTitle: 'Maintenance',
    excerpt:
      'A guaranteed monthly rhythm of updates, security patching, uptime monitoring and performance work for sites already in production.',
    description:
      'A launch is a date, not a finish line. We keep the site patched, backed up, monitored and fast — with a fixed monthly rhythm, a named engineer and same-day response on anything customer-facing. Optional, cancellable with thirty days notice, and we never hold a site hostage to a support contract.',
    icon: 'shield-check',
    deliverables: [
      'Security patching and dependency updates',
      'Daily backups with tested restore',
      'Uptime, error and performance monitoring',
      'Content and design change requests',
      'Monthly health and performance report',
      'Priority response on critical issues',
    ],
    features: [
      'Same-day response on critical incidents',
      'Monthly capacity included, never overage-billed',
      'Quarterly roadmap reset',
      'Transparent hours reporting',
    ],
    startingPrice: 900,
    accentHex: '#846020',
    featured: true,
    published: true,
    order: 6,
  },
]
