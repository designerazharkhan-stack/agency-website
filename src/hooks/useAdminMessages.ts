import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  removeSubmission,
  setSubmissionStatus,
  subscribeToSubmissions,
} from '@/lib/content'
import { firebaseReady } from '@/lib/firebase'
import type { ContactSubmissionDoc, InquiryStatus } from '@/types/content'

export interface AdminMessagesState {
  items: ContactSubmissionDoc[]
  loading: boolean
  error: string | null
  unread: number
  setStatus: (id: string, status: InquiryStatus) => Promise<void>
  remove: (id: string) => Promise<void>
  reload: () => void
}

/** Live inbox of contact-form submissions, plus the write helpers the page uses. */
export function useAdminMessages(): AdminMessagesState {
  const [items, setItems] = useState<ContactSubmissionDoc[]>([])
  const [loading, setLoading] = useState(firebaseReady)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!firebaseReady) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToSubmissions(
      (next) => {
        setItems(next)
        setLoading(false)
      },
      (message) => {
        setError(message.message)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [nonce])

  const reload = useCallback(() => setNonce((value) => value + 1), [])

  const unread = useMemo(() => items.filter((item) => item.status === 'new').length, [items])

  return {
    items,
    loading,
    error,
    unread,
    setStatus: (id, status) => setSubmissionStatus(id, status),
    remove: (id) => removeSubmission(id),
    reload,
  }
}
