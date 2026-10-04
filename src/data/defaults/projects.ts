import type { ProjectDoc } from '@/types/content'

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const defaultProjects: ProjectDoc[] = [
  {
    id: 'prj-meridian',
    slug: 'meridian-private-bank',
    title: 'A private bank that finally feels private',
    client: 'Meridian Private Bank',
    category: 'Web Development',
    services: ['Web Development', 'UI/UX Design', 'SEO'],
    excerpt:
      'A 90-year-old private bank with 40,000 clients and a website that looked like a 2009 template. We rebuilt trust from the typography up.',
    challenge:
      'Meridian had the balance sheet of a fortress and the digital presence of a fax machine. Sixty per cent of new wealth enquiries were arriving through relationship managers who were embarrassed to send a link. Internal NPS for the brand itself had flatlined for three years, and the compliance team had vetoed every attempt to modernise the tone for fear of regulatory scrutiny.',
    approach:
      'We spent three weeks inside the private client floor — sitting in appointments, reading relationship manager scripts, and interviewing 22 clients about why they stayed. The insight was uncomfortable: clients valued the bank for a specific, almost counter-intuitive reason — it was slow. But nothing about the experience communicated deliberateness; it communicated neglect.\n\nThe strategy reframed slowness as "considered access" and gave us permission to strip everything non-essential. The identity is built on a single warm serif, an enormous amount of white space, and photography of hands, buildings and paper rather than the mandatory smiling-tower stock. The site runs on a headless CMS with a 38-component library, and every claim passes a compliance review gate built into the editorial workflow.',
    outcome:
      'Within one quarter of launch, online account-opening journeys had tripled and the share of new enquiries initiated digitally rose from 18% to 46%. Time on the enquiry page more than doubled. The brand now runs a 22-page guideline that compliance signed off on, which unblocked every subsequent request.',
    coverImage: img('photo-1486406146926-c627a92ad1ab'),
    gallery: [
      { id: 'g1', url: img('photo-1493397212122-2b85dda8106b', 1400), caption: 'Editorial grid and typography system' },
      { id: 'g2', url: img('photo-1600607687939-ce8a6c25118c', 1400), caption: 'Private client suite wayfinding' },
      { id: 'g3', url: img('photo-1519345182560-3f2917c472ef', 1400), caption: 'Building photography direction' },
      { id: 'g4', url: img('photo-1523726491678-bf852e717f6a', 1400), caption: 'Component library in Figma' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Financial services' },
      { id: 'm2', label: 'Engagement', value: '9 months' },
      { id: 'm3', label: 'Team', value: '7 specialists' },
      { id: 'm4', label: 'Year', value: '2025' },
    ],
    metrics: [
      { id: 'x1', value: '+155%', label: 'Online account openings' },
      { id: 'x2', value: '2.4×', label: 'Time on enquiry page' },
      { id: 'x3', value: '99', label: 'Lighthouse performance' },
      { id: 'x4', value: '22pg', label: 'Compliance-approved guide' },
    ],
    testimonial: {
      id: 'tst-meridian',
      quote:
        'They understood that our clients buy slowness — then found a way to make it look intentional instead of broken. Nothing has moved this fast in a decade of measured change.',
      name: 'Helena Brandt',
      role: 'Chief Marketing Officer',
      company: 'Meridian Private Bank',
      avatarUrl: img('photo-1573496359142-b8d87734a5a2', 400),
      rating: 5,
      featured: true,
      order: 1,
    },
    featured: true,
    published: true,
    year: '2025',
    order: 1,
    seo: {
      title: 'Meridian Private Bank — Brand & Web Redesign',
      description:
        'How the agency rebuilt a 90-year-old private bank around considered access, tripling digital account openings in one quarter.',
    },
  },
  {
    id: 'prj-nocturne',
    slug: 'nocturne-architectural-lighting',
    title: 'Light as the primary material',
    client: 'Nocturne',
    category: 'E-commerce',
    services: ['E-commerce', 'Web Development', 'UI/UX Design'],
    excerpt:
      'A lighting designer with cult status in the architecture world and a storefront that showed nothing of it. We built the unboxing as carefully as the fixtures.',
    challenge:
      'Nocturne commissions are made in conversations, not online. The existing shop was a functional checkout bolted onto a PDF catalogue — technically working, aesthetically insulting to a studio whose clients include three Pritzker laureates. Repeat purchase was near zero because nobody outside the trade knew the brand existed.',
    approach:
      'We treated light as a material with physical behaviour and built the entire site around it: full-bleed renders that respond to scroll position, a configurator where you can dial colour temperature and see the fixture respond, and 3D product renders so accurate the catalogue photography became redundant.\n\nThe identity is deliberately quiet — a near-black wordmark, a single warm accent lifted from the 2700K filament colour, and typography with generous tracking. Copy is written in the first person of a studio, not the third person of a brand.',
    outcome:
      'Trade enquiries tripled in six months and the configurator became the single most shared page on the site. Studio-to-studio referrals now arrive with a link already attached. The 2700K accent has become so recognisable that distributors use it as a shorthand for the brand.',
    coverImage: img('photo-1524230572899-a752b3835840'),
    gallery: [
      { id: 'g1', url: img('photo-1600210492486-724fe5c67fb0', 1400), caption: 'Configurator lighting simulation' },
      { id: 'g2', url: img('photo-1615874959474-d609969a20ed', 1400), caption: '3D product rendering pipeline' },
      { id: 'g3', url: img('photo-1618221195710-dd6b41faaea6', 1400), caption: 'Editorial product stories' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Architectural lighting' },
      { id: 'm2', label: 'Engagement', value: '5 months' },
      { id: 'm3', label: 'Team', value: '5 specialists' },
      { id: 'm4', label: 'Year', value: '2025' },
    ],
    metrics: [
      { id: 'x1', value: '3.1×', label: 'Trade enquiries' },
      { id: 'x2', value: '+410%', label: 'Organic sessions' },
      { id: 'x3', value: '68%', label: 'Configurator completion' },
      { id: 'x4', value: '0', label: 'Catalogues printed' },
    ],
    featured: true,
    published: true,
    year: '2025',
    order: 2,
    seo: {
      title: 'Nocturne — Architectural Lighting Brand & Store',
      description:
        'Building a digital flagship for an architectural lighting studio, with a lighting configurator and photoreal 3D renders.',
    },
  },
  {
    id: 'prj-verdant',
    slug: 'verdant-supply-co',
    title: 'Making soil science legible',
    client: 'Verdant Supply Co.',
    category: 'UI/UX Design',
    services: ['UI/UX Design', 'Web Development', 'E-commerce'],
    excerpt:
      'A 40-year-old agronomy business whose diagnostic tool was a paper chart folded in three. We turned it into software growers actually recommend.',
    challenge:
      'Verdant sells soil remediation to growers who cannot afford a wrong recommendation. Their diagnostic tool was a laminated tri-fold chart last updated in 1986, and their in-house agronomists spent roughly 40 hours a week answering the same 30 questions by phone. Meanwhile their e-commerce store, built by a vendor in 2011, converted at 0.4% and generated support tickets nobody could attribute.',
    approach:
      'We began by digitising the agronomists\' mental models rather than the chart itself. Structured interviews with eleven specialists became a rules engine with 340 weighted inputs and a visible confidence score — growers see why they got a recommendation, not just what it is.\n\nThe product ships as a progressive web app with an offline-first architecture, because half the target market works in fields with no signal. We rebuilt the storefront on the same design system and instrumented the entire funnel, which finally gave the agronomy team the data they had been asking for since 2015.',
    outcome:
      'The phone support line dropped 71% in the first quarter. Diagnostic completion rate reached 84% against a 22% baseline for paper. Store conversion rose from 0.4% to 2.3%, and the tool is now the largest source of inbound demos.',
    coverImage: img('photo-1464226184884-fa280b87c399'),
    gallery: [
      { id: 'g1', url: img('photo-1464226184884-fa280b87c399', 1400), caption: 'Offline-first diagnostic flow' },
      { id: 'g2', url: img('photo-1498050108023-c5249f4df085', 1400), caption: 'Rules engine confidence output' },
      { id: 'g3', url: img('photo-1521737711867-e3b97375f902', 1400), caption: 'Agronomist co-design sessions' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Agriculture' },
      { id: 'm2', label: 'Engagement', value: '11 months' },
      { id: 'm3', label: 'Team', value: '8 specialists' },
      { id: 'm4', label: 'Year', value: '2024' },
    ],
    metrics: [
      { id: 'x1', value: '-71%', label: 'Support call volume' },
      { id: 'x2', value: '84%', label: 'Diagnostic completion' },
      { id: 'x3', value: '5.7×', label: 'Store conversion' },
      { id: 'x4', value: '340', label: 'Weighted inputs' },
    ],
    testimonial: {
      id: 'tst-verdant',
      quote:
        'Every previous agency wanted to redesign our logo. This one spent three weeks in a tractor cab with our agronomists and rebuilt the actual product. The support line finally went quiet.',
      name: 'Dr. Ronan Ellis',
      role: 'Managing Director',
      company: 'Verdant Supply Co.',
      avatarUrl: img('photo-1472099645785-5658abf4ff4e', 400),
      rating: 5,
      featured: true,
      order: 2,
    },
    featured: true,
    published: true,
    year: '2024',
    order: 3,
    seo: {
      title: 'Verdant Supply Co. — Soil Diagnostic Product',
      description:
        'Turning a 1986 laminated soil chart into an offline-first diagnostic product, cutting support volume by 71%.',
    },
  },
  {
    id: 'prj-atlas',
    slug: 'atlas-corporate-ventures',
    title: 'One brand, forty-two companies',
    client: 'Atlas Ventures',
    category: 'WordPress Development',
    services: ['WordPress Development', 'UI/UX Design', 'Website Maintenance'],
    excerpt:
      'A venture firm that needed a parent identity flexible enough to hold a portfolio without flattening every company in it.',
    challenge:
      'Atlas had made 38 acquisitions in six years and its brand had become a coat of arms with the serial number filed off. Portfolio companies were given template landing pages that communicated nothing, and the firm had lost the one asset that mattered: a reputation for picking things that compound.',
    approach:
      'We built Atlas as a platform, not a logo. A single underlying system — grid, type scale, motion grammar, a colour-relationship model — with a documented set of permissible divergences. Each portfolio company receives an automatically generated but individually art-directed identity space derived from the parent system.\n\nThe engineering work was as substantial as the design: a token pipeline and component library consumed by 38 separate codebases, with automated sync so a change in the Atlas system propagates everywhere in a single release.',
    outcome:
      'All 38 portfolio companies were migrated in seven weeks. The firm now updates its own identity system without us, which was an explicit success criterion. Portfolio announcement pages consistently outperform the previous templates by a factor of three on engagement.',
    coverImage: img('photo-1497366216548-37526070297c'),
    gallery: [
      { id: 'g1', url: img('photo-1497215728101-856f4ea42174', 1400), caption: 'Platform system documentation' },
      { id: 'g2', url: img('photo-1497366754035-f200968a6e72', 1400), caption: 'Portfolio identity spaces' },
      { id: 'g3', url: img('photo-1497366811353-6870744d04b2', 1400), caption: 'Token pipeline and shared library' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Venture capital' },
      { id: 'm2', label: 'Engagement', value: '14 months' },
      { id: 'm3', label: 'Team', value: '9 specialists' },
      { id: 'm4', label: 'Year', value: '2024' },
    ],
    metrics: [
      { id: 'x1', value: '38', label: 'Companies migrated' },
      { id: 'x2', value: '7wks', label: 'Full rollout' },
      { id: 'x3', value: '3×', label: 'Engagement vs templates' },
      { id: 'x4', value: '100%', label: 'Client-owned handover' },
    ],
    featured: true,
    published: true,
    year: '2024',
    order: 4,
    seo: {
      title: 'Atlas Ventures — Portfolio Brand Platform',
      description:
        'A multi-brand platform system for a venture firm holding 38 portfolio companies, delivered as tokens and components.',
    },
  },
  {
    id: 'prj-halcyon',
    slug: 'halcyon-house',
    title: 'Hospitality, without the stock smiles',
    client: 'Halcyon House',
    category: 'SEO',
    services: ['SEO', 'Web Development', 'Website Maintenance'],
    excerpt:
      'A 31-room members club in Lisbon where every photograph looked like a stock photo of a hotel. Guests are paying for specificity.',
    challenge:
      'Halcyon opened with a brand built entirely on generic luxury codes — gold serif, generic lounge photograph, a website indistinguishable from six competitors. Post-occupancy research revealed something uncomfortable: guests liked the club and did not intend to return, because they could not remember it. The membership was beautiful and anonymous.',
    approach:
      'We went and documented what is actually there: a 1783 azulejo panel that survived a 1998 renovation, a courtyard that smells of orange blossom at 6am, and a kitchen run by a chef who will not write a menu down. The entire brand is built from archival and commissioned photography of those specific things — no interior was ever shot until we had established which rooms carried the story.\n\nThe tone is first person and unpolished by luxury convention: short sentences, occasional bluntness, prices in euros because nobody in Lisbon quotes in dollars.',
    outcome:
      'Direct bookings now account for 89% of stays, up from 34%, with the website as the primary channel. The club reached 71% member capacity within two quarters and has maintained a waitlist since. Organic search visibility for "private club Lisbon" moved from page four to a stable top three.',
    coverImage: img('photo-1600607687644-c7171b42498b'),
    gallery: [
      { id: 'g1', url: img('photo-1616486338812-3dadae4b4ace', 1400), caption: 'Archival detail series' },
      { id: 'g2', url: img('photo-1600607687920-4e2a09cf159d', 1400), caption: 'Membership journey' },
      { id: 'g3', url: img('photo-1600566753086-00f18fb6b3ea', 1400), caption: 'Editorial layout system' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Hospitality' },
      { id: 'm2', label: 'Engagement', value: '7 months' },
      { id: 'm3', label: 'Team', value: '6 specialists' },
      { id: 'm4', label: 'Year', value: '2025' },
    ],
    metrics: [
      { id: 'x1', value: '89%', label: 'Direct bookings' },
      { id: 'x2', value: '71%', label: 'Member capacity' },
      { id: 'x3', value: 'Top 3', label: 'Organic position' },
      { id: 'x4', value: '2 qtrs', label: 'To waitlist' },
    ],
    featured: false,
    published: true,
    year: '2025',
    order: 5,
    seo: {
      title: 'Halcyon House — Private Members Club',
      description:
        'Rebuilding a Lisbon members club around archival specificity instead of generic luxury codes. 89% direct bookings.',
    },
  },
  {
    id: 'prj-kinetic',
    slug: 'kinetic-mobility',
    title: 'Selling a fleet nobody has seen yet',
    client: 'Kinetic Mobility',
    category: 'UI/UX Design',
    services: ['UI/UX Design', 'Web Development'],
    excerpt:
      'A pre-revenue electric commercial vehicle company needed to sell trucks that will not exist for three years, to fleet buyers who will not buy on a rendering.',
    challenge:
      'Kinetic had a functioning prototype, a Series A, and a problem that renders cannot solve: fleet managers do not place six-figure orders on a video. Competitors were showing polished concept films that raised investment but converted nothing. Kinetic needed a purchase process for hardware that physically did not exist, without ever lying about the timeline.',
    approach:
      'We split the funnel honestly. Investors and press get the cinematic film. Fleet managers get a technical configurator, an honest manufacturing timeline with named risks, and a reservation flow with fully refundable deposits. The vehicle spec sheet is the primary conversion asset and it reads like an engineering document, not a brochure.\n\nThe 3D pipeline renders every configuration live from the same CAD source the engineering team uses, so a design change propagates to the configurator within a day.',
    outcome:
      'The configurator produced 240 qualified fleet reservations in its first ten weeks, which was the company\'s entire first-year allocation. Two national logistics operators converted to paid pilots, and the technical spec sheet was cited in both procurement processes.',
    coverImage: img('photo-1517245386807-bb43f82c33c4'),
    gallery: [
      { id: 'g1', url: img('photo-1492144534655-ae79c964c9d7', 1400), caption: 'Live 3D configurator' },
      { id: 'g2', url: img('photo-1549317661-bd32c8ce0db2', 1400), caption: 'Technical specification system' },
      { id: 'g3', url: img('photo-1551830820-330a71b99659', 1400), caption: 'Reservation and deposit flow' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Automotive' },
      { id: 'm2', label: 'Engagement', value: '8 months' },
      { id: 'm3', label: 'Team', value: '7 specialists' },
      { id: 'm4', label: 'Year', value: '2026' },
    ],
    metrics: [
      { id: 'x1', value: '240', label: 'Fleet reservations' },
      { id: 'x2', value: '10wks', label: 'To full allocation' },
      { id: 'x3', value: '2', label: 'Paid pilots signed' },
      { id: 'x4', value: '1 day', label: 'CAD to configurator' },
    ],
    featured: false,
    published: true,
    year: '2026',
    order: 6,
    seo: {
      title: 'Kinetic Mobility — EV Fleet Configurator',
      description:
        'A 3D fleet configurator and honest reservation flow for a commercial EV company with a three-year production timeline.',
    },
  },
  {
    id: 'prj-sable',
    slug: 'sable-atelier',
    title: 'A jewellery house without a showroom',
    client: 'Sable Atelier',
    category: 'E-commerce',
    services: ['E-commerce', 'UI/UX Design', 'SEO'],
    excerpt:
      'Eleven artisans, one ring each, and a store that treated bespoke work like a catalogue. We built the appointment funnel instead.',
    challenge:
      'Sable makes approximately 400 pieces a year, each one to order, each one beginning with a conversation. Their e-commerce site was a shop with no shop in it — visitors could not understand what bespoke meant, could not judge anything from a photograph of a 0.4-carat stone, and left after browsing a filter interface that had no filter to run.',
    approach:
      'We removed the storefront entirely and replaced it with a consultation experience. Every piece page opens with who made it, how long it takes, and a button to talk to that person. The photography was replaced with film: an artisan working, hands at the bench, light moving across metal. Commission tracking is a real interface with real states, which turned delivery anxiety into anticipation.',
    outcome:
      'Consultation requests rose from 3 per week to 40, and 31% of revenue now originates from a conversation rather than a product page. Average order value increased 64% because conversations qualify properly. Waiting list for commissions sits at 11 months.',
    coverImage: img('photo-1515562141207-7a88fb7ce338'),
    gallery: [
      { id: 'g1', url: img('photo-1605100804763-247f67b3557e', 1400), caption: 'Commissioned atelier film' },
      { id: 'g2', url: img('photo-1515562141207-7a88fb7ce338', 1400), caption: 'Consultation-first product pages' },
      { id: 'g3', url: img('photo-1599643478518-a784e5dc4c8f', 1400), caption: 'Commission tracking states' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Luxury jewellery' },
      { id: 'm2', label: 'Engagement', value: '6 months' },
      { id: 'm3', label: 'Team', value: '5 specialists' },
      { id: 'm4', label: 'Year', value: '2025' },
    ],
    metrics: [
      { id: 'x1', value: '13×', label: 'Consultation requests' },
      { id: 'x2', value: '+64%', label: 'Average order value' },
      { id: 'x3', value: '31%', label: 'Revenue from dialogue' },
      { id: 'x4', value: '11mo', label: 'Commission waitlist' },
    ],
    featured: false,
    published: true,
    year: '2025',
    order: 7,
    seo: {
      title: 'Sable Atelier — Bespoke Jewellery Consultation Commerce',
      description:
        'Replacing a catalogue store with a consultation-first experience for a bespoke atelier. 13× more enquiries.',
    },
  },
  {
    id: 'prj-ossuary',
    slug: 'northline-architecture',
    title: 'An architecture practice in two dimensions',
    client: 'Northline Architecture',
    category: 'Web Development',
    services: ['Web Development', 'UI/UX Design', 'SEO'],
    excerpt:
      'A practice with a Pritzker-adjacent reputation and a portfolio that presented buildings as flat rectangles. Drawings are their best work, so we let the drawings lead.',
    challenge:
      'Northline wins competitions with extraordinary hand drawings and then shows them to clients as a grid of low-resolution JPEGs. The website had 140 projects, no narrative, and no way to convey the thing that makes their work distinct: a rigorous, almost obsessive line quality. Referrals were strong — the site simply did not deserve them.',
    approach:
      'The entire site is a drawing-first experience. Hand-drawn plans and sections are the navigation, the case study hierarchy, and the transitions. We built a vector pipeline that traces the practice\'s existing drawings at print resolution, preserves the pencil texture, and lets strokes draw themselves in on scroll.\n\nProject narratives were rewritten around process rather than outcome — the rejected option, the constraint, the third idea — because that is what makes an architect credible to a developer.',
    outcome:
      'Average time on site went from 40 seconds to 4 minutes 12 seconds. Inbound project enquiries rose 180% in six months, and the practice reported winning two competitions against firms with far larger budgets who had found them through the site.',
    coverImage: img('photo-1502005229762-cf1b2da7c5d6'),
    gallery: [
      { id: 'g1', url: img('photo-1503387762-592deb58ef4e', 1400), caption: 'Vector drawing pipeline' },
      { id: 'g2', url: img('photo-1493397212122-2b85dda8106b', 1400), caption: 'Scroll-drawn section animation' },
      { id: 'g3', url: img('photo-1531973576160-7125cd663d86', 1400), caption: 'Competition narrative structure' },
    ],
    meta: [
      { id: 'm1', label: 'Sector', value: 'Architecture' },
      { id: 'm2', label: 'Engagement', value: '10 months' },
      { id: 'm3', label: 'Team', value: '6 specialists' },
      { id: 'm4', label: 'Year', value: '2024' },
    ],
    metrics: [
      { id: 'x1', value: '4:12', label: 'Average time on site' },
      { id: 'x2', value: '+180%', label: 'Inbound project enquiries' },
      { id: 'x3', value: '2', label: 'Competitions won via site' },
      { id: 'x4', value: '140', label: 'Projects restructured' },
    ],
    featured: false,
    published: true,
    year: '2024',
    order: 8,
    seo: {
      title: 'Northline Architecture — Drawing-First Portfolio',
      description:
        'A drawing-first website for an architecture practice, using traced vector plans as navigation, narrative and motion.',
    },
  },
]
