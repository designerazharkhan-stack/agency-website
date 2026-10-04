import { useCallback, useEffect, useRef, useState } from 'react'

export interface ToastMessage {
  id: string
  tone: 'success' | 'error' | 'info'
  title: string
  description?: string
}

type Listener = (message: ToastMessage) => void

const listeners = new Set<Listener>()
let counter = 0

function emit(tone: ToastMessage['tone'], title: string, description?: string): string {
  counter += 1
  const id = `toast-${counter}`
  const message: ToastMessage = { id, tone, title, description }
  listeners.forEach((listener) => listener(message))
  return id
}

export const toast = {
  success: (title: string, description?: string) => emit('success', title, description),
  error: (title: string, description?: string) => emit('error', title, description),
  info: (title: string, description?: string) => emit('info', title, description),
}

/** Subscribe the calling component to the global toast bus. */
export function useToastSubscription(onToast: (message: ToastMessage) => void): void {
  useEffect(() => {
    listeners.add(onToast)
    return () => {
      listeners.delete(onToast)
    }
  }, [onToast])
}

/** Local component-scoped toasts (used inside admin panels). */
export function useToasts(timeout = 5200) {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  const timers = useRef<number[]>([])

  const dismiss = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id))
  }, [])

  const push = useCallback(
    (tone: ToastMessage['tone'], title: string, description?: string) => {
      counter += 1
      const message: ToastMessage = { id: `local-${counter}`, tone, title, description }
      setMessages((current) => [...current, message])
      const timer = window.setTimeout(() => dismiss(message.id), timeout)
      timers.current.push(timer)
      return message.id
    },
    [dismiss, timeout],
  )

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      timers.current = []
    },
    [],
  )

  return {
    messages,
    dismiss,
    success: (title: string, description?: string) => push('success', title, description),
    error: (title: string, description?: string) => push('error', title, description),
    info: (title: string, description?: string) => push('info', title, description),
  }
}
