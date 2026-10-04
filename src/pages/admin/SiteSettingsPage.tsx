import { useEffect, useState } from 'react'
import { RotateCcw, Save } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input, Select, Switch, Textarea } from '@/components/ui/Field'
import { FormCard, ImageField } from '@/components/ui/FormKit'
import { ErrorState, LoadingState } from '@/components/admin/States'
import { defaultSite } from '@/data/defaults'
import { useAdminSetting, type AdminSettingState } from '@/hooks/useAdminSetting'
import { toast } from '@/hooks/useToast'
import { SOCIAL_ICON_CHOICES } from '@/lib/icons'
import { isEmail, isPhone } from '@/lib/validators'
import type { SocialIconKey, SocialLink } from '@/types/content'

type Office = { id: string; city: string; address: string; phone?: string }

const SOCIAL_OPTIONS = SOCIAL_ICON_CHOICES.map((icon) => ({
  value: icon,
  label: icon.charAt(0).toUpperCase() + icon.slice(1),
}))

function updateSocial(
  state: AdminSettingState<'socials'>,
  index: number,
  patch: Partial<SocialLink>,
): void {
  state.setValue(state.value.map((item, i) => (i === index ? { ...item, ...patch } : item)))
}

function updateOffice(
  state: AdminSettingState<'footer'>,
  index: number,
  patch: Partial<Office>,
): void {
  state.update({
    offices: state.value.offices.map((item, i) => (i === index ? { ...item, ...patch } : item)),
  })
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return <Switch checked={checked} onChange={onChange} label={label} description={description} />
}

/** Site-wide settings: brand, logo, contact details, socials and footer. */
export default function SiteSettingsPage() {
  const brand = useAdminSetting('brand', defaultSite.brand)
  const contact = useAdminSetting('contact', defaultSite.contact)
  const socials = useAdminSetting('socials', defaultSite.socials)
  const theme = useAdminSetting('theme', defaultSite.theme)
  const footer = useAdminSetting('footer', defaultSite.footer)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savingSection, setSavingSection] = useState<string | null>(null)

  const dirty = brand.dirty || contact.dirty || socials.dirty || theme.dirty || footer.dirty
  const loading = brand.loading || contact.loading || socials.loading || footer.loading

  useEffect(() => {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!brand.value.siteName.trim()) next.siteName = 'An agency name is required.'
    if (!contact.value.email.trim()) next.email = 'A contact email is required.'
    else if (!isEmail(contact.value.email)) next.email = 'That email address is not valid.'
    if (contact.value.phone.trim() && !isPhone(contact.value.phone)) next.phone = 'Use digits, spaces, + or ( ) only.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const saveAll = async () => {
    if (!validate()) {
      toast.error('Fix the highlighted fields', 'Some contact details are not valid yet.')
      return
    }
    setSavingSection('all')
    try {
      await Promise.all([brand.save(), contact.save(), socials.save(), theme.save(), footer.save()])
      toast.success('Settings saved', 'The public site is updated immediately.')
    } catch (error) {
      toast.error('Could not save', error instanceof Error ? error.message : 'Unknown error.')
    } finally {
      setSavingSection(null)
    }
  }

  if (loading) return <LoadingState label="Loading site settings" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="lede max-w-2xl text-sm">
          Brand identity, contact details and social links. These values feed the navbar, footer, contact page, social
          share cards and structured data across the whole site.
        </p>
        <div className="flex shrink-0 items-center gap-2.5">
          <Button
            variant="quiet"
            onClick={() => {
              brand.reset()
              contact.reset()
              socials.reset()
              theme.reset()
              footer.reset()
              setErrors({})
            }}
            icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
          >
            Discard
          </Button>
          <Button
            onClick={() => void saveAll()}
            loading={savingSection === 'all'}
            disabled={!dirty}
            icon={<Save className="h-4 w-4" aria-hidden="true" />}
          >
            {dirty ? 'Save changes' : 'All saved'}
          </Button>
        </div>
      </div>

      {[brand.error, contact.error, socials.error, footer.error].filter(Boolean).map((message) => (
        <ErrorState key={message} message={message as string} />
      ))}

      <FormCard
        title="Brand"
        description="The text logo shown in the navbar and footer. Upload a logo image to replace the generated wordmark entirely."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Agency name"
            required
            value={brand.value.siteName}
            onChange={(event) => brand.update({ siteName: event.target.value })}
            error={errors.siteName}
            hint="Used in the wordmark, page titles and social cards."
          />
          <Input
            label="Tagline"
            value={brand.value.tagline}
            onChange={(event) => brand.update({ tagline: event.target.value })}
          />
          <Input
            label="Founded year"
            value={brand.value.foundedYear ?? ''}
            onChange={(event) => brand.update({ foundedYear: event.target.value })}
            placeholder="2014"
          />
          <div className="flex items-end">
            <div className="w-full rounded-xl border border-white/[0.07] bg-ink-900/60 px-4 py-3">
              <p className="text-[0.6rem] uppercase tracking-wide2 text-bone-dim">Logo preview</p>
              <p className="mt-1 font-display text-lg font-light uppercase tracking-[0.12em] text-bone">
                {brand.value.logoUrl ? (
                  <img src={brand.value.logoUrl} alt="Current logo" className="max-h-9 w-auto" />
                ) : (
                  brand.value.siteName || 'Agency Website'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Textarea
            label="Agency description"
            rows={3}
            value={brand.value.description}
            onChange={(event) => brand.update({ description: event.target.value })}
            hint="Short studio summary. Used in the footer and as a default meta description."
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <ImageField
            label="Logo image"
            value={brand.value.logoUrl ?? ''}
            onChange={(url) => brand.update({ logoUrl: url })}
            scope="logo"
            aspect="3/1"
            hint="Leave empty to keep the generated monogram + wordmark."
          />
          <ImageField
            label="Logo mark / favicon"
            value={brand.value.logoMarkUrl ?? ''}
            onChange={(url) => brand.update({ logoMarkUrl: url })}
            scope="logo"
            aspect="1/1"
            hint="Optional favicon-sized mark for tight spaces."
          />
        </div>
      </FormCard>

      <FormCard title="Contact details" description="Shown on the contact page, in the footer, and used for the WhatsApp link.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            required
            value={contact.value.email}
            onChange={(event) => contact.update({ email: event.target.value })}
            error={errors.email}
          />
          <Input
            label="Phone"
            type="tel"
            value={contact.value.phone}
            onChange={(event) => contact.update({ phone: event.target.value })}
            error={errors.phone}
          />
          <Input
            label="WhatsApp number"
            value={contact.value.whatsapp ?? ''}
            onChange={(event) => contact.update({ whatsapp: event.target.value })}
            hint="International format, digits only — e.g. 14155550182"
          />
          <Input
            label="Map link"
            value={contact.value.mapUrl ?? ''}
            onChange={(event) => contact.update({ mapUrl: event.target.value })}
            hint="Google Maps or OpenStreetMap URL."
          />
          <Input
            label="Address line 1"
            value={contact.value.addressLine1 ?? ''}
            onChange={(event) => contact.update({ addressLine1: event.target.value })}
          />
          <Input
            label="Address line 2"
            value={contact.value.addressLine2 ?? ''}
            onChange={(event) => contact.update({ addressLine2: event.target.value })}
          />
          <Input
            label="City"
            value={contact.value.city ?? ''}
            onChange={(event) => contact.update({ city: event.target.value })}
          />
          <Input
            label="Country"
            value={contact.value.country ?? ''}
            onChange={(event) => contact.update({ country: event.target.value })}
          />
        </div>
        <div className="mt-5">
          <Textarea
            label="Availability note"
            rows={2}
            value={contact.value.availabilityNote ?? ''}
            onChange={(event) => contact.update({ availabilityNote: event.target.value })}
            hint="Short status line shown near the contact form. Set your own availability here."
          />
        </div>
      </FormCard>

      <FormCard
        title="Social links"
        description="Rendered as icons in the navbar, footer and contact page."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              socials.setValue([
                ...socials.value,
                { id: `so-${Date.now().toString(36)}`, label: 'Instagram', href: '', icon: 'instagram' },
              ])
            }
          >
            Add link
          </Button>
        }
      >
        <ul className="space-y-3">
          {socials.value.map((social, index) => (
            <li key={social.id} className="grid gap-3 rounded-xl border border-white/[0.07] bg-white/[0.012] p-3.5 sm:grid-cols-12">
              <div className="sm:col-span-3">
                <Input
                  label="Network"
                  value={social.label}
                  onChange={(event) => updateSocial(socials, index, { label: event.target.value })}
                  aria-label="Network name"
                />
              </div>
              <div className="sm:col-span-6">
                <Input
                  label="URL"
                  value={social.href}
                  onChange={(event) => updateSocial(socials, index, { href: event.target.value })}
                  placeholder="https://instagram.com/youragency"
                  aria-label="Profile URL"
                />
              </div>
              <div className="sm:col-span-2">
                <Select
                  label="Icon"
                  value={social.icon}
                  onChange={(event) =>
                    updateSocial(socials, index, { icon: event.target.value as SocialIconKey })
                  }
                  options={SOCIAL_OPTIONS}
                />
              </div>
              <div className="flex items-end sm:col-span-1">
                <Button
                  variant="quiet"
                  className="text-bone-dim hover:text-red-300"
                  onClick={() =>
                    socials.setValue(socials.value.filter((_, i) => i !== index))
                  }
                  aria-label={`Remove ${social.label}`}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </FormCard>

      <FormCard title="Footer" description="Offices, closing note and the small print at the bottom of every page.">
        <Textarea
          label="Footer tagline"
          rows={2}
          value={footer.value.tagline}
          onChange={(event) => footer.update({ tagline: event.target.value })}
        />
        <div className="mt-5">
          <Textarea
            label="Legal / ownership note"
            rows={2}
            value={footer.value.legalNote ?? ''}
            onChange={(event) => footer.update({ legalNote: event.target.value })}
          />
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="field-label mb-0">Offices</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                footer.update({
                  offices: [
                    ...footer.value.offices,
                    { id: `of-${Date.now().toString(36)}`, city: '', address: '', phone: '' },
                  ],
                })
              }
            >
              Add office
            </Button>
          </div>
          <ul className="space-y-3">
            {footer.value.offices.map((office, index) => (
              <li key={office.id} className="grid gap-3 rounded-xl border border-white/[0.07] bg-white/[0.012] p-3.5 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <Input
                    label="City"
                    value={office.city}
                    onChange={(event) => updateOffice(footer, index, { city: event.target.value })}
                  />
                </div>
                <div className="sm:col-span-5">
                  <Input
                    label="Address"
                    value={office.address}
                    onChange={(event) => updateOffice(footer, index, { address: event.target.value })}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Phone"
                    value={office.phone ?? ''}
                    onChange={(event) => updateOffice(footer, index, { phone: event.target.value })}
                  />
                </div>
                <div className="flex items-end sm:col-span-1">
                  <Button
                    variant="quiet"
                    className="text-bone-dim hover:text-red-300"
                    onClick={() =>
                      footer.update({ offices: footer.value.offices.filter((_, i) => i !== index) })
                    }
                    aria-label={`Remove ${office.city || 'office'}`}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </FormCard>

      <FormCard title="Display options" description="Toggle optional homepage sections without deleting their content.">
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleField
            label="Show hero"
            description="Display the homepage hero section."
            checked={theme.value.heroEnabled !== false}
            onChange={(next) => theme.update({ heroEnabled: next })}
          />
          <ToggleField
            label="Show testimonials"
            description="Display the testimonial band."
            checked={theme.value.showTestimonials !== false}
            onChange={(next) => theme.update({ showTestimonials: next })}
          />
          <ToggleField
            label="Show pricing preview"
            description="Display pricing cards on the homepage."
            checked={theme.value.showPricing !== false}
            onChange={(next) => theme.update({ showPricing: next })}
          />
          <ToggleField
            label="Show latest articles"
            description="Display the blog preview band."
            checked={theme.value.showBlog !== false}
            onChange={(next) => theme.update({ showBlog: next })}
          />
        </div>
      </FormCard>
    </div>
  )
}
