import { useEffect } from 'react'

/**
 * Adds an `is-in` class to every `.reveal` element inside the returned ref as
 * it enters the viewport. Progressive enhancement: if IntersectionObserver is
 * unavailable, everything is revealed immediately.
 *
 * @param options.stagger  multiply the delay per element inside one block
 * @param options.once     unobserve after the first reveal (default true)
 */
export function useReveal(options?: {
  stagger?: number
  once?: boolean
  threshold?: number
}) {
  const { stagger = 70, once = true, threshold = 0.12 } = options ?? {}

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (!once) entry.target.classList.remove('is-in')
            return
          }
          const element = entry.target as HTMLElement
          const index = Number(element.dataset.revealIndex ?? '0')
          window.setTimeout(() => element.classList.add('is-in'), index * stagger)
          if (once) observer.unobserve(element)
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [stagger, once, threshold])
}
