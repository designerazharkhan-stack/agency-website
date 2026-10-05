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
    const observed = new WeakSet<Element>()

    const observer = reduceMotion || !('IntersectionObserver' in window)
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                if (!once) entry.target.classList.remove('is-in')
                return
              }
              const element = entry.target as HTMLElement
              const index = Number(element.dataset.revealIndex ?? '0')
              window.setTimeout(() => element.classList.add('is-in'), index * stagger)
              if (once) observer?.unobserve(element)
            })
          },
          { threshold, rootMargin: '0px 0px -8% 0px' },
        )

    const observeIn = (root: ParentNode, direct?: Element) => {
      const elements = [
        ...(direct?.matches('.reveal') ? [direct as HTMLElement] : []),
        ...Array.from(root.querySelectorAll<HTMLElement>('.reveal')),
      ]
      for (const element of elements) {
        if (observed.has(element)) continue
        observed.add(element)
        if (observer) observer.observe(element)
        else element.classList.add('is-in')
      }
    }

    observeIn(document)

    // Page content is often added after its initial render when Firestore resolves.
    // Observe new reveal cards too; otherwise their opacity transition leaves blank card-sized gaps.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) observeIn(node, node)
        })
      })
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer?.disconnect()
    }
  }, [stagger, once, threshold])
}
