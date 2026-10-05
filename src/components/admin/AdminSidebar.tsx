import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  FolderKanban,
  Gauge,
  Home,
  Inbox,
  LayoutList,
  MessagesSquare,
  Settings2,
  Sparkles,
  Star,
  Wallet,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { LogoMark } from '@/components/layout/Logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { AvatarPreview } from '@/components/ui/FormKit'

export interface AdminNavItem {
  to: string
  label: string
  description: string
  icon: LucideIcon
  end?: boolean
}

/** Single source of truth for dashboard navigation and page headings. */
export const ADMIN_NAV: AdminNavItem[] = [
  {
    to: '/admin/dashboard',
    label: 'Overview',
    description: 'Counts, recent activity and quick actions',
    icon: Gauge,
    end: true,
  },
  { to: '/admin/dashboard/shared-zone', label: 'Shared Zone', description: 'Brand, contact, CTA, trust, footer and SEO', icon: Settings2 },
  { to: '/admin/dashboard/homepage', label: 'Homepage', description: 'Hero, statistics, process and features', icon: Home },
  { to: '/admin/dashboard/services', label: 'Services', description: 'Create, edit and publish services', icon: LayoutList },
  { to: '/admin/dashboard/portfolio', label: 'Portfolio', description: 'Projects, galleries and case studies', icon: FolderKanban },
  { to: '/admin/dashboard/blog', label: 'Blog', description: 'Articles, categories, tags and SEO', icon: FileText },
  { to: '/admin/dashboard/testimonials', label: 'Testimonials', description: 'Client quotes and ratings', icon: Star },
  { to: '/admin/dashboard/pricing', label: 'Pricing', description: 'Plans, features and featured plan', icon: Wallet },
  { to: '/admin/dashboard/messages', label: 'Messages', description: 'Contact form submissions', icon: Inbox },
]

export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
  return [...ADMIN_NAV]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))
}

export function AdminSidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const { identity } = useAuth()

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-5">
        <a href="/" className="flex items-center gap-3" aria-label="Agency Website — view public site">
          <LogoMark size={30} />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-light tracking-[0.1em] text-bone">ADMIN</span>
            <span className="text-[0.6rem] uppercase tracking-wide2 text-bone-dim">Content studio</span>
          </span>
        </a>
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            className="btn-quiet !p-2 text-bone-dim hover:text-bone"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Dashboard sections">
        <ul className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300',
                      isActive
                        ? 'border border-gold-500/25 bg-gold-500/[0.08] text-gold-100'
                        : 'border border-transparent text-bone-muted hover:bg-white/[0.035] hover:text-bone',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-gold-300' : 'text-bone-dim group-hover:text-gold-300',
                        )}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-tight">{item.label}</span>
                        <span className="mt-0.5 block text-[0.68rem] leading-snug text-bone-dim">
                          {item.description}
                        </span>
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/[0.07] px-5 py-4">
        <div className="flex items-center gap-3">
          <AvatarPreview url={identity.photoUrl ?? undefined} name={identity.displayName || 'Admin'} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-bone">{identity.displayName || 'Administrator'}</p>
            <p className="truncate text-[0.68rem] text-bone-dim">{identity.email}</p>
          </div>
          <Sparkles className="h-4 w-4 shrink-0 text-gold-500/70" aria-label="Administrator account" />
        </div>
      </div>
    </div>
  )
}

export function AdminNavIcon({ pathname }: { pathname: string }) {
  const item = findAdminNavItem(pathname)
  const Icon = item?.icon ?? MessagesSquare
  return <Icon className="h-4 w-4 text-gold-300" aria-hidden="true" />
}
