import { useEffect, useState } from 'react'

/** Tracks window scroll position with a rAF-throttled listener. */
export function useScrollY(): number {
  const [y, setY] = useState(0)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        setY(window.scrollY)
        frame = 0
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return y
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold = 24): boolean {
  const y = useScrollY()
  return y > threshold
}

/** Which section id is currently in the middle of the viewport. */
export function useActiveSection(ids: string[], offset = 140): string {
  const [active, setActive] = useState('')
  const y = useScrollY()

  useEffect(() => {
    if (!ids.length) return
    let current = ''
    for (const id of ids) {
      const element = document.getElementById(id)
      if (!element) continue
      if (element.getBoundingClientRect().top - offset <= 0) current = id
    }
    if (!current) {
      const first = document.getElementById(ids[0])
      if (first && first.getBoundingClientRect().top - offset <= 0) current = ids[0]
    }
    setActive(current)
  }, [ids, offset, y])

  return active
}

/** Media query as boolean state. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    setMatches(media.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [query])

  return matches
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
