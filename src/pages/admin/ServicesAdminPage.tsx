import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { IconPicker, SlugField, StringListField } from '@/components/ui/FormKit'
import { Badge } from '@/components/ui/Section'
import { Input, Switch, Textarea } from '@/components/ui/Field'
import { useAdminServices } from '@/hooks/useAdminCollection'
import { toast } from '@/hooks/useToast'
import { removeItem, saveItem, setPublished } from '@/lib/content'
import { slugify, truncate } from '@/lib/utils'
import type { ServiceDoc } from '@/types/content'

function blankService(): ServiceDoc {
  return {
    id: '',
    slug: '',
    title: 'New service',
    shortTitle: '',
    excerpt: '',
    description: '',
    icon: 'sparkles',
    deliverables: [''],
    features: [''],
    startingPrice: 0,
    featured: false,
    published: false,
    order: 99,
  }
}

export default function ServicesAdminPage() {
  const state = useAdminServices()
  const [pending, setPending] = useState(false)

  const columns = [
    {
      key: 'title',
      header: 'Service',
      render: (service: ServiceDoc) => (
        <div className="min-w-0">
          <p className="font-medium text-bone">{service.title || 'Untitled service'}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-bone-dim">
            {truncate(service.excerpt || 'No summary yet', 90)}
          </p>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'URL',
      hideOnMobile: true,
      render: (service: ServiceDoc) => (
        <span className="font-mono text-xs text-bone-dim">/services#{service.slug || '…'}</span>
      ),
    },
    {
      key: 'features',
      header: 'Features',
      hideOnMobile: true,
      render: (service: ServiceDoc) => (
        <span className="text-xs text-bone-dim">
          {service.features.length} features · {service.deliverables.length} deliverables
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      hideOnMobile: true,
      render: (service: ServiceDoc) =>
        service.featured ? <Badge tone="gold">Featured</Badge> : <span className="text-xs text-bone-dim">—</span>,
    },
  ]

  const handleSave = async (service: ServiceDoc, id?: string) => {
    await saveItem(
      'services',
      { ...service, slug: slugify(service.slug || service.title) },
      { id },
    )
    toast.success(id ? 'Service updated' : 'Service created', service.title)
  }

  return (
    <ResourceManager<ServiceDoc>
      collection="services"
      singular="service"
      emptyTitle="No services yet"
      emptyDescription="Add your first service to populate the /services page and the homepage preview."
      state={state}
      columns={columns}
      rowKey={(service) => service.id}
      createBlank={blankService}
      searchText={(service) => `${service.title} ${service.excerpt} ${service.description} ${service.features.join(' ')}`}
      onSave={handleSave}
      onDelete={async (id) => {
        await removeItem('services', id)
        toast.success('Service deleted')
      }}
      onTogglePublished={async (id, published) => {
        setPending(true)
        try {
          await setPublished('services', id, published)
          toast.success(published ? 'Service published' : 'Service hidden', 'The /services page updated.')
        } finally {
          setPending(false)
        }
      }}
      renderForm={({ item, update }) => (
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Service title"
              required
              value={item.title}
              onChange={(event) => update({ title: event.target.value })}
              placeholder="Web Development"
            />
            <Input
              label="Short label"
              value={item.shortTitle ?? ''}
              onChange={(event) => update({ shortTitle: event.target.value })}
              placeholder="Web Dev"
              hint="Used in compact navigation and chips."
            />
          </div>

          <SlugField
            value={item.slug || slugify(item.title)}
            onChange={(slug) => update({ slug })}
            previewBase="/services"
          />

          <Textarea
            label="Card summary"
            rows={2}
            value={item.excerpt}
            onChange={(event) => update({ excerpt: event.target.value })}
            hint="One or two sentences shown on the services grid."
          />

          <RichTextEditor
            label="Full description"
            value={item.description}
            onChange={(description) => update({ description })}
            rows={10}
            hint="Markdown. This is the long-form copy on /services."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Starting price"
              type="number"
              min={0}
              step={100}
              value={String(item.startingPrice ?? 0)}
              onChange={(event) => update({ startingPrice: Number(event.target.value) || 0 })}
              hint="0 hides the figure and shows “Custom”."
            />
            <IconPicker label="Icon" value={item.icon} onChange={(icon) => update({ icon })} />
          </div>

          <StringListField
            label="Key features"
            value={item.features}
            onChange={(features) => update({ features })}
            minRows={4}
            addLabel="Add feature"
            hint="Short bullets shown under the card summary."
          />

          <StringListField
            label="Deliverables"
            value={item.deliverables}
            onChange={(deliverables) => update({ deliverables })}
            minRows={4}
            addLabel="Add deliverable"
            hint="What the client actually receives."
          />

          <Switch
            checked={item.featured === true}
            onChange={(featured) => update({ featured })}
            label="Featured service"
            description="Featured services are emphasised in the services grid."
          />

          <p className="flex items-center gap-2 text-xs text-bone-dim">
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Published services appear on /services and in the homepage preview. {pending ? 'Saving…' : null}
          </p>
        </div>
      )}
    />
  )
}
