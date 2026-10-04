import { useState } from 'react'
import { ExternalLink, Mail, Trash2 } from 'lucide-react'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { StringListField, TagInput } from '@/components/ui/FormKit'
import { GalleryUploader, ImageUploader } from '@/components/admin/ImageUploader'
import { AdminTable, type AdminColumn } from '@/components/admin/AdminTable'
import { EmptyState, ErrorState, LoadingState } from '@/components/admin/States'
import { Button } from '@/components/ui/Button'
import { Input, Select, Switch, Textarea } from '@/components/ui/Field'
import { useAdminMessages } from '@/hooks/useAdminMessages'
import { useAdminSetting } from '@/hooks/useAdminSetting'
import {
  useAdminPlans,
  useAdminPosts,
  useAdminProjects,
  useAdminTestimonials,
} from '@/hooks/useAdminCollection'
import { defaultSite } from '@/data/defaults'
import { toast } from '@/hooks/useToast'
import { removeItem, saveItem, setPublished } from '@/lib/content'
import { slugify, truncate } from '@/lib/utils'
import type {
  BlogPostDoc,
  ContactSubmissionDoc,
  PricingPlanDoc,
  ProjectDoc,
  TestimonialDoc,
} from '@/types/content'

function blankProject(): ProjectDoc {
  return {
    id: '',
    slug: '',
    title: '',
    client: '',
    category: 'Web Development',
    services: [],
    excerpt: '',
    challenge: '',
    approach: '',
    outcome: '',
    coverImage: '',
    gallery: [],
    meta: [],
    metrics: [],
    featured: false,
    published: false,
    year: String(new Date().getFullYear()),
    order: 99,
  }
}

function blankPost(): BlogPostDoc {
  return {
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [],
    category: 'Strategy',
    author: { name: 'Agency Website', role: 'Editorial team' },
    readMinutes: 5,
    featured: false,
    published: false,
    order: 99,
  }
}

function blankTestimonial(): TestimonialDoc {
  return {
    id: '',
    quote: '',
    name: '',
    role: '',
    company: '',
    rating: 5,
    featured: false,
    published: false,
    order: 99,
  }
}

function blankPlan(): PricingPlanDoc {
  return {
    id: '',
    name: '',
    tagline: '',
    price: 0,
    currency: 'USD',
    period: 'fixed fee',
    features: [],
    highlighted: false,
    ctaLabel: 'Start a project',
    ctaHref: '/contact',
    published: false,
    order: 99,
  }
}

function savePayload<T extends { id: string; createdAt?: string | null; updatedAt?: string | null }>(
  item: T,
): Record<string, unknown> {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = item
  void _id
  void _createdAt
  void _updatedAt
  return payload
}

export function PortfolioAdminPage() {
  const state = useAdminProjects()
  const categories = Array.from(new Set(state.items.map((item) => item.category))).sort()
  const columns: Array<AdminColumn<ProjectDoc>> = [
    {
      key: 'title',
      header: 'Project',
      render: (item) => (
        <div className="min-w-0">
          <p className="font-medium text-bone">{item.title || 'Untitled project'}</p>
          <p className="mt-0.5 text-xs text-bone-dim">{item.client || 'No client'}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', hideOnMobile: true },
    {
      key: 'featured',
      header: 'Featured',
      hideOnMobile: true,
      render: (item) => (item.featured ? 'Yes' : '—'),
    },
  ]

  return (
    <ResourceManager<ProjectDoc>
      collection="projects"
      singular="project"
      emptyTitle="No projects yet"
      emptyDescription="Create a case study and publish it to the portfolio."
      state={state}
      columns={columns}
      rowKey={(item) => item.id}
      createBlank={blankProject}
      searchText={(item) => `${item.title} ${item.client} ${item.category} ${item.excerpt}`}
      filters={categories.map((category) => ({
        label: category,
        value: category,
        match: (item: ProjectDoc) => item.category === category,
      }))}
      onSave={async (item, id) => {
        await saveItem('projects', savePayload({ ...item, slug: slugify(item.slug || item.title) }), { id })
        toast.success(id ? 'Project updated' : 'Project created', item.title)
      }}
      onDelete={async (id) => {
        await removeItem('projects', id)
        toast.success('Project deleted')
      }}
      onTogglePublished={async (id, published) => {
        await setPublished('projects', id, published)
        toast.success(published ? 'Project published' : 'Project hidden')
      }}
      renderForm={({ item, update }) => (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Project title" required value={item.title} onChange={(event) => update({ title: event.target.value })} />
            <Input label="Client" value={item.client} onChange={(event) => update({ client: event.target.value })} />
            <Input label="Slug" value={item.slug || slugify(item.title)} onChange={(event) => update({ slug: slugify(event.target.value) })} />
            <Input label="Category" value={item.category} onChange={(event) => update({ category: event.target.value })} />
            <Input label="Completion year" value={item.year ?? ''} onChange={(event) => update({ year: event.target.value })} />
            <Input label="Project URL" type="url" value={item.liveUrl ?? ''} onChange={(event) => update({ liveUrl: event.target.value })} />
          </div>
          <Textarea label="Project summary" rows={3} value={item.excerpt} onChange={(event) => update({ excerpt: event.target.value })} />
          <ImageUploader label="Featured image" value={item.coverImage} onChange={(coverImage) => update({ coverImage })} scope="projects" />
          <GalleryUploader label="Project gallery" value={item.gallery} onChange={(gallery) => update({ gallery })} scope="projects" />
          <StringListField label="Services" value={item.services} onChange={(services) => update({ services })} addLabel="Add service" />
          <RichTextEditor label="The challenge" value={item.challenge} onChange={(challenge) => update({ challenge })} rows={5} />
          <RichTextEditor label="Our approach" value={item.approach} onChange={(approach) => update({ approach })} rows={6} />
          <RichTextEditor label="The outcome" value={item.outcome} onChange={(outcome) => update({ outcome })} rows={5} />
          <Switch checked={item.featured} onChange={(featured) => update({ featured })} label="Featured project" description="Emphasise this project on the homepage." />
        </div>
      )}
    />
  )
}

export function BlogAdminPage() {
  const state = useAdminPosts()
  const categories = Array.from(new Set(state.items.map((item) => item.category))).sort()
  const columns: Array<AdminColumn<BlogPostDoc>> = [
    {
      key: 'title',
      header: 'Article',
      render: (item) => (
        <div className="min-w-0">
          <p className="font-medium text-bone">{item.title || 'Untitled article'}</p>
          <p className="mt-0.5 text-xs text-bone-dim">{item.category}</p>
        </div>
      ),
    },
    { key: 'author', header: 'Author', hideOnMobile: true, render: (item) => item.author.name },
    { key: 'featured', header: 'Featured', hideOnMobile: true, render: (item) => (item.featured ? 'Yes' : '—') },
  ]

  return (
    <ResourceManager<BlogPostDoc>
      collection="posts"
      singular="article"
      emptyTitle="No articles yet"
      emptyDescription="Write and publish your first journal article."
      state={state}
      columns={columns}
      rowKey={(item) => item.id}
      createBlank={blankPost}
      searchText={(item) => `${item.title} ${item.excerpt} ${item.category} ${item.tags.join(' ')}`}
      filters={categories.map((category) => ({
        label: category,
        value: category,
        match: (item: BlogPostDoc) => item.category === category,
      }))}
      onSave={async (item, id) => {
        await saveItem('posts', savePayload({ ...item, slug: slugify(item.slug || item.title) }), { id })
        toast.success(id ? 'Article updated' : 'Article created', item.title)
      }}
      onDelete={async (id) => {
        await removeItem('posts', id)
        toast.success('Article deleted')
      }}
      onTogglePublished={async (id, published) => {
        await setPublished('posts', id, published)
        toast.success(published ? 'Article published' : 'Article hidden')
      }}
      renderForm={({ item, update }) => (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Article title" required value={item.title} onChange={(event) => update({ title: event.target.value })} />
            <Input label="Slug" value={item.slug || slugify(item.title)} onChange={(event) => update({ slug: slugify(event.target.value) })} />
            <Input label="Category" value={item.category} onChange={(event) => update({ category: event.target.value })} />
            <Input label="Reading time (minutes)" type="number" min={1} value={String(item.readMinutes)} onChange={(event) => update({ readMinutes: Math.max(1, Number(event.target.value) || 1) })} />
            <Input label="Author name" value={item.author.name} onChange={(event) => update({ author: { ...item.author, name: event.target.value } })} />
            <Input label="Author role" value={item.author.role} onChange={(event) => update({ author: { ...item.author, role: event.target.value } })} />
          </div>
          <Textarea label="Excerpt" rows={3} value={item.excerpt} onChange={(event) => update({ excerpt: event.target.value })} />
          <ImageUploader label="Featured image" value={item.coverImage} onChange={(coverImage) => update({ coverImage })} scope="posts" />
          <TagInput label="Tags" value={item.tags} onChange={(tags) => update({ tags })} />
          <RichTextEditor label="Article content" value={item.content} onChange={(content) => update({ content })} rows={16} />
          <fieldset className="space-y-4 rounded-xl border border-white/[0.07] p-4">
            <legend className="px-2 text-xs uppercase tracking-wide2 text-gold-300">Search metadata</legend>
            <Input label="SEO title" value={item.seo?.title ?? ''} onChange={(event) => update({ seo: { ...item.seo, title: event.target.value } })} />
            <Textarea label="SEO description" rows={2} value={item.seo?.description ?? ''} onChange={(event) => update({ seo: { ...item.seo, description: event.target.value } })} />
          </fieldset>
          <Switch checked={item.featured} onChange={(featured) => update({ featured })} label="Featured article" description="Show this article in featured editorial sections." />
        </div>
      )}
    />
  )
}

export function TestimonialsAdminPage() {
  const state = useAdminTestimonials()
  const columns: Array<AdminColumn<TestimonialDoc>> = [
    { key: 'name', header: 'Client', render: (item) => <span className="font-medium text-bone">{item.name || 'Unnamed client'}</span> },
    { key: 'company', header: 'Company', hideOnMobile: true },
    { key: 'rating', header: 'Rating', hideOnMobile: true, render: (item) => `${item.rating} / 5` },
    { key: 'quote', header: 'Quote', hideOnMobile: true, render: (item) => truncate(item.quote, 90) },
  ]

  return (
    <ResourceManager<TestimonialDoc>
      collection="testimonials"
      singular="testimonial"
      emptyTitle="No testimonials yet"
      emptyDescription="Add a client quote and publish it to the website."
      state={state}
      columns={columns}
      rowKey={(item) => item.id}
      createBlank={blankTestimonial}
      searchText={(item) => `${item.name} ${item.company} ${item.role} ${item.quote}`}
      onSave={async (item, id) => {
        await saveItem('testimonials', savePayload(item), { id })
        toast.success(id ? 'Testimonial updated' : 'Testimonial created', item.name)
      }}
      onDelete={async (id) => {
        await removeItem('testimonials', id)
        toast.success('Testimonial deleted')
      }}
      onTogglePublished={async (id, published) => {
        await setPublished('testimonials', id, published)
        toast.success(published ? 'Testimonial published' : 'Testimonial hidden')
      }}
      renderForm={({ item, update }) => (
        <div className="space-y-5">
          <Textarea label="Testimonial" rows={6} required value={item.quote} onChange={(event) => update({ quote: event.target.value })} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Client name" required value={item.name} onChange={(event) => update({ name: event.target.value })} />
            <Input label="Position" value={item.role} onChange={(event) => update({ role: event.target.value })} />
            <Input label="Company" value={item.company} onChange={(event) => update({ company: event.target.value })} />
            <Input label="Rating (1–5)" type="number" min={1} max={5} value={String(item.rating)} onChange={(event) => update({ rating: Math.max(1, Math.min(5, Number(event.target.value) || 1)) })} />
            <Input label="Related project slug" value={item.projectSlug ?? ''} onChange={(event) => update({ projectSlug: slugify(event.target.value) })} />
          </div>
          <ImageUploader label="Client avatar" value={item.avatarUrl ?? ''} onChange={(avatarUrl) => update({ avatarUrl })} scope="testimonials" aspect="1/1" />
          <Switch checked={item.featured} onChange={(featured) => update({ featured })} label="Featured testimonial" description="Prioritise this quote in featured testimonial sections." />
        </div>
      )}
    />
  )
}

export function PricingAdminPage() {
  const state = useAdminPlans()
  const columns: Array<AdminColumn<PricingPlanDoc>> = [
    { key: 'name', header: 'Plan', render: (item) => <span className="font-medium text-bone">{item.name || 'Untitled plan'}</span> },
    { key: 'price', header: 'Price', hideOnMobile: true, render: (item) => `${item.currency} ${item.price.toLocaleString()} / ${item.period}` },
    { key: 'highlighted', header: 'Highlighted', hideOnMobile: true, render: (item) => (item.highlighted ? 'Yes' : '—') },
  ]

  return (
    <ResourceManager<PricingPlanDoc>
      collection="plans"
      singular="pricing plan"
      emptyTitle="No plans yet"
      emptyDescription="Add a pricing plan for the public pricing page."
      state={state}
      columns={columns}
      rowKey={(item) => item.id}
      createBlank={blankPlan}
      searchText={(item) => `${item.name} ${item.tagline} ${item.features.join(' ')}`}
      onSave={async (item, id) => {
        await saveItem('plans', savePayload(item), { id })
        toast.success(id ? 'Pricing plan updated' : 'Pricing plan created', item.name)
      }}
      onDelete={async (id) => {
        await removeItem('plans', id)
        toast.success('Pricing plan deleted')
      }}
      onTogglePublished={async (id, published) => {
        await setPublished('plans', id, published)
        toast.success(published ? 'Pricing plan published' : 'Pricing plan hidden')
      }}
      renderForm={({ item, update }) => (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Plan name" required value={item.name} onChange={(event) => update({ name: event.target.value })} />
            <Input label="Tagline" value={item.tagline} onChange={(event) => update({ tagline: event.target.value })} />
            <Input label="Price" type="number" min={0} value={String(item.price)} onChange={(event) => update({ price: Math.max(0, Number(event.target.value) || 0) })} />
            <Input label="Currency" value={item.currency} onChange={(event) => update({ currency: event.target.value.toUpperCase() })} />
            <Input label="Billing period" value={item.period} onChange={(event) => update({ period: event.target.value })} />
            <Input label="Badge (optional)" value={item.badge ?? ''} onChange={(event) => update({ badge: event.target.value })} />
            <Input label="CTA label" value={item.ctaLabel} onChange={(event) => update({ ctaLabel: event.target.value })} />
            <Input label="CTA link" value={item.ctaHref} onChange={(event) => update({ ctaHref: event.target.value })} />
          </div>
          <StringListField label="Features" value={item.features} onChange={(features) => update({ features })} addLabel="Add feature" minRows={4} />
          <Switch checked={item.highlighted} onChange={(highlighted) => update({ highlighted })} label="Highlight this plan" description="Give this option additional visual emphasis." />
        </div>
      )}
    />
  )
}

export function MessagesAdminPage() {
  const messages = useAdminMessages()
  const [actionError, setActionError] = useState<string | null>(null)
  const columns: Array<AdminColumn<ContactSubmissionDoc>> = [
    { key: 'name', header: 'From', render: (item) => <div><p className="font-medium text-bone">{item.name}</p><a className="text-xs text-gold-200" href={`mailto:${item.email}`}>{item.email}</a></div> },
    { key: 'message', header: 'Message', render: (item) => <p className="max-w-xl text-sm">{truncate(item.message, 180)}</p> },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Select
          label={`Status for ${item.name}`}
          value={item.status}
          onChange={(event) => {
            setActionError(null)
            void messages.setStatus(item.id, event.target.value as ContactSubmissionDoc['status']).catch((error: unknown) => {
              setActionError(error instanceof Error ? error.message : 'Could not update message status.')
            })
          }}
          options={[
            { value: 'new', label: 'New' },
            { value: 'read', label: 'Read' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-1">
          <a className="btn-quiet !p-2" href={`mailto:${item.email}`} aria-label={`Reply to ${item.name}`}>
            <Mail className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="btn-quiet !p-2 text-red-300"
            aria-label={`Delete message from ${item.name}`}
            onClick={() => {
              setActionError(null)
              void messages.remove(item.id).then(() => toast.success('Message deleted')).catch((error: unknown) => {
                setActionError(error instanceof Error ? error.message : 'Could not delete this message.')
              })
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <header>
        <h2 className="display text-display-xs">Contact messages</h2>
        <p className="mt-2 text-sm text-bone-muted">{messages.unread} new message{messages.unread === 1 ? '' : 's'}.</p>
      </header>
      {actionError ? <ErrorState title="Action failed" message={actionError} /> : null}
      {messages.error ? <ErrorState message={messages.error} onRetry={messages.reload} /> : null}
      {messages.loading ? (
        <LoadingState label="Loading contact messages" />
      ) : messages.items.length ? (
        <AdminTable columns={columns} rows={messages.items} rowKey={(item) => item.id} caption="Contact form messages" />
      ) : (
        <EmptyState title="Your inbox is clear" description="New contact form submissions will appear here." />
      )}
    </div>
  )
}

export function SeoAdminPage() {
  return (
    <section className="panel mx-auto max-w-3xl p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="chip-gold">Search &amp; social</span>
        <ExternalLink className="ml-auto mt-1 h-4 w-4 text-bone-dim" aria-hidden="true" />
      </div>
      <SeoSettingsForm />
    </section>
  )
}

function SeoSettingsForm() {
  const state = useAdminSetting('seo', defaultSite.seo)
  return (
    <form className="space-y-5" onSubmit={(event) => {
      event.preventDefault()
      void state.save().then(() => toast.success('SEO settings saved')).catch((error: unknown) => {
        toast.error('Could not save SEO settings', error instanceof Error ? error.message : 'Unknown error.')
      })
    }}>
      <h2 className="display text-display-xs">SEO defaults</h2>
      <Input label="Site title" value={state.value.title} onChange={(event) => state.update({ title: event.target.value })} />
      <Textarea label="Default meta description" rows={3} value={state.value.description} onChange={(event) => state.update({ description: event.target.value })} />
      <TagInput label="Keywords" value={state.value.keywords} onChange={(keywords) => state.update({ keywords })} />
      <Input label="Twitter handle" value={state.value.twitterHandle ?? ''} onChange={(event) => state.update({ twitterHandle: event.target.value })} placeholder="@agencywebsite" />
      <ImageUploader label="Default social image" value={state.value.ogImage ?? ''} onChange={(ogImage) => state.update({ ogImage })} scope="seo" />
      <div className="flex justify-end">
        <Button type="submit" loading={state.saving} disabled={!state.dirty}>Save SEO settings</Button>
      </div>
    </form>
  )
}
