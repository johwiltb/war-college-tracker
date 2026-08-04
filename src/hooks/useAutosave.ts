import { useEffect, useRef, useState } from 'react'
import type { SaveStatus } from '../types/domain'

interface AutosaveOptions<T> {
  value: T
  delay: number
  onDraft: (value: T) => void
  onSave: (value: T) => Promise<void>
  enabled?: boolean
}

export function useAutosave<T>({ value, delay, onDraft, onSave, enabled = true }: AutosaveOptions<T>): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('saved')
  const initial = useRef(true)
  const onDraftRef = useRef(onDraft)
  const onSaveRef = useRef(onSave)
  onDraftRef.current = onDraft
  onSaveRef.current = onSave

  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    if (!enabled) return
    setStatus('unsaved')
    onDraftRef.current(value)
    const timer = window.setTimeout(async () => {
      setStatus('saving')
      try {
        await onSaveRef.current(value)
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [value, delay, enabled])

  return status
}
