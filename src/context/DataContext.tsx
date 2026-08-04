import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'
import { createEmptyData, GUEST_STORAGE_KEY, loadLocalData, mergeData, saveLocalData, storageKeyForUser } from '../lib/storage'
import type { AppData, CommandDocument, UserSettings, WeekProgress } from '../types/domain'

interface DataContextValue {
  data: AppData
  loading: boolean
  connectionError: string | null
  saveWeekProgress: (progress: WeekProgress) => Promise<void>
  saveDocument: (document: CommandDocument) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  updateSettings: (settings: Partial<UserSettings>) => void
  replaceData: (data: AppData) => Promise<void>
  deleteAllData: () => Promise<void>
  migrateGuestData: () => Promise<{ weeks: number; documents: number }>
  guestDataAvailable: boolean
}

const DataContext = createContext<DataContextValue | null>(null)

function fromWeekRow(row: Record<string, unknown>): WeekProgress {
  return {
    weekId: String(row.week_id),
    status: row.status as WeekProgress['status'],
    readingCompletion: (row.reading_completion ?? {}) as Record<string, boolean>,
    exerciseCompletion: (row.exercise_completion ?? {}) as Record<string, boolean>,
    responses: (row.prompt_responses ?? {}) as Record<string, string>,
    privateNotes: String(row.private_notes ?? ''),
    decisionJournal: String(row.decision_journal ?? ''),
    lessonsLearned: String(row.lessons_learned ?? ''),
    remainingQuestions: String(row.remaining_questions ?? ''),
    hoursSpent: Number(row.hours_spent ?? 0),
    confidence: Number(row.confidence_rating ?? 0),
    rubricScores: (row.rubric_scores ?? []) as WeekProgress['rubricScores'],
    startedAt: row.started_at ? String(row.started_at) : null,
    completedAt: row.completed_at ? String(row.completed_at) : null,
    updatedAt: String(row.updated_at),
  }
}

function toWeekRow(userId: string, progress: WeekProgress) {
  return {
    user_id: userId,
    week_id: progress.weekId,
    status: progress.status,
    reading_completion: progress.readingCompletion,
    exercise_completion: progress.exerciseCompletion,
    prompt_responses: progress.responses,
    private_notes: progress.privateNotes,
    decision_journal: progress.decisionJournal,
    lessons_learned: progress.lessonsLearned,
    remaining_questions: progress.remainingQuestions,
    hours_spent: progress.hoursSpent,
    confidence_rating: progress.confidence,
    rubric_scores: progress.rubricScores,
    started_at: progress.startedAt,
    completed_at: progress.completedAt,
    updated_at: progress.updatedAt,
  }
}

function fromDocumentRow(row: Record<string, unknown>): CommandDocument {
  return {
    id: String(row.document_id),
    type: row.document_type as CommandDocument['type'],
    title: String(row.title ?? ''),
    relatedWeekId: row.related_week_id ? String(row.related_week_id) : null,
    content: String(row.content ?? ''),
    metadata: (row.metadata ?? {}) as CommandDocument['metadata'],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function toDocumentRow(userId: string, document: CommandDocument) {
  return {
    user_id: userId,
    document_id: document.id,
    document_type: document.type,
    title: document.title,
    related_week_id: document.relatedWeekId,
    content: document.content,
    metadata: document.metadata,
    created_at: document.createdAt,
    updated_at: document.updatedAt,
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<AppData>(() => loadLocalData())
  const [loading, setLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const dataRef = useRef(data)
  const scopeKey = storageKeyForUser(user?.id)

  const commitLocal = useCallback((next: AppData, key = scopeKey) => {
    dataRef.current = next
    setData(next)
    saveLocalData(next, key)
  }, [scopeKey])

  useEffect(() => {
    let active = true
    const local = loadLocalData(scopeKey)
    commitLocal(local, scopeKey)
    setConnectionError(null)
    if (!user || !supabase) return () => { active = false }
    setLoading(true)
    Promise.all([
      supabase.from('week_progress').select('*').eq('user_id', user.id),
      supabase.from('command_documents').select('*').eq('user_id', user.id),
    ]).then(([weeksResult, docsResult]) => {
      if (!active) return
      const remoteError = weeksResult.error ?? docsResult.error
      if (remoteError) {
        setConnectionError(remoteError.message)
        return
      }
      const remote: AppData = {
        ...createEmptyData(),
        settings: local.settings,
        weekProgress: Object.fromEntries((weeksResult.data ?? []).map((row) => {
          const progress = fromWeekRow(row)
          return [progress.weekId, progress]
        })),
        commandDocuments: (docsResult.data ?? []).map(fromDocumentRow),
      }
      commitLocal(mergeData(remote, local), scopeKey)
    }).catch((remoteError: unknown) => {
      if (active) setConnectionError(remoteError instanceof Error ? remoteError.message : 'Could not load remote data.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [commitLocal, scopeKey, user])

  const saveWeekProgress = useCallback(async (progress: WeekProgress) => {
    const next = { ...dataRef.current, weekProgress: { ...dataRef.current.weekProgress, [progress.weekId]: progress } }
    commitLocal(next)
    if (user && supabase) {
      const { error } = await supabase.from('week_progress').upsert(toWeekRow(user.id, progress), { onConflict: 'user_id,week_id' })
      if (error) {
        setConnectionError(error.message)
        throw error
      }
      setConnectionError(null)
    }
  }, [commitLocal, user])

  const saveDocument = useCallback(async (document: CommandDocument) => {
    const documents = dataRef.current.commandDocuments.filter((item) => item.id !== document.id)
    const next = { ...dataRef.current, commandDocuments: [document, ...documents] }
    commitLocal(next)
    if (user && supabase) {
      const { error } = await supabase.from('command_documents').upsert(toDocumentRow(user.id, document), { onConflict: 'user_id,document_id' })
      if (error) {
        setConnectionError(error.message)
        throw error
      }
      setConnectionError(null)
    }
  }, [commitLocal, user])

  const deleteDocument = useCallback(async (id: string) => {
    commitLocal({ ...dataRef.current, commandDocuments: dataRef.current.commandDocuments.filter((document) => document.id !== id) })
    if (user && supabase) {
      const { error } = await supabase.from('command_documents').delete().eq('user_id', user.id).eq('document_id', id)
      if (error) throw error
    }
  }, [commitLocal, user])

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    commitLocal({ ...dataRef.current, settings: { ...dataRef.current.settings, ...settings } })
  }, [commitLocal])

  const replaceData = useCallback(async (replacement: AppData) => {
    if (user && supabase) {
      const [weeksDelete, docsDelete] = await Promise.all([
        supabase.from('week_progress').delete().eq('user_id', user.id),
        supabase.from('command_documents').delete().eq('user_id', user.id),
      ])
      if (weeksDelete.error || docsDelete.error) throw weeksDelete.error ?? docsDelete.error
      const weeks = Object.values(replacement.weekProgress)
      if (weeks.length) {
        const { error } = await supabase.from('week_progress').insert(weeks.map((progress) => toWeekRow(user.id, progress)))
        if (error) throw error
      }
      if (replacement.commandDocuments.length) {
        const { error } = await supabase.from('command_documents').insert(replacement.commandDocuments.map((document) => toDocumentRow(user.id, document)))
        if (error) throw error
      }
    }
    commitLocal(replacement)
  }, [commitLocal, user])

  const deleteAllData = useCallback(async () => {
    if (user && supabase) {
      const [weeksDelete, docsDelete] = await Promise.all([
        supabase.from('week_progress').delete().eq('user_id', user.id),
        supabase.from('command_documents').delete().eq('user_id', user.id),
      ])
      if (weeksDelete.error || docsDelete.error) throw weeksDelete.error ?? docsDelete.error
    }
    commitLocal(createEmptyData())
  }, [commitLocal, user])

  const migrateGuestData = useCallback(async () => {
    if (!user || !supabase) throw new Error('Sign in before migrating guest data.')
    const guest = loadLocalData(GUEST_STORAGE_KEY)
    const merged = mergeData(dataRef.current, guest)
    await replaceData(merged)
    return { weeks: Object.keys(guest.weekProgress).length, documents: guest.commandDocuments.length }
  }, [replaceData, user])

  const guest = loadLocalData(GUEST_STORAGE_KEY)
  const value: DataContextValue = {
    data,
    loading,
    connectionError,
    saveWeekProgress,
    saveDocument,
    deleteDocument,
    updateSettings,
    replaceData,
    deleteAllData,
    migrateGuestData,
    guestDataAvailable: Boolean(Object.keys(guest.weekProgress).length || guest.commandDocuments.length),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used inside DataProvider.')
  return context
}
