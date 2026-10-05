import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { ToastViewport } from '@/components/ui/Toast'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

/**
 * Admin shell: fixed sidebar on large screens, off-canvas drawer on mobile.
 * Every dashboard route renders inside this layout.
 */
export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-ink-950">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:text-ink-950"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17.5rem] border-r border-white/[0.07] bg-ink-900/80 backdrop-blur-xl lg:block">
        <AdminSidebar />
      </aside>

      <AnimatePresence>
        {drawerOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close dashboard navigation"
              className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              id="admin-navigation-mobile"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
              className="absolute inset-y-0 left-0 w-[17.5rem] max-w-[86vw] border-r border-white/10 bg-ink-900"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="lg:pl-[17.5rem]">
        <AdminHeader onOpenSidebar={() => setDrawerOpen(true)} sidebarOpen={drawerOpen} />
        <main id="admin-main" className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastViewport />
    </div>
  )
}
