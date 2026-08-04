import { z } from 'zod'
import type { AppData, DataExport, DisplayMode, WeekProgress } from '../types/domain'

export const EXPORT_VERSION = 1 as const
export const GUEST_STORAGE_KEY = 'wct:data:guest'

const statusSchema = z.enum(['not-started', 'in-progress', 'needs-review', 'completed'])
const rubricSchema = z.object({ categoryId: z.string(), score: z.number().min(0).max(15), notes: z.string() })
const weekProgressSchema = z.object({
  weekId: z.string().regex(/^week-\d+$/),
  status: statusSchema,
  readingCompletion: z.record(z.string(), z.boolean()),
  exerciseCompletion: z.record(z.string(), z.boolean()),
  responses: z.record(z.string(), z.string()),
  privateNotes: z.string(),
  decisionJournal: z.string(),
  lessonsLearned: z.string(),
  remainingQuestions: z.string(),
  hoursSpent: z.number().min(0).max(10000),
  confidence: z.number().int().min(0).max(5),
  rubricScores: z.array(rubricSchema),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime(),
})
const documentSchema = z.object({
  id: z.string().min(1).max(200),
  type: z.enum(['doctrine-ledger', 'historical-decision', 'campaign-estimate', 'commanders-intent', 'decision-journal', 'after-action-review', 'personal-doctrine', 'other']),
  title: z.string().max(300),
  relatedWeekId: z.string().nullable(),
  content: z.string().max(2_000_000),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
const settingsSchema = z.object({
  displayMode: z.enum(['system', 'light', 'dark']),
  guestWelcomeComplete: z.boolean(),
  autosaveDelayMs: z.number().int().min(250).max(10000),
})
const appDataSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  weekProgress: z.record(z.string(), weekProgressSchema),
  commandDocuments: z.array(documentSchema).max(10000),
})
const exportSchema = appDataSchema.extend({
  exportVersion: z.literal(EXPORT_VERSION),
  exportedAt: z.string().datetime(),
})

export const defaultSettings = {
  displayMode: 'system' as DisplayMode,
  guestWelcomeComplete: false,
  autosaveDelayMs: 800,
}

export function createEmptyData(): AppData {
  return { version: 1, settings: { ...defaultSettings }, weekProgress: {}, commandDocuments: [] }
}

export function storageKeyForUser(userId?: string | null): string {
  return userId ? `wct:data:user:${userId}` : GUEST_STORAGE_KEY
}

export function loadLocalData(key = GUEST_STORAGE_KEY, storage: Pick<Storage, 'getItem'> = localStorage): AppData {
  try {
    const raw = storage.getItem(key)
    if (!raw) return createEmptyData()
    const parsed = appDataSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : createEmptyData()
  } catch {
    return createEmptyData()
  }
}

export function saveLocalData(data: AppData, key = GUEST_STORAGE_KEY, storage: Pick<Storage, 'setItem'> = localStorage): void {
  storage.setItem(key, JSON.stringify(data))
}

export function createExport(data: AppData, now = new Date().toISOString()): DataExport {
  return { ...data, exportVersion: EXPORT_VERSION, exportedAt: now }
}

export function parseDataExport(input: string): DataExport {
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch {
    throw new Error('This file is not valid JSON.')
  }
  const result = exportSchema.safeParse(parsed)
  if (!result.success) {
    const issue = result.error.issues[0]
    throw new Error(`Backup is invalid or incompatible: ${issue?.path.join('.') || 'root'} ${issue?.message || ''}`.trim())
  }
  return result.data
}

export function mergeData(base: AppData, incoming: AppData): AppData {
  const weekProgress: Record<string, WeekProgress> = { ...base.weekProgress }
  Object.entries(incoming.weekProgress).forEach(([weekId, progress]) => {
    const existing = weekProgress[weekId]
    if (!existing || Date.parse(progress.updatedAt) >= Date.parse(existing.updatedAt)) weekProgress[weekId] = progress
  })
  const docs = new Map(base.commandDocuments.map((document) => [document.id, document]))
  incoming.commandDocuments.forEach((document) => {
    const existing = docs.get(document.id)
    if (!existing || Date.parse(document.updatedAt) >= Date.parse(existing.updatedAt)) docs.set(document.id, document)
  })
  return { version: 1, settings: { ...base.settings, ...incoming.settings }, weekProgress, commandDocuments: [...docs.values()] }
}

export function draftKey(scope: string, itemId: string): string {
  return `wct:draft:${scope}:${itemId}`
}
