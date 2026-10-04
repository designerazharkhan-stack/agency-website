import { useState } from 'react'

import { Container } from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { useSiteContent } from '@/context/ContentContext'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'

interface Clause {
  id: string
  heading: string
  body: string[]
  list?: string[]
}

export interface LegalDocument {
  title: string
  intro: string
  updated: string
  clauses: Clause[]
}

function LegalPage({ document }: { document: LegalDocument }) {
  const site = useSiteContent()
  const [activeId, setActiveId] = useState(document.clauses[0]?.id ?? '')

  useSeo({
    title: document.title,
    description: document.intro,
    path: document.title === 'Privacy Policy' ? '/privacy-policy' : '/terms',
    robots: 'index',
    site: site.seo,
  })

  return (
    <>
      <header className="relative overflow-hidden border-b border-white/[0.06] pb-14 pt-16 sm:pb-20 sm:pt-24">
        <div className="absolute inset-0 -z-20 bg-ink-radial" aria-hidden="true" />
        <div className="grid-lines pointer-events-none absolute inset-0 -z-20 opacity-50" aria-hidden="true" />

        <Container>
          <div className="max-w-3xl">
            <span className="eyebrow">Legal</span>
            <h1 className="display mt-7 text-display-md">{document.title}</h1>
            <p className="lede mt-7">{document.intro}</p>
            <p className="mt-6 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
              Last updated {document.updated}
            </p>
          </div>
        </Container>
      </header>

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Index */}
          <nav className="lg:col-span-3" aria-label={`${document.title} contents`}>
            <div className="lg:sticky lg:top-28">
              <p className="text-[0.62rem] uppercase tracking-luxe text-gold-400">Contents</p>
              <ol className="mt-5 space-y-2.5">
                {document.clauses.map((clause, index) => (
                  <li key={clause.id}>
                    <a
                      href={`#${clause.id}`}
                      onClick={() => setActiveId(clause.id)}
                      className={cn(
                        'flex gap-3 text-sm transition-colors duration-300',
                        activeId === clause.id ? 'text-gold-200' : 'text-bone-dim hover:text-bone',
                      )}
                    >
                      <span className="font-mono text-[0.6rem] text-gold-500/50">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-snug">{clause.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>

              <div className="mt-9 rounded-xl border border-white/[0.07] bg-white/[0.015] p-5">
                <p className="text-xs leading-relaxed text-bone-dim">
                  Questions about this document? Email{' '}
                  <a href={`mailto:${site.contact?.email}`} className="text-gold-300 underline underline-offset-4">
                    {site.contact?.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          </nav>

          {/* Body */}
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="space-y-12">
              {document.clauses.map((clause, index) => (
                <section
                  key={clause.id}
                  id={clause.id}
                  className="scroll-mt-28"
                  onMouseEnter={() => setActiveId(clause.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[0.62rem] text-gold-500/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-2xl font-light text-bone sm:text-3xl">{clause.heading}</h2>
                  </div>

                  <div className="mt-5 space-y-4 border-l border-white/[0.07] pl-6">
                    {clause.body.map((paragraph, pi) => (
                      <p key={pi} className="text-[0.95rem] leading-relaxed text-bone-muted">
                        {paragraph}
                      </p>
                    ))}

                    {clause.list?.length ? (
                      <ul className="space-y-2.5 pt-1">
                        {clause.list.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-bone-muted">
                            <span
                              className="mt-[0.7em] h-1 w-1 shrink-0 rotate-45 bg-gold-500/70"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>

            <div className="panel-gold mt-16 p-8">
              <h2 className="font-display text-2xl font-light text-bone">Acceptance</h2>
              <p className="mt-3 text-sm leading-relaxed text-bone-muted">
                By using this website or engaging us, you confirm that you have read and understood this document.
                If you do not accept it, please do not use the site — and tell us why so we can fix it.
              </p>
              <LinkButton to="/contact" className="mt-7">
                Contact the studio
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

/* -------------------------------------------------------------------------- */

const PRIVACY: LegalDocument = {
  title: 'Privacy Policy',
  intro:
    'How we handle information you give us. Written to be read, not to be skimmed past. If anything here is unclear, ask and we will rewrite it.',
  updated: '1 October 2026',
  clauses: [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      body: [
        `${'Agency Website'} is an independent digital agency. For the purposes of data protection we are the data controller for information collected through this website.`,
        'We are a small organisation with no in-house legal or compliance department. Where the law requires us to appoint one we will, but practically everything here is handled by the two people who run the studio.',
      ],
    },
    {
      id: 'what-we-collect',
      heading: 'What we collect',
      body: ['We deliberately collect as little as possible. The full list is below.'],
      list: [
        'Enquiry form submissions: your name, email address, and anything else you choose to include in the message. Optionally your phone number, company and indicative budget.',
        'Analytics: aggregated, cookie-free page view counts. No cross-site tracking, no advertising identifiers, no data sold or shared.',
        'Technical logs: standard server request logs retained for 30 days for security purposes.',
        'Client project data: material you send us during an engagement, governed by the individual project agreement rather than this policy.',
      ],
    },
    {
      id: 'how-we-use-it',
      heading: 'How we use it',
      body: [
        'Enquiry data is used for exactly one purpose: to respond to you and, if we enter into an engagement, to prepare for it. We do not add you to a newsletter because there isn\'t one, and we will not pass your details to anyone.',
        'If we do not respond — or if you tell us to stop — enquiry data is deleted within 30 days. You do not need to ask.',
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies and storage',
      body: [
        'This site sets no advertising or tracking cookies. Firebase Authentication stores a session token in your browser\'s local storage so that the /admin dashboard can stay signed in — that is used only if you are an administrator, and it never reaches any analytics system.',
        'If a contact form submission is stored, it is held in our Firebase project. Firebase infrastructure is hosted by Google; see their terms for how they process data at rest.',
      ],
    },
    {
      id: 'third-parties',
      heading: 'Third parties',
      body: ['We use the following processors. None of them receive information about you unless you give it to us directly.'],
      list: [
        'Google Firebase — hosting, database, authentication and file storage for this website.',
        'Your web host — standard request logging for delivery and security.',
        'Our email provider — to reply to you.',
        'Vercel, Netlify, Cloudflare Pages or an equivalent host if you access this site through a CDN edge network.',
      ],
    },
    {
      id: 'retention',
      heading: 'Retention',
      body: [
        'Enquiries: deleted 30 days after the conversation ends, or immediately on request.',
        'Server logs: 30 days.',
        'Analytics: 14 months, aggregated only.',
        'Client project data: for the duration of the engagement plus seven years, because tax law requires us to keep financial records. Media and working files are deleted on request at any point.',
      ],
    },
    {
      id: 'your-rights',
      heading: 'Your rights',
      body: [
        'Depending on where you live you may have the right to access, correct, delete, restrict or export the personal data we hold about you, and to object to certain processing.',
        'In practice: email us and we will action it within 30 days at no cost. There is no automated decision-making or profiling involved, so there is nothing else you need to worry about.',
      ],
    },
    {
      id: 'security',
      heading: 'Security',
      body: [
        'Traffic is encrypted in transit. Data is stored encrypted at rest by Firebase, access is limited to the two studio principals, and the admin dashboard requires multi-factor-capable authentication with role enforcement on the server side.',
        'No system is perfectly secure. If we discover a breach that affects your data we will tell you and the relevant regulator within 72 hours.',
      ],
    },
    {
      id: 'international-transfers',
      heading: 'International transfers',
      body: [
        'Firebase is a global service and data may be processed outside your jurisdiction, including in the United States. Where that happens, transfers rely on an appropriate safeguard such as Standard Contractual Clauses.',
        'If you need data to remain in a specific region, say so before you send it and we will tell you honestly whether that is possible.',
      ],
    },
    {
      id: 'children',
      heading: 'Children',
      body: [
        'This site is not directed at children under 16 and we do not knowingly collect information from them. If you believe a child has sent us information, email us and we will delete it.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes and contact',
      body: [
        'If this policy changes materially we will update the date at the top and, for significant changes, notify clients directly.',
        'Questions, requests or complaints: email the studio. We would rather resolve it with you than route you to a regulator.',
      ],
    },
  ],
}

const TERMS: LegalDocument = {
  title: 'Terms & Conditions',
  intro:
    'The agreement between us for using this website and for engaging the studio. Written in plain English because clarity between us is worth more than legal density.',
  updated: '1 October 2026',
  clauses: [
    {
      id: 'acceptance',
      heading: 'Acceptance',
      body: [
        'By using this website you agree to these terms. They apply to the website itself; engagements with the studio are governed by a separate signed proposal or master services agreement.',
        'Where those documents conflict with anything on this site, the signed documents win.',
      ],
    },
    {
      id: 'use-of-site',
      heading: 'Use of this site',
      body: ['You may browse, read and share this site freely. You may not:'],
      list: [
        'Copy, scrape or republish substantial parts of it without written permission.',
        'Attempt to gain unauthorised access to any system, or to interfere with its operation.',
        'Use the contact form to send unsolicited marketing, or to submit anything unlawful.',
        'Misrepresent your identity when contacting us.',
      ],
    },
    {
      id: 'intellectual-property',
      heading: 'Intellectual property',
      body: [
        'All content on this site — text, imagery, identity, code and design — is owned by the studio or used under licence. It is protected by copyright and, where applicable, design rights.',
        'Our portfolio includes work produced for clients. We display it with permission; you may reference and link to it, and you may not reproduce it without asking.',
      ],
    },
    {
      id: 'engagements',
      heading: 'Engagements',
      body: [
        'Every project begins with a written proposal stating scope, deliverables, fee and timeline. That proposal, once accepted by both parties, forms the contract.',
        'Work is performed by the studio and its named contractors. You are buying the studio\'s output, not a specific individual\'s attendance, though we will always tell you who is doing the work.',
        'We may decline an engagement at any point before work begins. If we do, any deposit taken is returned in full.',
      ],
    },
    {
      id: 'fees',
      heading: 'Fees and payment',
      body: [
        'Fees are quoted as a fixed amount or an agreed day rate against a ceiling. Payment schedules are set out in each proposal; the standard is a deposit on signature and staged payments tied to deliverables.',
        'Invoices are payable within 14 days. Work pauses if an invoice is more than 30 days overdue, and we reserve the right to suspend and to recover reasonable costs of doing so.',
        'Third-party costs — licences, print, media spend, hosting above plan — are passed through at cost and identified separately.',
      ],
    },
    {
      id: 'client-responsibilities',
      heading: 'Your responsibilities',
      body: ['Projects move at the speed of decisions. To stay within scope and timeline we need:'],
      list: [
        'One named decision-maker with the authority to approve work.',
        'Consolidated feedback rather than competing opinions, ideally within 48 hours.',
        'Access to the people who know the problem, including customers or past customers.',
        'Legal review of anything we are asked to say about your regulated activity.',
        'Timely content and approvals. Delays on your side move the schedule one-for-one.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to scope',
      body: [
        'If scope changes, we will tell you the cost and the schedule impact before we begin the additional work. Nothing is invoiced retrospectively as an overrun.',
        'You may cancel at any point. Work completed to that date is payable; work not started is not.',
      ],
    },
    {
      id: 'portfolio-rights',
      heading: 'Portfolio and credit',
      body: [
        'We ask for permission to publish work and to name you. If you decline, or ask us to remove something, we do it without argument and without a follow-up question.',
        'Where you permit publication, you confirm that you have the rights to the material supplied to us and that nothing published requires your redaction.',
      ],
    },
    {
      id: 'warranties',
      heading: 'Warranties and liability',
      body: [
        'We warrant that we will perform the services with reasonable skill and care, and that deliverables will materially conform to the agreed specification for 30 days after handover.',
        'Except for that warranty and any obligation that cannot lawfully be limited, our total liability is limited to the fees paid under the relevant proposal.',
        'We are not liable for indirect or consequential loss, or for loss of profit, revenue or data arising from our work. Nothing in these terms limits liability for death or personal injury caused by negligence, fraud, or anything else that cannot lawfully be limited.',
      ],
    },
    {
      id: 'third-party-rights',
      heading: 'Third-party rights',
      body: [
        'Where we use third-party material — stock photography, licensed fonts, open-source software — we ensure the licence permits your intended use and we identify anything with obligations attached.',
        'Open-source components retain their own licences, which apply in addition to these terms.',
      ],
    },
    {
      id: 'termination',
      heading: 'Termination',
      body: [
        'Either party may terminate for material breach that remains uncured 30 days after written notice, and immediately if the other becomes insolvent.',
        'On termination you pay for work completed and we hand over everything produced to that point.',
      ],
    },
    {
      id: 'liability',
      heading: 'Professional codes and disputes',
      body: [
        'We work to the standards of the professional bodies we belong to, including the principle that we will not accept work we believe is wrong or that we cannot do well.',
        'These terms are governed by the law of the jurisdiction in which the studio is registered. Disputes go to that jurisdiction\'s courts, and we would much rather resolve them in conversation first.',
      ],
    },
    {
      id: 'general',
      heading: 'General',
      body: [
        'If any provision is found unenforceable, the rest remains in force. Neither party may assign these terms without consent.',
        'These terms may be updated from time to time; the date at the top reflects the current version. Continuing to use the site after an update constitutes acceptance.',
      ],
    },
  ],
}

export function PrivacyPolicyPage() {
  return <LegalPage document={PRIVACY} />
}

export function TermsPage() {
  return <LegalPage document={TERMS} />
}
