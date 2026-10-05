import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock, Send } from 'lucide-react'

import { PageHero, PageSection } from '@/components/layout/PageHero'
import { Container, SectionHeading } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import { useSiteContent } from '@/context/ContentContext'
import { useReveal } from '@/hooks/useReveal'
import { createSubmission, getServices } from '@/lib/content'
import { useSeo } from '@/lib/seo'
import { GlobalContact, SocialLinks } from '@/components/shared-zone/SharedZoneComponents'
import { siteEnv } from '@/lib/env'
import { cn, safeHref } from '@/lib/utils'
import { hasErrors, validateEmail, validateName, type FieldErrors } from '@/lib/validators'
import type { InquiryFormValues } from '@/types/content'

const BUDGETS = [
  'Under $10,000',
  '$10,000 – $25,000',
  '$25,000 – $60,000',
  '$60,000 – $150,000',
  '$150,000+',
  'Retainer / ongoing',
  'Not sure yet',
]

const EMPTY: InquiryFormValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  budget: BUDGETS[1],
  services: [],
  message: '',
  website: '',
}

export default function ContactPage() {
  const site = useSiteContent()
  useReveal()
  const [searchParams] = useSearchParams()

  const [values, setValues] = useState<InquiryFormValues>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors<InquiryFormValues>>({})
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [serviceOptions, setServiceOptions] = useState<string[]>([])

  useSeo({
    title: 'Contact',
    description:
      'Start a project with Agency Website. Two weeks from first conversation to a direction you can show your board. No charge, no obligation.',
    path: '/contact',
    site: site.seo,
  })

  useEffect(() => {
    void (async () => {
      const services = await getServices()
      setServiceOptions(services.map((service) => service.shortTitle ?? service.title))
    })()
  }, [])

  // Pre-select a service when arriving from /services?service=slug
  useEffect(() => {
    const requested = searchParams.get('service')
    if (!requested) return
    void (async () => {
      const services = await getServices()
      const match = services.find((service) => service.slug === requested)
      if (!match) return
      const label = match.shortTitle ?? match.title
      setValues((current) => ({
        ...current,
        services: current.services.includes(label) ? current.services : [...current.services, label],
        message: current.message || `I'd like to talk about ${match.title}. `,
      }))
    })
  }, [searchParams])

  const set = <K extends keyof InquiryFormValues>(key: K, value: InquiryFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const toggleService = (service: string) => {
    setValues((current) => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter((item) => item !== service)
        : [...current.services, service],
    }))
  }

  const validate = (): boolean => {
    const next: FieldErrors<InquiryFormValues> = {}
    const nameError = validateName(values.name)
    if (nameError) next.name = nameError
    const emailError = validateEmail(values.email)
    if (emailError) next.email = emailError
    if (values.message.trim().length < 20) {
      next.message = 'A little more detail, please — at least 20 characters.'
    }
    setErrors(next)
    return !hasErrors(next)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    // Honeypot — silently accept and drop.
    if (values.website) {
      setSent(true)
      return
    }

    if (!validate()) {
      document.getElementById('contact-form-errors')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      await createSubmission(values)
      setSent(true)
      setValues(EMPTY)
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Could not send that. Email us directly and we will pick it up today.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const contact = site.contact
  const directEmail = contact?.email || siteEnv.contactEmail

  const officeList = useMemo(
    () => [
      ...(site.footer?.offices ?? []),
      ...(contact?.addressLine1
        ? [
            {
              id: 'hq',
              city: contact.city || 'Head office',
              address: `${contact.addressLine1}${contact.addressLine2 ? `, ${contact.addressLine2}` : ''}`,
              phone: contact.phone,
            },
          ]
        : []),
    ],
    [site.footer?.offices, contact],
  )

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Bring us the thing"
        accent="you are not sure about"
        description="Two weeks from first conversation to a direction you can show your board. No charge, no obligation, and we will tell you honestly if we are the wrong studio for it."
      />

      <PageSection>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              {sent ? (
                <div className="panel-gold p-8 sm:p-12">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-200">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-8 font-display text-4xl font-light text-bone">Thank you — received.</h2>
                  <p className="lede mt-5 max-w-xl">
                    Your enquiry is with us and appears in the studio dashboard. You will hear from a person, not
                    an automated sequence, within two working hours.
                  </p>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button variant="ghost" onClick={() => setSent(false)}>
                      Send another
                    </Button>
                    <Button variant="quiet" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      Back to top
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Your name"
                      required
                      value={values.name}
                      onChange={(event) => set('name', event.target.value)}
                      error={errors.name}
                      placeholder="Jordan Ellis"
                      autoComplete="name"
                    />
                    <Input
                      label="Work email"
                      required
                      type="email"
                      value={values.email}
                      onChange={(event) => set('email', event.target.value)}
                      error={errors.email}
                      placeholder="jordan@company.com"
                      autoComplete="email"
                    />
                    <Input
                      label="Company"
                      value={values.company}
                      onChange={(event) => set('company', event.target.value)}
                      placeholder="Company name"
                      autoComplete="organization"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={values.phone}
                      onChange={(event) => set('phone', event.target.value)}
                      placeholder="Optional"
                      autoComplete="tel"
                    />
                  </div>

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={(event) => set('website', event.target.value)}
                    className="absolute h-0 w-0 opacity-0"
                    aria-hidden="true"
                  />

                  <div className="space-y-3">
                    <span className="field-label">What do you need?</span>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((service) => {
                        const active = values.services.includes(service)
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            aria-pressed={active}
                            className={cn(
                              'rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-wide2 transition-all duration-400',
                              active
                                ? 'border-gold-500/60 bg-gold-500/12 text-gold-100'
                                : 'border-white/10 bg-white/[0.02] text-bone-dim hover:border-white/25 hover:text-bone',
                            )}
                          >
                            {service}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <SelectLike
                    label="Indicative budget"
                    value={values.budget ?? ''}
                    onChange={(value) => set('budget', value)}
                    options={BUDGETS}
                  />

                  <Textarea
                    label="What are you trying to do?"
                    required
                    rows={6}
                    value={values.message}
                    onChange={(event) => set('message', event.target.value)}
                    error={errors.message}
                    placeholder="The situation, the constraint, and what would make this project a success in twelve months."
                    hint="Two or three sentences is plenty. We will ask better questions than this form can."
                  />

                  {formError ? (
                    <div
                      id="contact-form-errors"
                      role="alert"
                      className="rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3.5 text-sm text-red-200"
                    >
                      {formError}
                      <p className="mt-2 text-xs text-red-200/70">
                        You can also email{' '}
                        <a href={safeHref(`mailto:${directEmail}`)} className="underline underline-offset-4">
                          {directEmail}
                        </a>{' '}
                        and we will pick it up today.
                      </p>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-bone-dim">
                      By sending this you agree to our{' '}
                      <a href="/privacy-policy" className="text-gold-300 underline underline-offset-4">
                        privacy policy
                      </a>
                      . We never share enquiry data, and we delete it on request.
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      loading={submitting}
                      icon={<Send className="h-4 w-4" />}
                      className="shrink-0"
                    >
                      {submitting ? 'Sending' : 'Send enquiry'}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Details */}
            <aside className="lg:col-span-5">
              <div className="space-y-5 lg:sticky lg:top-28">
                <div className="panel p-7">
                  <h2 className="font-display text-2xl font-light text-bone">Reach us directly</h2>
                  <div className="mt-6">
                    <GlobalContact />
                  </div>
                  <ul className="mt-5 border-t border-white/[0.06] pt-4">
                    <li className="flex items-start gap-3.5">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                      <span>
                        <span className="block text-[0.62rem] uppercase tracking-wide2 text-bone-dim">
                          Response time
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-bone-muted">
                          Within two working hours, by a person
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>

                {officeList.length ? (
                  <div className="panel p-7">
                    <h2 className="font-display text-2xl font-light text-bone">Offices</h2>
                    <ul className="mt-6 space-y-5">
                      {officeList.map((office) => (
                        <li key={office.id} className="border-t border-white/[0.06] pt-4 first:border-0 first:pt-0">
                          <p className="font-display text-lg font-light text-bone">{office.city}</p>
                          <p className="mt-1 text-sm leading-relaxed text-bone-dim">{office.address}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {site.socials?.length ? (
                  <div className="panel p-7">
                    <h2 className="font-display text-2xl font-light text-bone">Elsewhere</h2>
                    <div className="mt-5"><SocialLinks /></div>
                  </div>
                ) : null}

                {contact?.availabilityNote ? (
                  <div className="panel-gold flex items-start gap-3.5 p-6">
                    <span className="mt-1.5 h-2 w-2 shrink-0 animate-pulse-gold rounded-full bg-gold-300" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-bone-muted">{contact.availabilityNote}</p>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </Container>
      </PageSection>

      {/* What happens next */}
      <PageSection className="border-t border-white/[0.06] bg-ink-900/40">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="After you hit send"
            title="What happens"
            accent="in the first week"
            description="No discovery call theatre. Here is the actual sequence."
          />

          <ol className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-3">
            {[
              {
                step: 'Day 0',
                title: 'A human replies',
                body: 'Within two working hours, with a question rather than a calendar link. If it is not for us, we say so and suggest who is.',
              },
              {
                step: 'Day 1–3',
                title: 'A 45-minute call',
                body: 'Two of us. We want to understand the constraint, not the brief. You will get an honest read on whether we can help.',
              },
              {
                step: 'Day 5–10',
                title: 'A written direction',
                body: 'Two pages, no charge: what we would do, what it would cost, and what we think you are actually trying to solve.',
              },
            ].map((item, index) => (
              <li
                key={item.step}
                className="reveal rounded-2xl border border-white/[0.07] bg-ink-850/50 p-7"
                data-reveal-index={index}
              >
                <p className="text-[0.62rem] uppercase tracking-luxe text-gold-400">{item.step}</p>
                <h3 className="mt-4 font-display text-2xl font-light text-bone">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </PageSection>
    </>
  )
}

/** Local select so the radio-style list keeps the studio's visual language. */
function SelectLike({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="field-label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-4 py-2 text-[0.7rem] transition-all duration-400',
                active
                  ? 'border-gold-500/60 bg-gold-500/12 text-gold-100'
                  : 'border-white/10 bg-white/[0.02] text-bone-dim hover:border-white/25 hover:text-bone',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
