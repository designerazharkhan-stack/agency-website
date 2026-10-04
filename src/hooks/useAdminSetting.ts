import { useCallback, useEffect, useMemo, useState } from 'react'

import { saveSetting, subscribeToSetting, type SettingsKey } from '@/lib/content'
import { firebaseReady } from '@/lib/firebase'
import type { SiteContent } from '@/types/content'

export interface AdminSettingState<K extends SettingsKey> {
  value: SiteContent[K]
  setValue: (next: SiteContent[K]) => void
  update: (patch: Partial<SiteContent[K]>) => void
  save: () => Promise<void>
  saving: boolean
  dirty: boolean
  loading: boolean
  error: string | null
  reset: () => void
}

/**
 * Editor state for one settings document (`settings/brand`, `settings/hero`…).
 *
 * Reads arrive over a live Firestore listener when Firebase is configured and
 * fall back to the bundled defaults otherwise. Saves always go to Firestore,
 * where Security Rules decide whether the signed-in admin is allowed.
 */
export function useAdminSetting<K extends SettingsKey>(
  key: K,
  initial: SiteContent[K],
): AdminSettingState<K> {
  const [value, setValue] = useState<SiteContent[K]>(initial)
  const [saved, setSaved] = useState<SiteContent[K]>(initial)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(firebaseReady)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValue(initial)
    setSaved(initial)
    if (!firebaseReady) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    const unsubscribe = subscribeToSetting<K>(
      key,
      (next) => {
        if (!active) return
        setValue(next)
        setSaved(next)
        setLoading(false)
      },
      (settingError) => {
        if (!active) return
        setError(settingError.message)
        setLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [key, initial])

  const update = useCallback((patch: Partial<SiteContent[K]>) => {
    setValue((current) => ({ ...(current as object), ...(patch as object) }) as SiteContent[K])
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      await saveSetting(key, value)
      setSaved(value)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save these settings.')
      throw saveError
    } finally {
      setSaving(false)
    }
  }, [key, value])

  const reset = useCallback(() => setValue(saved), [saved])

  const dirty = useMemo(() => JSON.stringify(value) !== JSON.stringify(saved), [value, saved])

  return { value, setValue, update, save, saving, dirty, loading, error, reset }
}
