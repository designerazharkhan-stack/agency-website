import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { RotateCcw, Save } from 'lucide-react'

import { ErrorState, LoadingState } from '@/components/admin/States'
import { FormCard, ImageField, RepeaterField, StringListField } from '@/components/ui/FormKit'
import { Button } from '@/components/ui/Button'
import { Input, Select, Switch, Textarea } from '@/components/ui/Field'
import { useSite } from '@/context/ContentContext'
import { useAdminSharedZone } from '@/hooks/useAdminSharedZone'
import { toast } from '@/hooks/useToast'
import { SOCIAL_ICON_CHOICES } from '@/lib/icons'
import { isEmail, isPhone } from '@/lib/validators'
import type { NavItem, SharedZone, SocialIconKey, SocialLink } from '@/types/content'

const SOCIAL_OPTIONS = SOCIAL_ICON_CHOICES.map((icon) => ({
  value: icon,
  label: icon.charAt(0).toUpperCase() + icon.slice(1),
}))

function updateSocial(
  socials: SocialLink[],
  index: number,
  patch: Partial<SocialLink>,
  setSocials: (next: SocialLink[]) => void,
) {
  setSocials(socials.map((item, current) => current === index ? { ...item, ...patch } : item))
}

function LinkListEditor({
  label,
  value,
  onChange,
}: {
  label: string
  value: NavItem[]
  onChange: (next: NavItem[]) => void
}) {
  const patch = (index: number, changes: Partial<NavItem>) => {
    onChange(value.map((item, current) => current === index ? { ...item, ...changes } : item))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="field-label mb-0">{label}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange([...value, { label: '', href: '/' }])}
        >
          Add link
        </Button>
      </div>
      {value.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl border border-white/[0.07] p-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <Input
            label="Label"
            value={item.label}
            onChange={(event) => patch(index, { label: event.target.value })}
          />
          <Input
            label="URL"
            value={item.href}
            onChange={(event) => patch(index, { href: event.target.value })}
            placeholder="/services or https://example.com"
          />
          <Button
            variant="quiet"
            className="self-end text-bone-dim hover:text-red-300"
            onClick={() => onChange(value.filter((_, current) => current !== index))}
            aria-label={`Remove ${item.label || 'link'}`}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  )
}

export default function SharedZoneAdminPage() {
  const editor = useAdminSharedZone()
  const { updateSharedZone } = useSite()
  const [validationError, setValidationError] = useState<string | null>(null)
  const { hash } = useLocation()

  useEffect(() => {
    if (hash !== '#seo' || editor.loading) return
    window.requestAnimationFrame(() => document.getElementById('seo')?.scrollIntoView({ behavior: 'smooth' }))
  }, [hash, editor.loading])

  if (editor.loading) return <LoadingState label="Loading Shared Zone settings" />

  const set = <K extends keyof SharedZone>(key: K, value: SharedZone[K]) => {
    editor.setValue((current) => ({ ...current, [key]: value }))
  }

  const save = async () => {
    setValidationError(null)
    if (!editor.value.brand.siteName.trim()) {
      setValidationError('An agency name is required.')
      return
    }
    if (!isEmail(editor.value.contact.email)) {
      setValidationError('Enter a valid contact email address.')
      return
    }
    if (editor.value.contact.phone.trim() && !isPhone(editor.value.contact.phone)) {
      setValidationError('Use digits, spaces, + or ( ) only for the contact phone.')
      return
    }
    if (!/^#[\da-f]{6}$/i.test(editor.value.brand.primaryColor)
      || !/^#[\da-f]{6}$/i.test(editor.value.brand.secondaryColor)
      || !/^#[\da-f]{6}$/i.test(editor.value.brand.accentColor)) {
      setValidationError('Brand colors must be six-digit hexadecimal values.')
      return
    }

    try {
      const saved = await editor.save()
      updateSharedZone(saved)
      toast.success('Shared Zone saved', 'Your site-wide settings are now updated everywhere.')
    } catch (error) {
      toast.error('Could not save Shared Zone', error instanceof Error ? error.message : 'Unknown error.')
    }
  }

  const zone = editor.value

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-gold-500/20 bg-gold-500/[0.035] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="eyebrow">Shared Zone · One source of truth</p>
          <h2 className="mt-3 font-display text-3xl font-light text-bone sm:text-4xl">Site Settings</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone-dim">
            Edit site-wide information once. The navbar, homepage, contact surfaces, SEO and footer all read from the
            same shared configuration.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="quiet" onClick={editor.reset} disabled={!editor.dirty} icon={<RotateCcw className="h-4 w-4" />}>
            Discard
          </Button>
          <Button onClick={() => void save()} loading={editor.saving} disabled={!editor.dirty || editor.saving} icon={<Save className="h-4 w-4" />}>
            {editor.saving ? 'Saving…' : editor.dirty ? 'Save Shared Zone' : 'All saved'}
          </Button>
        </div>
      </header>

      {editor.error ? <ErrorState message={editor.error} /> : null}
      {validationError ? <ErrorState message={validationError} /> : null}

      <FormCard title="Global brand" description="Brand identity, replacement artwork and the colors used across the site.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Agency name"
            required
            value={zone.brand.siteName}
            onChange={(event) => editor.update('brand', { siteName: event.target.value })}
          />
          <Input
            label="Tagline"
            value={zone.brand.tagline}
            onChange={(event) => editor.update('brand', { tagline: event.target.value })}
          />
          <Input
            label="Founded year"
            value={zone.brand.foundedYear ?? ''}
            onChange={(event) => editor.update('brand', { foundedYear: event.target.value })}
            placeholder="2014"
          />
          <Input label="Primary color" type="color" value={zone.brand.primaryColor} onChange={(event) => editor.update('brand', { primaryColor: event.target.value })} className="!h-12 !p-1" />
          <Input label="Secondary color" type="color" value={zone.brand.secondaryColor} onChange={(event) => editor.update('brand', { secondaryColor: event.target.value })} className="!h-12 !p-1" />
          <Input label="Accent / gold color" type="color" value={zone.brand.accentColor} onChange={(event) => editor.update('brand', { accentColor: event.target.value })} className="!h-12 !p-1" />
        </div>
        <div className="mt-5">
          <Textarea
            label="Agency description"
            rows={3}
            value={zone.brand.description}
            onChange={(event) => editor.update('brand', { description: event.target.value })}
          />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <ImageField label="Logo" value={zone.brand.logoUrl ?? ''} onChange={(logoUrl) => editor.update('brand', { logoUrl })} scope="logo" aspect="3/1" />
          <ImageField label="Favicon / logo mark" value={zone.brand.faviconUrl ?? zone.brand.logoMarkUrl ?? ''} onChange={(faviconUrl) => editor.update('brand', { faviconUrl, logoMarkUrl: faviconUrl })} scope="logo" aspect="1/1" />
        </div>
      </FormCard>

      <FormCard title="Announcement" description="Optional site-wide banner above the primary navigation.">
        <Switch
          label="Show announcement"
          description="The banner adjusts its height and wraps on small screens."
          checked={zone.announcement.enabled}
          onChange={(enabled) => editor.update('announcement', { enabled })}
        />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Input label="Message" value={zone.announcement.text} onChange={(event) => editor.update('announcement', { text: event.target.value })} />
          <Input label="Button text" value={zone.announcement.buttonText} onChange={(event) => editor.update('announcement', { buttonText: event.target.value })} />
          <Input label="Link URL" value={zone.announcement.href} onChange={(event) => editor.update('announcement', { href: event.target.value })} placeholder="/contact" />
        </div>
      </FormCard>

      <FormCard title="Contact and hours" description="Displayed consistently in navigation, contact details and the site footer.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Email" type="email" required value={zone.contact.email} onChange={(event) => editor.update('contact', { email: event.target.value })} />
          <Input label="Phone" type="tel" value={zone.contact.phone} onChange={(event) => editor.update('contact', { phone: event.target.value })} />
          <Input label="WhatsApp number" value={zone.contact.whatsapp ?? ''} onChange={(event) => editor.update('contact', { whatsapp: event.target.value })} />
          <Input label="Map URL" value={zone.contact.mapUrl ?? ''} onChange={(event) => editor.update('contact', { mapUrl: event.target.value })} />
          <Input label="Address" value={zone.contact.addressLine1 ?? ''} onChange={(event) => editor.update('contact', { addressLine1: event.target.value })} />
          <Input label="Address details" value={zone.contact.addressLine2 ?? ''} onChange={(event) => editor.update('contact', { addressLine2: event.target.value })} />
          <Input label="City" value={zone.contact.city ?? ''} onChange={(event) => editor.update('contact', { city: event.target.value })} />
          <Input label="Country" value={zone.contact.country ?? ''} onChange={(event) => editor.update('contact', { country: event.target.value })} />
        </div>
        <div className="mt-5">
          <Textarea label="Availability note" rows={2} value={zone.contact.availabilityNote ?? ''} onChange={(event) => editor.update('contact', { availabilityNote: event.target.value })} />
        </div>
        <div className="mt-5">
          <StringListField
            label="Business hours"
            value={zone.contact.businessHours}
            onChange={(businessHours) => editor.update('contact', { businessHours })}
            placeholder="Monday–Friday, 9:00am–5:00pm"
            addLabel="Add business-hours line"
            minRows={0}
          />
        </div>
      </FormCard>

      <FormCard title="Social media" description="One shared list is used by the footer, mobile menu and contact page.">
        <div className="space-y-3">
          {zone.socials.map((social, index) => (
            <div key={social.id} className="grid gap-3 rounded-xl border border-white/[0.07] p-3 sm:grid-cols-[1fr_1.4fr_1fr_auto]">
              <Input label="Network" value={social.label} onChange={(event) => updateSocial(zone.socials, index, { label: event.target.value }, (socials) => set('socials', socials))} />
              <Input label="Profile URL" value={social.href} onChange={(event) => updateSocial(zone.socials, index, { href: event.target.value }, (socials) => set('socials', socials))} placeholder="https://…" />
              <Select label="Icon" value={social.icon} onChange={(event) => updateSocial(zone.socials, index, { icon: event.target.value as SocialIconKey }, (socials) => set('socials', socials))} options={SOCIAL_OPTIONS} />
              <Button variant="quiet" className="self-end text-bone-dim hover:text-red-300" onClick={() => set('socials', zone.socials.filter((_, current) => current !== index))} aria-label={`Remove ${social.label}`}>Remove</Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => set('socials', [...zone.socials, { id: `social-${Date.now().toString(36)}`, label: 'Instagram', href: '', icon: 'instagram' }])}
          >
            Add social link
          </Button>
        </div>
      </FormCard>

      <FormCard title="Global call to action" description="This CTA is shared by the homepage close and the primary navigation.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Eyebrow" value={zone.cta.eyebrow ?? ''} onChange={(event) => editor.update('cta', { eyebrow: event.target.value })} />
          <Input label="Button text" value={zone.cta.buttonLabel} onChange={(event) => editor.update('cta', { buttonLabel: event.target.value })} />
          <Input label="Button URL" value={zone.cta.buttonHref} onChange={(event) => editor.update('cta', { buttonHref: event.target.value })} />
          <div className="sm:col-span-2">
            <Input label="Heading" required value={zone.cta.headline} onChange={(event) => editor.update('cta', { headline: event.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Description" rows={3} value={zone.cta.body ?? ''} onChange={(event) => editor.update('cta', { body: event.target.value })} />
          </div>
        </div>
      </FormCard>

      <FormCard title="Trust and credentials" description="Reusable proof points shown with global statistics and trust badges.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Client count" value={zone.trust.clientCount} onChange={(event) => editor.update('trust', { clientCount: event.target.value })} placeholder="e.g. 38" />
          <Input label="Projects count" value={zone.trust.projectsCount} onChange={(event) => editor.update('trust', { projectsCount: event.target.value })} />
          <Input label="Years of experience" value={zone.trust.experienceYears} onChange={(event) => editor.update('trust', { experienceYears: event.target.value })} />
          <Input label="Average rating" value={zone.trust.rating} onChange={(event) => editor.update('trust', { rating: event.target.value })} placeholder="4.9/5" />
        </div>
        <RepeaterField
          label="Additional global statistics"
          value={zone.trust.stats}
          onChange={(stats) => editor.update('trust', { stats })}
          fields={[
            { key: 'value', label: 'Value', placeholder: '120+' },
            { key: 'label', label: 'Label', placeholder: 'Projects delivered' },
          ]}
          create={() => ({ id: `stat-${Date.now().toString(36)}`, value: '', label: '' })}
          addLabel="Add statistic"
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <StringListField label="Trust badges" value={zone.trust.badges} onChange={(badges) => editor.update('trust', { badges })} addLabel="Add badge" minRows={0} />
          <StringListField label="Certifications" value={zone.trust.certifications} onChange={(certifications) => editor.update('trust', { certifications })} addLabel="Add certification" minRows={0} />
          <StringListField label="Awards" value={zone.trust.awards} onChange={(awards) => editor.update('trust', { awards })} addLabel="Add award" minRows={0} />
        </div>
      </FormCard>

      <FormCard title="Footer and newsletter CTA" description="Footer description, navigation groups, contact links and optional newsletter promotion.">
        <Textarea label="Footer description" rows={2} value={zone.footer.tagline} onChange={(event) => editor.update('footer', { tagline: event.target.value })} />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Input label="Copyright text" value={zone.footer.copyrightText} onChange={(event) => editor.update('footer', { copyrightText: event.target.value })} />
          <Input label="Legal note" value={zone.footer.legalNote ?? ''} onChange={(event) => editor.update('footer', { legalNote: event.target.value })} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <LinkListEditor label="Quick links" value={zone.footer.quickLinks} onChange={(quickLinks) => editor.update('footer', { quickLinks })} />
          <LinkListEditor label="Service links" value={zone.footer.serviceLinks} onChange={(serviceLinks) => editor.update('footer', { serviceLinks })} />
        </div>
        <div className="mt-6">
          <RepeaterField
            label="Footer locations"
            value={zone.footer.offices}
            onChange={(offices) => editor.update('footer', { offices })}
            fields={[
              { key: 'city', label: 'City', placeholder: 'San Francisco' },
              { key: 'address', label: 'Address', placeholder: 'Street and suite' },
              { key: 'phone', label: 'Phone', placeholder: '+1 415 555 0100' },
            ]}
            create={() => ({ id: `office-${Date.now().toString(36)}`, city: '', address: '', phone: '' })}
            addLabel="Add location"
          />
        </div>
        <div className="mt-6 rounded-xl border border-white/[0.07] p-4">
          <Switch
            label="Show footer newsletter promotion"
            description="This is a configurable link CTA; it does not collect email addresses."
            checked={zone.footer.newsletter.enabled}
            onChange={(enabled) => editor.update('footer', { newsletter: { ...zone.footer.newsletter, enabled } })}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Heading" value={zone.footer.newsletter.heading} onChange={(event) => editor.update('footer', { newsletter: { ...zone.footer.newsletter, heading: event.target.value } })} />
            <Input label="Button text" value={zone.footer.newsletter.buttonText} onChange={(event) => editor.update('footer', { newsletter: { ...zone.footer.newsletter, buttonText: event.target.value } })} />
            <Input label="Button URL" value={zone.footer.newsletter.href} onChange={(event) => editor.update('footer', { newsletter: { ...zone.footer.newsletter, href: event.target.value } })} />
            <Textarea label="Description" rows={2} value={zone.footer.newsletter.description} onChange={(event) => editor.update('footer', { newsletter: { ...zone.footer.newsletter, description: event.target.value } })} />
          </div>
        </div>
      </FormCard>

      <FormCard title="Default SEO" description="Fallback page title, description, keywords and social-sharing image used site-wide.">
        <div id="seo" className="grid scroll-mt-32 gap-5 sm:grid-cols-2">
          <Input label="Site title" value={zone.seo.title} onChange={(event) => editor.update('seo', { title: event.target.value })} />
          <Input label="Social handle" value={zone.seo.twitterHandle ?? ''} onChange={(event) => editor.update('seo', { twitterHandle: event.target.value })} placeholder="@agency" />
          <Input label="Canonical site URL" value={zone.seo.siteUrl ?? ''} onChange={(event) => editor.update('seo', { siteUrl: event.target.value })} placeholder="https://example.com" />
          <Input label="Locale" value={zone.seo.locale ?? ''} onChange={(event) => editor.update('seo', { locale: event.target.value })} placeholder="en_US" />
          <Input label="Theme color" type="color" value={zone.seo.themeColor ?? '#050505'} onChange={(event) => editor.update('seo', { themeColor: event.target.value })} className="!h-12 !p-1" />
          <div className="sm:col-span-2">
            <Textarea label="Default meta description" rows={3} value={zone.seo.description} onChange={(event) => editor.update('seo', { description: event.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Default keywords"
              rows={3}
              value={zone.seo.keywords.join('\n')}
              onChange={(event) => editor.update('seo', { keywords: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })}
              hint="One keyword or phrase per line."
            />
          </div>
          <ImageField label="Default social-sharing image" value={zone.seo.ogImage ?? ''} onChange={(ogImage) => editor.update('seo', { ogImage })} scope="seo" aspect="1.91/1" />
        </div>
      </FormCard>

      <FormCard title="Site display options" description="Keep the existing site-wide section controls in the same central settings layer.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Switch label="Show homepage hero" checked={zone.theme.heroEnabled !== false} onChange={(heroEnabled) => editor.update('theme', { heroEnabled })} />
          <Switch label="Show testimonials" checked={zone.theme.showTestimonials !== false} onChange={(showTestimonials) => editor.update('theme', { showTestimonials })} />
          <Switch label="Show pricing preview" checked={zone.theme.showPricing !== false} onChange={(showPricing) => editor.update('theme', { showPricing })} />
          <Switch label="Show latest articles" checked={zone.theme.showBlog !== false} onChange={(showBlog) => editor.update('theme', { showBlog })} />
        </div>
      </FormCard>
    </div>
  )
}
