import { AlertCircle, Check, CloudUpload, LoaderCircle } from 'lucide-react'
import type { SaveStatus } from '../types/domain'

const labels: Record<SaveStatus, string> = { unsaved: 'Unsaved', saving: 'Saving', saved: 'Saved', error: 'Save failed' }

export function SaveIndicator({ status }: { status: SaveStatus }) {
  const Icon = status === 'saved' ? Check : status === 'saving' ? LoaderCircle : status === 'error' ? AlertCircle : CloudUpload
  return <span className={`save-indicator save-${status}`} role="status"><Icon size={15} className={status === 'saving' ? 'spin' : ''} />{labels[status]}</span>
}
