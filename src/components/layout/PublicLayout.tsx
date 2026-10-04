import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { ToastViewport } from '@/components/ui/Toast'

/** Resets scroll on navigation but honours in-page hash links. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        window.requestAnimationFrame(() =>
          target.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        )
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

/** Public site shell — everything outside `/admin`. */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <ScrollRestoration />
      <Navbar />
      <main id="main" className="flex-1 pt-[var(--nav-h)]">
        <Outlet />
      </main>
      <Footer />
      <ToastViewport />
    </div>
  )
}
