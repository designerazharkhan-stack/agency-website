import { useCallback, useEffect, useMemo, useState } from 'react'

import { defaultSharedZone } from '@/data/defaults'
import { firebaseReady } from '@/lib/firebase'
import { readSharedZoneAdminState, saveSharedZone } from '@/lib/content'
import type { SharedZone } from '@/types/content'

export function useAdminSharedZone() {
  const [value, setValue] = useState<SharedZone>(defaultSharedZone)
  const [saved, setSaved] = useState<SharedZone>(defaultSharedZone)
  const [loading, setLoading] = useState(firebaseReady)
  const [saving, setSaving] = useState(false)
  const [documentExists, setDocumentExists] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false)
      return
    }

    let active = true
    void readSharedZoneAdminState().then((state) => {
      if (active) {
        setValue(state.value)
        setSaved(state.value)
        setDocumentExists(state.documentExists)
        setLoading(false)
        setError(null)
      }
    }).catch((loadError: unknown) => {
      if (active) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load Site Settings.')
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
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
    const submitted = value
    if (JSON.stringify(submitted) === JSON.stringify(saved)) return submitted

    setSaving(true)
    setError(null)
    try {
      await saveSharedZone(submitted, saved, documentExists)
      setSaved(submitted)
      setDocumentExists(true)
      return submitted
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Could not save Shared Zone settings.'
      setError(message)
      throw saveError
    } finally {
      setSaving(false)
    }
  }, [value, saved, documentExists])

  const reset = useCallback(() => setValue(saved), [saved])
  const dirty = useMemo(() => JSON.stringify(value) !== JSON.stringify(saved), [value, saved])

  return { value, setValue, update, save, reset, dirty, loading, saving, error }
}
