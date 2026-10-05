import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { SiteFooter } from './Footer'
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
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-public-navbar]')
    if (!header) return
    const updateHeight = () => {
      document.documentElement.style.setProperty('--public-header-height', `${header.offsetHeight}px`)
    }
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--public-header-height')
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <ScrollRestoration />
      <Navbar />
      <main id="main" className="flex-1" style={{ paddingTop: 'var(--public-header-height, var(--nav-h))' }}>
        <Outlet />
      </main>
      <SiteFooter />
      <ToastViewport />
    </div>
  )
}
