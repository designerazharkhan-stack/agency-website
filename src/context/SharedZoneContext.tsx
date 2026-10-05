import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'

import { defaultSharedZone } from '@/data/defaults'
import { useSite } from './ContentContext'
import type { SharedZone } from '@/types/content'

const SharedZoneContext = createContext<SharedZone | null>(null)

export function SharedZoneProvider({ children }: { children: ReactNode }) {
  const { site } = useSite()
  const sharedZone = site.sharedZone ?? defaultSharedZone

  useEffect(() => {
    const root = document.documentElement
    const colors = sharedZone.brand
    const isHexColor = (value: string) => /^#[\da-f]{6}$/i.test(value)
    root.style.setProperty('--brand-primary', isHexColor(colors.primaryColor) ? colors.primaryColor : '#050505')
    root.style.setProperty('--brand-secondary', isHexColor(colors.secondaryColor) ? colors.secondaryColor : '#16161A')
    root.style.setProperty('--brand-accent', isHexColor(colors.accentColor) ? colors.accentColor : '#C29A3C')
  }, [sharedZone.brand])

  const value = useMemo(() => sharedZone, [sharedZone])
  return <SharedZoneContext.Provider value={value}>{children}</SharedZoneContext.Provider>
}

export function useSharedZone(): SharedZone {
  const zone = useContext(SharedZoneContext)
  if (!zone) throw new Error('useSharedZone must be used inside <SharedZoneProvider>')
  return zone
}
