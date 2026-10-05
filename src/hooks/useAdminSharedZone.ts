import { useCallback, useEffect, useMemo, useState } from 'react'

import { defaultSharedZone } from '@/data/defaults'
import { firebaseReady } from '@/lib/firebase'
import { readSharedZoneForAdmin, saveSharedZone, subscribeToSharedZone } from '@/lib/content'
import type { SharedZone } from '@/types/content'

export function useAdminSharedZone() {
  const [value, setValue] = useState<SharedZone>(defaultSharedZone)
  const [saved, setSaved] = useState<SharedZone>(defaultSharedZone)
  const [loading, setLoading] = useState(firebaseReady)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToSharedZone(
      (next) => {
        setValue(next)
        setSaved(next)
        setLoading(false)
        setError(null)
      },
      (nextError) => {
        setError(nextError.message)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const update = useCallback(<K extends keyof SharedZone>(
    key: K,
    patch: Partial<SharedZone[K]>,
  ) => {
    setValue((current) => ({
      ...current,
      [key]: { ...current[key], ...patch },
    }))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      await saveSharedZone(value)
      setSaved(value)
      return await readSharedZoneForAdmin()
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Could not save Shared Zone settings.'
      setError(message)
      throw saveError
    } finally {
      setSaving(false)
    }
  }, [value])

  const reset = useCallback(() => setValue(saved), [saved])
  const dirty = useMemo(() => JSON.stringify(value) !== JSON.stringify(saved), [value, saved])

  return { value, setValue, update, save, reset, dirty, loading, saving, error }
}
