import type {
  AwardDoc,
  ClientLogoDoc,
  FaqDoc,
  ProcessStepDoc,
  SiteContent,
  StatDoc,
  TeamMemberDoc,
  ValuePropDoc,
} from '@/types/content'

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

/* -------------------------------------------------------------------------- */
/*  Site-wide singleton settings                                              */
/* -------------------------------------------------------------------------- */

export const defaultSite: SiteContent = {
  brand: {
    siteName: 'Agency Website',
    logoMarkUrl: undefined,
    logoUrl: undefined,
    tagline: 'Digital agency',
    description:
      'Agency Website is an independent digital agency for organisations whose work deserves a better introduction. Websites, stores, content and care — engineered, not decorated.',
    foundedYear: '2014',
  },
  hero: {
    eyebrow: 'Independent agency · Est. 2014',
    headlineLine1: 'We build the reasons',
    headlineAccent: 'people choose you',
    subheadline:
      'Brand, product and digital work for organisations whose quality is hard to see from the outside. Senior-only teams, fixed scope, outcomes we put in writing.',
    primaryCtaLabel: 'Start a project',
    primaryCtaHref: '/contact',
    secondaryCtaLabel: 'See our work',
    secondaryCtaHref: '/portfolio',
    imageUrl: img('photo-1531973576160-7125cd663d86'),
    stats: [
      { id: 's1', value: '120+', label: 'Projects delivered' },
      { id: 's2', value: '11', label: 'Years independent' },
      { id: 's3', value: '94%', label: 'Clients return' },
      { id: 's4', value: '4.9/5', label: 'Average rating' },
    ],
    marquee: [
      'Brand Strategy',
      'Visual Identity',
      'Web Design',
      'Product & UX',
      'Motion & 3D',
      'Content & Search',
      'Growth & Conversion',
      'Embedded Engineering',
    ],
  },
  cta: {
    eyebrow: 'Available for Q3 2026',
    headline: 'Bring us the thing you are not sure about.',
    body: 'Two weeks from first conversation to a direction you can show your board. No charge, no obligation, and we will tell you honestly if we are the wrong studio for it.',
    buttonLabel: 'Start the conversation',
    buttonHref: '/contact',
  },
  contact: {
    email: 'hello@agencywebsite.com',
    phone: '+1 (415) 555-0182',
    addressLine1: '417 Montgomery Street',
    addressLine2: 'Suite 1200',
    city: 'San Francisco',
    country: 'United States',
    availabilityNote: 'Currently booking projects for Q3 2026. Retainers available sooner.',
    whatsapp: '+14155550182',
    mapUrl: 'https://maps.google.com/?q=417+Montgomery+Street+San+Francisco',
  },
  socials: [
    { id: 'so-1', label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { id: 'so-2', label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { id: 'so-3', label: 'Behance', href: 'https://behance.net', icon: 'behance' },
    { id: 'so-4', label: 'Dribbble', href: 'https://dribbble.com', icon: 'dribbble' },
    { id: 'so-5', label: 'X', href: 'https://x.com', icon: 'twitter' },
  ],
  seo: {
    title: 'Agency Website — Digital Agency',
    description:
      'Agency Website is an independent digital agency building websites, stores and content for organisations whose quality is hard to see from the outside.',
    keywords: [
      'brand strategy studio',
      'design agency San Francisco',
      'website design agency',
      'product design studio',
      'luxury brand identity',
      'digital studio',
    ],
    ogImage: img('photo-1558655146-9f40138edfeb', 1200),
    twitterHandle: '@agencywebsite',
    siteUrl: 'https://agency-website.web.app',
    locale: 'en_US',
    themeColor: '#050505',
  },
  theme: {
    accentHex: '#C29A3C',
    heroEnabled: true,
    showTestimonials: true,
    showPricing: true,
    showBlog: true,
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: {
    tagline: 'Design, product and digital work for organisations whose quality is hard to see from the outside.',
    offices: [
      {
        id: 'of-1',
        city: 'San Francisco',
        address: '417 Montgomery Street, Suite 1200',
        phone: '+1 (415) 555-0182',
      },
      {
        id: 'of-2',
        city: 'Lisbon',
        address: 'Rua do Alecrim 41, 1200-014',
        phone: '+351 21 555 0199',
      },
    ],
    legalNote: 'Independent and founder-owned since 2014. We take on twelve projects a year.',
  },
}

/* -------------------------------------------------------------------------- */
/*  About / process / values                                                  */
/* -------------------------------------------------------------------------- */

export const defaultValues: ValuePropDoc[] = [
  {
    id: 'val-senior',
    title: 'Senior people, on the actual work',
    description:
      'The people in the pitch are the people in the file. No account layer, no handover to a team you never met, no juniors billed at senior rates.',
    icon: 'users',
    stat: '0',
    statLabel: 'Account managers between you and the work',
    published: true,
    order: 1,
  },
  {
    id: 'val-scope',
    title: 'Scope and price agreed up front',
    description:
      'Fixed fee, written deliverables, named timeline. If the scope changes, we tell you what it costs before we do it — never after.',
    icon: 'file-check',
    stat: '100%',
    statLabel: 'Projects delivered to written scope',
    published: true,
    order: 2,
  },
  {
    id: 'val-outcomes',
    title: 'Outcomes in writing',
    description:
      'Every engagement starts with the metric we intend to move and a baseline measurement. If we miss it, that is our problem to explain, not yours to discover.',
    icon: 'target',
    stat: '94%',
    statLabel: 'Clients who commission us again',
    published: true,
    order: 3,
  },
  {
    id: 'val-craft',
    title: 'Craft over throughput',
    description:
      'Twelve projects a year, maximum. We would rather decline a thirteenth than ship something with our name on it that we would not put our name on.',
    icon: 'gem',
    stat: '12',
    statLabel: 'Projects accepted per year',
    published: true,
    order: 4,
  },
  {
    id: 'val-handover',
    title: 'You own everything',
    description:
      'Full source access, documented systems, recorded training. The best outcome is that you do not need us, and several clients have reached it.',
    icon: 'key-round',
    stat: '100%',
    statLabel: 'Source and asset ownership transferred',
    published: true,
    order: 5,
  },
  {
    id: 'val-honest',
    title: 'We will tell you when not to',
    description:
      'Sometimes the right answer is a template, a hire, or nothing. We have referred projects away rather than bill for work you do not need.',
    icon: 'circle-slash',
    stat: '4',
    statLabel: 'Projects declined as a bad fit this year',
    published: true,
    order: 6,
  },
]

export const defaultStats: StatDoc[] = [
  { id: 'st-1', value: '120+', label: 'Projects delivered', published: true, order: 1 },
  { id: 'st-2', value: '11', label: 'Years independent', published: true, order: 2 },
  { id: 'st-3', value: '94%', label: 'Clients who return', published: true, order: 3 },
  { id: 'st-4', value: '38', label: 'People in the network', published: true, order: 4 },
]

export const defaultProcess: ProcessStepDoc[] = [
  {
    id: 'step-1',
    number: '01',
    title: 'Listen',
    description:
      'Two weeks, mostly other people\'s voices. Stakeholder interviews, customer interviews including the ones who left, and a forensic look at everything you have already tried.',
    deliverables: [
      'Discovery interviews and synthesis',
      'Category and competitor audit',
      'Current-state performance baseline',
      'Written problem definition',
    ],
    published: true,
    order: 1,
  },
  {
    id: 'step-2',
    number: '02',
    title: 'Define',
    description:
      'We write the strategy before anything is drawn. Positioning, messaging, and the specific metric we are going to move — signed off by the people who own it.',
    deliverables: [
      'Positioning platform',
      'Messaging framework',
      'Information architecture',
      'Success metrics and baseline',
    ],
    published: true,
    order: 2,
  },
  {
    id: 'step-3',
    number: '03',
    title: 'Make',
    description:
      'Design and engineering run in parallel from week one, not in sequence. Weekly working sessions, a live prototype you can open on any device, and no reveal theatre at the end.',
    deliverables: [
      'Weekly working sessions',
      'Live browser prototype',
      'Production build in CI from day one',
      'Accessibility and performance budgets',
    ],
    published: true,
    order: 3,
  },
  {
    id: 'step-4',
    number: '04',
    title: 'Launch',
    description:
      'We handle the unglamorous parts: migration, redirects, analytics, consent, training, documentation, and a launch window that does not include a weekend.',
    deliverables: [
      'Migration and redirect plan',
      'Analytics and consent setup',
      'Team training and documentation',
      '30-day post-launch monitoring',
    ],
    published: true,
    order: 4,
  },
  {
    id: 'step-5',
    number: '05',
    title: 'Prove',
    description:
      'Ninety days after launch we come back with the numbers we committed to, in a format your board reads without translation.',
    deliverables: [
      '90-day performance review',
      'Attributed revenue reporting',
      'Prioritised iteration roadmap',
      'Support and retainer options',
    ],
    published: true,
    order: 5,
  },
]

export const defaultTeam: TeamMemberDoc[] = [
  {
    id: 'tm-elena',
    name: 'Elena Marchetti',
    role: 'Founder & Strategy Director',
    bio: 'Fourteen years in digital strategy before founding the studio. Leads positioning work and every first conversation. Believes the shortest route to a good brand is the most uncomfortable research.',
    avatarUrl: img('photo-1494790108377-be9c29b29330', 700),
    specialty: ['Brand strategy', 'Positioning', 'Verbal identity'],
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    published: true,
    order: 1,
  },
  {
    id: 'tm-marcus',
    name: 'Marcus Adeyemi',
    role: 'Design Director',
    bio: 'Ex-typeface designer turned interface designer. Owns the studio standard for restraint and has rejected more client requests than he has accepted.',
    avatarUrl: img('photo-1507003211169-0a1dd7228f2d', 700),
    specialty: ['Visual identity', 'Editorial design', 'Design systems'],
    linkedin: 'https://linkedin.com',
    published: true,
    order: 2,
  },
  {
    id: 'tm-ines',
    name: 'Inés Carvalho',
    role: 'Head of Engineering',
    bio: 'Fifteen years building production systems, most of them for companies that could not afford a rewrite. Treats bundle size as a design material.',
    avatarUrl: img('photo-1544005313-94ddf0286df2', 700),
    specialty: ['Frontend architecture', 'Performance', 'Accessibility'],
    linkedin: 'https://linkedin.com',
    published: true,
    order: 3,
  },
  {
    id: 'tm-julian',
    name: 'Julian Marsh',
    role: 'Strategy Partner',
    bio: 'Former operator who ran growth at two B2B companies through the messy middle. Leads the commercial argument before any of the design starts.',
    avatarUrl: img('photo-1500648767791-00dcc994a43e', 700),
    specialty: ['Go-to-market', 'Growth strategy', 'Research'],
    linkedin: 'https://linkedin.com',
    published: true,
    order: 4,
  },
  {
    id: 'tm-yuki',
    name: 'Yuki Tanaka',
    role: 'Motion & 3D Lead',
    bio: 'Cinema 4D and Houdini, five years of product films for brands that do not advertise on television. Believes restraint should be visible in the frame rate.',
    avatarUrl: img('photo-1517841905240-472988babdf9', 700),
    specialty: ['3D', 'Motion identity', 'Product film'],
    published: true,
    order: 5,
  },
  {
    id: 'tm-ade',
    name: 'Ade Balogun',
    role: 'Technical Director',
    bio: 'Accessibility specialist and recovering CTO. Writes the part of the specification nobody wants to and every client is glad they did.',
    avatarUrl: img('photo-1472099645785-5658abf4ff4e', 700),
    specialty: ['Accessibility', 'CMS architecture', 'QA'],
    published: true,
    order: 6,
  },
]

export const defaultClients: ClientLogoDoc[] = [
  { id: 'cl-1', name: 'Meridian Private Bank', published: true, order: 1 },
  { id: 'cl-2', name: 'Atlas Ventures', published: true, order: 2 },
  { id: 'cl-3', name: 'Verdant Supply Co.', published: true, order: 3 },
  { id: 'cl-4', name: 'Halcyon House', published: true, order: 4 },
  { id: 'cl-5', name: 'Kinetic Mobility', published: true, order: 5 },
  { id: 'cl-6', name: 'Northline Architecture', published: true, order: 6 },
  { id: 'cl-7', name: 'Sable Atelier', published: true, order: 7 },
  { id: 'cl-8', name: 'Macro Logistics', published: true, order: 8 },
  { id: 'cl-9', name: 'Nocturne', published: true, order: 9 },
  { id: 'cl-10', name: 'Kestrel Health', published: true, order: 10 },
]

export const defaultAwards: AwardDoc[] = [
  {
    id: 'aw-1',
    title: 'Site of the Year — Commerce',
    organisation: 'Awwwards',
    year: '2025',
    published: true,
    order: 1,
  },
  {
    id: 'aw-2',
    title: 'Best Luxury Digital Experience',
    organisation: 'Webby Awards',
    year: '2025',
    published: true,
    order: 2,
  },
  {
    id: 'aw-3',
    title: 'Design Agency of the Year — Finalist',
    organisation: 'D&AD',
    year: '2025',
    published: true,
    order: 3,
  },
  {
    id: 'aw-4',
    title: 'Agency of the Year, Boutique',
    organisation: 'The Drum',
    year: '2024',
    published: true,
    order: 4,
  },
]

export const defaultFaqs: FaqDoc[] = [
  {
    id: 'faq-1',
    question: 'What size projects do you take on?',
    answer:
      'Typically $12,000 to $150,000. Below that we are usually the wrong answer — we will tell you so and, where we can, point you at someone better suited. Above it, we will usually propose breaking the work into phases.',
    published: true,
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'How long does a typical engagement take?',
    answer:
      'A site or brand rebuild runs six to fourteen weeks. Embedded partnerships run quarterly. We do not compress timelines for launch dates that were set before the work began — that is how quality gets sacrificed quietly.',
    published: true,
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'Who actually does the work?',
    answer:
      'A senior designer, a senior engineer and a strategist, with specialist support for motion and 3D where needed. The people you meet in the pitch are the people in the file. We do not run a junior delivery team.',
    published: true,
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'What does it cost, and how do you price?',
    answer:
      'Fixed fee against written deliverables. We will not quote without understanding scope, and we will not change the number without telling you first and explaining what moved. Retainers are monthly and cancellable with thirty days notice.',
    published: true,
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'What do you need from us?',
    answer:
      'One decision-maker with authority, roughly four hours a week, and access to customers or past customers. That last one matters more than people expect — most projects stall because nobody would let us interview their users.',
    published: true,
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'Who owns the work when it is finished?',
    answer:
      'You do — completely. Full source access, all assets, documented systems and recorded training. We ask for permission to show the work in our portfolio and to name you, and we respect a no without asking twice.',
    published: true,
    order: 6,
  },
  {
    id: 'faq-7',
    question: 'Can you work with our existing developers?',
    answer:
      'Often that is the better arrangement. We can run design and front-end direction while your team implements, or embed alongside them. Both are routine and neither requires you to replace anyone.',
    published: true,
    order: 7,
  },
  {
    id: 'faq-8',
    question: 'Do you do maintenance after launch?',
    answer:
      'We offer a care retainer with a guaranteed monthly rhythm and same-day response on critical issues. It is optional, and roughly a third of clients take it. We do not hold sites hostage to a support contract.',
    published: true,
    order: 8,
  },
]
