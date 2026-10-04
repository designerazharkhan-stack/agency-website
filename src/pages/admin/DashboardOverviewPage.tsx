import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Database,
  FileText,
  FolderKanban,
  Inbox,
  LayoutList,
  MessageSquare,
  Star,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

import { Badge } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { FormCard } from '@/components/ui/FormKit'
import { EmptyState, LoadingState } from '@/components/admin/States'
import { useAuth } from '@/context/AuthContext'
import {
  useAdminPlans,
  useAdminPosts,
  useAdminProjects,
  useAdminServices,
  useAdminTestimonials,
} from '@/hooks/useAdminCollection'
import { useAdminMessages } from '@/hooks/useAdminMessages'
import { seedDefaultContent } from '@/lib/content'
import { firebaseEnvMissing, isFirebaseConfigured } from '@/lib/env'
import { toast } from '@/hooks/useToast'
import { formatRelative } from '@/lib/utils'
import { ADMIN_NAV } from '@/components/admin/AdminSidebar'
import type { LucideIcon } from 'lucide-react'

interface QuickAction {
  to: string
  label: string
  description: string
  icon: LucideIcon
}

const QUICK_ACTIONS: QuickAction[] = [
  { to: '/admin/dashboard/blog', label: 'Write an article', description: 'New blog post', icon: FileText },
  { to: '/admin/dashboard/portfolio', label: 'Add a project', description: 'New case study', icon: FolderKanban },
  { to: '/admin/dashboard/services', label: 'Edit services', description: 'Offer details', icon: LayoutList },
  { to: '/admin/dashboard/testimonials', label: 'Add a testimonial', description: 'Social proof', icon: Star },
  { to: '/admin/dashboard/messages', label: 'Read messages', description: 'Contact inbox', icon: Inbox },
  { to: '/admin/dashboard/settings', label: 'Update branding', description: 'Logo & contact', icon: Database },
]

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  to,
  loading,
}: {
  label: string
  value: number | string
  hint?: string
  icon: LucideIcon
  to: string
  loading: boolean
}) {
  return (
    <Link
      to={to}
      className="panel card-hover group flex flex-col gap-4 p-5 sm:p-6"
      aria-label={`${label}: ${loading ? 'loading' : value}. Open section.`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/[0.07] text-gold-300">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-bone-dim transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-300"
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="font-display text-4xl font-light leading-none text-bone">
          {loading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-white/[0.06]" /> : value}
        </p>
        <p className="mt-2 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">{label}</p>
        {hint ? <p className="mt-1 text-xs text-bone-dim/80">{hint}</p> : null}
      </div>
    </Link>
  )
}

export default function DashboardOverviewPage() {
  const { identity } = useAuth()
  const projects = useAdminProjects()
  const posts = useAdminPosts()
  const services = useAdminServices()
  const testimonials = useAdminTestimonials()
  const plans = useAdminPlans()
  const messages = useAdminMessages()

  const [seeding, setSeeding] = useState(false)
  const [confirmSeed, setConfirmSeed] = useState(false)
  const [seedError, setSeedError] = useState<string | null>(null)

  const publishedPosts = posts.items.filter((post) => post.published === true).length
  const publishedProjects = projects.items.filter((project) => project.published === true).length
  const liveTestimonials = testimonials.items.filter((item) => item.published === true).length
  const handleSeed = async () => {
    setSeeding(true)
    setSeedError(null)
    try {
      const report = await seedDefaultContent()
      toast.success(
        'Demo content seeded',
        `${report.written} documents written across ${report.collections.length} collections.`,
      )
      setConfirmSeed(false)
    } catch (error) {
      setSeedError(error instanceof Error ? error.message : 'Seeding failed.')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="display text-display-xs">
          Welcome back{identity.displayName ? `, ${identity.displayName.split(' ')[0]}` : ''}
        </h2>
        <p className="lede mt-3 max-w-2xl text-sm">
          Everything on the public website is editable from here — copy, imagery, pricing, projects and articles. Nothing
          on the live site requires a code change or a redeploy.
        </p>
      </section>

      <section aria-label="Content summary">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Projects"
            value={projects.items.length}
            hint={`${publishedProjects} published`}
            icon={FolderKanban}
            to="/admin/dashboard/portfolio"
            loading={projects.loading}
          />
          <StatCard
            label="Published posts"
            value={publishedPosts}
            hint={`${posts.items.length} total articles`}
            icon={FileText}
            to="/admin/dashboard/blog"
            loading={posts.loading}
          />
          <StatCard
            label="Services"
            value={services.items.length}
            hint={`${services.items.filter((item) => item.published).length} live on /services`}
            icon={LayoutList}
            to="/admin/dashboard/services"
            loading={services.loading}
          />
          <StatCard
            label="Testimonials"
            value={testimonials.items.length}
            hint={`${liveTestimonials} published`}
            icon={Star}
            to="/admin/dashboard/testimonials"
            loading={testimonials.loading}
          />
          <StatCard
            label="Pricing plans"
            value={plans.items.length}
            hint={`${plans.items.filter((item) => item.highlighted).length} highlighted`}
            icon={Database}
            to="/admin/dashboard/pricing"
            loading={plans.loading}
          />
          <StatCard
            label="Messages"
            value={messages.items.length}
            hint={messages.unread ? `${messages.unread} unread` : 'Inbox clear'}
            icon={Inbox}
            to="/admin/dashboard/messages"
            loading={messages.loading}
          />
        </div>
      </section>

      <section aria-label="Quick actions">
        <h3 className="font-display text-2xl font-light text-bone">Quick actions</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-4 transition-all duration-500 ease-luxe hover:border-gold-500/30 hover:bg-gold-500/[0.05]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-bone-dim transition-colors group-hover:border-gold-500/40 group-hover:text-gold-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-bone">{action.label}</span>
                  <span className="block text-xs text-bone-dim">{action.description}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section aria-label="Recent messages" className="grid gap-6 lg:grid-cols-2">
        <FormCard title="Recent enquiries" description="The five newest contact form submissions.">
          {messages.loading ? (
            <LoadingState label="Loading messages" rows={2} />
          ) : messages.items.length === 0 ? (
            <EmptyState
              title="No messages yet"
              description={
                isFirebaseConfigured
                  ? 'Submissions from the contact form appear here the moment they arrive.'
                  : 'Connect Firebase to start receiving contact form submissions here.'
              }
            />
          ) : (
            <ul className="space-y-3">
              {messages.items.slice(0, 5).map((item) => (
                <li key={item.id} className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-bone">{item.name}</span>
                    <span className="text-[0.65rem] uppercase tracking-wide2 text-bone-dim">
                      {formatRelative(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-bone-dim">{item.email}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-bone-muted">{item.message}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5">
            <Link to="/admin/dashboard/messages" className="btn-outline-light !py-2.5 text-[0.7rem]">
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Open the inbox
            </Link>
          </div>
        </FormCard>

        <FormCard
          title="Firebase connection"
          description="How the dashboard is storing and authorising content."
          actions={
            isFirebaseConfigured ? (
              <Badge tone="success">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Connected
              </Badge>
            ) : (
              <Badge tone="gold">
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                Demo mode
              </Badge>
            )
          }
        >
          {isFirebaseConfigured ? (
            <div className="space-y-4 text-sm text-bone-muted">
              <p className="leading-relaxed">
                Content lives in Firestore, images in Cloud Storage, and access is granted by the{' '}
                <code className="font-mono text-xs text-gold-200">admin</code> custom claim plus Firestore and Storage
                Security Rules.
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Auth', 'Email + password'],
                  ['Rules', 'Published-only public reads'],
                  ['Uploads', 'Admin-only writes'],
                  ['Content', 'Live subscriptions'],
                ].map(([term, description]) => (
                  <div key={term} className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3.5">
                    <dt className="text-[0.62rem] uppercase tracking-wide2 text-bone-dim">{term}</dt>
                    <dd className="mt-1 text-sm text-bone">{description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-bone-muted">
              <p className="leading-relaxed">
                No Firebase configuration detected, so the dashboard is showing bundled demo content and every save is
                disabled. Add your web app credentials to continue.
              </p>
              <ul className="space-y-2 font-mono text-xs text-gold-300">
                {firebaseEnvMissing.map((key) => (
                  <li key={key}>{key}=</li>
                ))}
              </ul>
              <p className="text-xs leading-relaxed text-bone-dim">
                Full walkthrough in <code className="font-mono text-gold-300">docs/FIREBASE_SETUP.md</code>. Never
                commit credentials — only the public web SDK config belongs in the frontend.
              </p>
            </div>
          )}

          {isFirebaseConfigured ? (
            <div className="mt-6 space-y-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmSeed(true)}
                icon={<Database className="h-4 w-4" aria-hidden="true" />}
              >
                Seed demo content
              </Button>
              <p className="text-xs leading-relaxed text-bone-dim">
                Writes the bundled starter content into Firestore so you can edit real documents straight away. Existing
                documents are merged, never overwritten, unless you confirm the overwrite option.
              </p>
              {seedError ? <p className="text-xs text-red-300">{seedError}</p> : null}
            </div>
          ) : null}
        </FormCard>
      </section>

      <section aria-label="All sections">
        <h3 className="font-display text-2xl font-light text-bone">All dashboard sections</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_NAV.filter((item) => item.to !== '/admin/dashboard').map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-bone-muted transition-colors hover:border-gold-500/25 hover:text-bone"
                >
                  <Icon className="h-4 w-4 shrink-0 text-gold-400/80" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-bone-dim" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <ConfirmDialog
        open={confirmSeed}
        onClose={() => setConfirmSeed(false)}
        onConfirm={() => void handleSeed()}
        loading={seeding}
        title="Seed demo content?"
        confirmLabel="Seed content"
        description="This writes the bundled starter services, projects, articles, pricing plans, testimonials and settings into Firestore. Documents that already exist are merged rather than replaced, and nothing is deleted."
      />
    </div>
  )
}
