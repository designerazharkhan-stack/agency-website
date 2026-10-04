import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ExternalLink, LogOut, Menu, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { AvatarPreview } from '@/components/ui/FormKit'
import { useAuth } from '@/context/AuthContext'
import { firebaseEnvMissing, isFirebaseConfigured } from '@/lib/env'
import { cn } from '@/lib/utils'
import { ADMIN_NAV, findAdminNavItem } from './AdminSidebar'

export function AdminHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { pathname } = useLocation()
  const { identity, signOut, refresh } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const current = findAdminNavItem(pathname)
  const section = ADMIN_NAV.find((item) => item.to === current?.to)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink-900/85 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="btn-ghost !px-3 !py-2.5 lg:hidden"
          aria-label="Open dashboard navigation"
          aria-expanded={false}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-light text-bone sm:text-2xl">
            {section?.label ?? 'Dashboard'}
          </h1>
          <p className="hidden truncate text-xs text-bone-dim sm:block">
            {section?.description ?? 'Manage everything on this website'}
          </p>
        </div>

        {!isFirebaseConfigured ? (
          <span className="chip-gold hidden sm:inline-flex" title={firebaseEnvMissing.join(', ')}>
            Demo content
          </span>
        ) : null}

        <Link
          to="/"
          className="btn-outline-light hidden !px-4 !py-2.5 text-[0.7rem] sm:inline-flex"
          title="Open the public site in a new tab"
        >
          View site
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={() => void refresh()}
          className="btn-quiet !p-2.5 text-bone-dim hover:text-gold-200"
          aria-label="Refresh your admin session and permissions"
          title="Refresh permissions"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              'flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-3 transition-colors hover:border-gold-500/30',
              menuOpen && 'border-gold-500/40',
            )}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <AvatarPreview url={identity.photoUrl ?? undefined} name={identity.displayName || 'Admin'} size={28} />
            <span className="hidden max-w-[9rem] truncate text-xs text-bone-muted md:block">
              {identity.displayName || 'Admin'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-bone-dim" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-lift"
            >
              <div className="border-b border-white/[0.07] px-4 py-3.5">
                <p className="truncate text-sm font-medium text-bone">{identity.displayName || 'Administrator'}</p>
                <p className="truncate text-xs text-bone-dim">{identity.email}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[0.62rem] uppercase tracking-wide2 text-gold-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                  Admin claim verified
                </p>
              </div>
              <div className="p-2">
                <Link to="/" role="menuitem" className="btn-quiet !px-3 !py-2.5 w-full justify-start text-sm">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  View public site
                </Link>
                <Button
                  role="menuitem"
                  variant="quiet"
                  className="w-full justify-start !px-3 !py-2.5 text-sm"
                  onClick={() => void signOut()}
                  icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
