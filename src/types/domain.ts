export type ProgressStatus = 'not-started' | 'in-progress' | 'needs-review' | 'completed'
export type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'error'
export type DisplayMode = 'system' | 'light' | 'dark'
export type ReadingRequirement = 'required' | 'optional'
export type ResponseType = 'short-analysis' | 'essay' | 'estimate' | 'order' | 'journal' | 'aar'
export type DocumentType =
  | 'doctrine-ledger'
  | 'historical-decision'
  | 'campaign-estimate'
  | 'commanders-intent'
  | 'decision-journal'
  | 'after-action-review'
  | 'personal-doctrine'
  | 'other'

export interface Reading {
  id: string
  title: string
  author: string
  publication: string
  assignment: string
  requirement: ReadingRequirement
  estimatedMinutes: number
  url: string | null
  citation: string
  instructions: string
  availabilityNotes?: string
}

export interface Exercise {
  id: string
  title: string
  instructions: string
  estimatedMinutes: number
  templateId?: string
}

export interface WritingPrompt {
  id: string
  title: string
  prompt: string
  responseType: ResponseType
  suggestedMinimumWords: number
  planningTemplateId?: string
  rubricCriteria?: string[]
}

export interface CurriculumWeek {
  id: string
  number: number
  termId: string
  title: string
  topic: string
  era: string
  commandLevel: string
  estimatedHours: number
  learningObjectives: string[]
  readings: Reading[]
  exercises: Exercise[]
  prompts: WritingPrompt[]
  historicalCampaigns: string[]
  tags: string[]
}

export interface CurriculumTerm {
  id: string
  number: number
  title: string
  description: string
  weeks: CurriculumWeek[]
}

export interface RubricScore {
  categoryId: string
  score: number
  notes: string
}

export interface WeekProgress {
  weekId: string
  status: ProgressStatus
  readingCompletion: Record<string, boolean>
  exerciseCompletion: Record<string, boolean>
  responses: Record<string, string>
  privateNotes: string
  decisionJournal: string
  lessonsLearned: string
  remainingQuestions: string
  hoursSpent: number
  confidence: number
  rubricScores: RubricScore[]
  startedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export interface CommandDocument {
  id: string
  type: DocumentType
  title: string
  relatedWeekId: string | null
  content: string
  metadata: Record<string, string | number | boolean | null>
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  displayMode: DisplayMode
  guestWelcomeComplete: boolean
  autosaveDelayMs: number
}

export interface AppData {
  version: 1
  settings: UserSettings
  weekProgress: Record<string, WeekProgress>
  commandDocuments: CommandDocument[]
}

export interface DataExport extends AppData {
  exportVersion: 1
  exportedAt: string
}

export interface AssessmentCriterion {
  id: string
  label: string
  maxScore: number
}
