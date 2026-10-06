import { useEffect } from 'react'

interface RevealObserverEntry {
  observer: IntersectionObserver | null
  observed: WeakSet<Element>
  refs: number
}

const revealObservers = new Map<string, RevealObserverEntry>()
let revealMutations: MutationObserver | null = null

function observeRevealElements(root: ParentNode, direct?: Element) {
  const elements = [
    ...(direct?.matches('.reveal') ? [direct as HTMLElement] : []),
    ...Array.from(root.querySelectorAll<HTMLElement>('.reveal')),
  ]

  revealObservers.forEach(({ observer, observed }) => {
    for (const element of elements) {
      if (observed.has(element)) continue
      observed.add(element)
      if (observer) observer.observe(element)
      else element.classList.add('is-in')
    }
  })
}

function startRevealMutations() {
  if (revealMutations || typeof document === 'undefined') return
  revealMutations = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node instanceof Element) observeRevealElements(node, node)
      })
    })
  })
  revealMutations.observe(document.body, { childList: true, subtree: true })
}

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
    const key = `${stagger}:${once}:${threshold}:${reduceMotion}`
    let entry = revealObservers.get(key)
    const isNewObserver = !entry
    if (!entry) {
      const observer = reduceMotion || !('IntersectionObserver' in window)
        ? null
        : new IntersectionObserver(
            (entries) => {
              entries.forEach((intersection) => {
                if (!intersection.isIntersecting) {
                  if (!once) intersection.target.classList.remove('is-in')
                  return
                }
                const element = intersection.target as HTMLElement
                const index = Number(element.dataset.revealIndex ?? '0')
                window.setTimeout(() => element.classList.add('is-in'), index * stagger)
                if (once) observer?.unobserve(element)
              })
            },
            { threshold, rootMargin: '0px 0px -8% 0px' },
          )
      entry = { observer, observed: new WeakSet<Element>(), refs: 0 }
      revealObservers.set(key, entry)
    }
    entry.refs += 1
    startRevealMutations()
    if (isNewObserver) observeRevealElements(document)

    return () => {
      entry!.refs -= 1
      if (entry!.refs === 0) {
        entry!.observer?.disconnect()
        revealObservers.delete(key)
      }
      if (!revealObservers.size) {
        revealMutations?.disconnect()
        revealMutations = null
      }
    }
  }, [stagger, once, threshold])
}
