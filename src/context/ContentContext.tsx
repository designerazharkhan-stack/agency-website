import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { defaultSite } from '@/data/defaults'
import { readSiteContent } from '@/lib/content'
import type { SiteContent } from '@/types/content'

interface ContentContextValue {
  site: SiteContent
  loading: boolean
  reload: () => Promise<void>
}

const ContentContext = createContext<ContentContextValue | null>(null)

/**
 * Loads the CMS-backed shell content once per session and shares it with every
 * public page. Individual pages fetch their own collections, but brand, hero,
 * contact, socials, SEO and navigation are needed everywhere, so they are
 * hoisted here to avoid N duplicate reads.
 */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteContent>(defaultSite)
  const [loading, setLoading] = useState(true)

  const reload = useMemo(
    () => async () => {
      setLoading(true)
      try {
        setSite(await readSiteContent())
      } catch (error) {
        console.error('[content] Could not load site settings; using bundled defaults.', error)
        setSite(defaultSite)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const next = await readSiteContent()
        if (active) setSite(next)
      } catch (error) {
        console.error('[content] Could not load site settings; using bundled defaults.', error)
        if (active) setSite(defaultSite)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const value = useMemo<ContentContextValue>(() => ({ site, loading, reload }), [site, loading, reload])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useSite(): ContentContextValue {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useSite must be used inside <ContentProvider>')
  return context
}

/** Convenience: just the site settings object. */
export function useSiteContent(): SiteContent {
  return useSite().site
}
