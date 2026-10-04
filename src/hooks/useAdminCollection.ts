import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  defaultPlans,
  defaultPosts,
  defaultProjects,
  defaultServices,
  defaultTestimonials,
} from '@/data/defaults'
import {
  getAllPlansForAdmin,
  getAllPostsForAdmin,
  getAllProjectsForAdmin,
  getAllServicesForAdmin,
  getAllTestimonialsForAdmin,
  subscribeToCollection,
  type PageResult,
  type WritableCollection,
} from '@/lib/content'
import { firebaseReady } from '@/lib/firebase'
import { byOrder } from '@/lib/utils'
import type {
  BlogPostDoc,
  PricingPlanDoc,
  ProjectDoc,
  ServiceDoc,
  TestimonialDoc,
} from '@/types/content'

export type AdminSource = 'firebase' | 'demo'

export interface AdminCollectionState<T> {
  items: T[]
  loading: boolean
  error: string | null
  source: AdminSource
  reload: () => void
}

/**
 * Live Firestore subscription for a dashboard collection, with a bundled
 * fallback so the dashboard is fully explorable before Firebase exists.
 *
 * Every write still goes through the repository, which means every write is
 * authorised by Security Rules — this hook only decides where the *read*
 * payload comes from.
 */
export function useAdminCollection<T extends { id: string }>(
  collection: WritableCollection,
  load: () => Promise<PageResult<T>>,
  fallbacks: T[],
): AdminCollectionState<T> {
  const [items, setItems] = useState<T[]>(fallbacks)
  const [loading, setLoading] = useState(firebaseReady)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<AdminSource>(firebaseReady ? 'firebase' : 'demo')
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!firebaseReady) {
      setItems(fallbacks)
      setLoading(false)
      setSource('demo')
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToCollection<T>(
      collection,
      (next) => {
        if (!active) return
        setItems(byOrder(next))
        setSource('firebase')
        setLoading(false)
      },
      (subscriptionError) => {
        if (!active) return
        setError(subscriptionError.message)
        setLoading(false)
        // Fall back to a one-off read so the page still shows something useful.
        void load()
          .then((result) => {
            if (!active) return
            setItems(byOrder(result.items))
            setSource('firebase')
          })
          .catch(() => {
            if (!active) return
            setItems(fallbacks)
            setSource('demo')
          })
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
    // `load` and `fallbacks` are stable module-level references.
  }, [collection, load, fallbacks, nonce])

  const reload = useCallback(() => setNonce((value) => value + 1), [])

  return useMemo(() => ({ items, loading, error, source, reload }), [items, loading, error, source, reload])
}

/* Typed loaders — keeps collection names out of the page components. */

export const useAdminServices = () =>
  useAdminCollection<ServiceDoc>('services', getAllServicesForAdmin, defaultServices)

export const useAdminProjects = () =>
  useAdminCollection<ProjectDoc>('projects', getAllProjectsForAdmin, defaultProjects)

export const useAdminPosts = () =>
  useAdminCollection<BlogPostDoc>('posts', getAllPostsForAdmin, defaultPosts)

export const useAdminPlans = () =>
  useAdminCollection<PricingPlanDoc>('plans', getAllPlansForAdmin, defaultPlans)

export const useAdminTestimonials = () =>
  useAdminCollection<TestimonialDoc>('testimonials', getAllTestimonialsForAdmin, defaultTestimonials)
