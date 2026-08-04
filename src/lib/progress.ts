import { allWeeks } from '../data/curriculum'
import { assessmentCriteria } from '../data/templates'
import type { CurriculumWeek, ProgressStatus, WeekProgress } from '../types/domain'

export function createBlankWeekProgress(weekId: string, now = new Date().toISOString()): WeekProgress {
  return {
    weekId,
    status: 'not-started',
    readingCompletion: {},
    exerciseCompletion: {},
    responses: {},
    privateNotes: '',
    decisionJournal: '',
    lessonsLearned: '',
    remainingQuestions: '',
    hoursSpent: 0,
    confidence: 0,
    rubricScores: assessmentCriteria.map((criterion) => ({ categoryId: criterion.id, score: 0, notes: '' })),
    startedAt: null,
    completedAt: null,
    updatedAt: now,
  }
}

export function calculateWeekPercent(week: CurriculumWeek, progress?: WeekProgress): number {
  if (!progress) return 0
  const readings = week.readings.filter((reading) => reading.requirement === 'required')
  const completeReadings = readings.filter((reading) => progress.readingCompletion[reading.id]).length
  const completeExercises = week.exercises.filter((exercise) => progress.exerciseCompletion[exercise.id]).length
  const completeResponses = week.prompts.filter((prompt) => Boolean(progress.responses[prompt.id]?.trim())).length
  const total = readings.length + week.exercises.length + week.prompts.length
  return total ? Math.round(((completeReadings + completeExercises + completeResponses) / total) * 100) : 0
}

export function isWeekComplete(week: CurriculumWeek, progress?: WeekProgress): boolean {
  if (!progress || progress.status !== 'completed') return false
  return week.readings.filter((reading) => reading.requirement === 'required').every((reading) => progress.readingCompletion[reading.id])
    && week.exercises.every((exercise) => progress.exerciseCompletion[exercise.id])
}

export function applyStatusDates(progress: WeekProgress, status: ProgressStatus, now = new Date().toISOString()): WeekProgress {
  return {
    ...progress,
    status,
    startedAt: status !== 'not-started' && !progress.startedAt ? now : progress.startedAt,
    completedAt: status === 'completed' ? (progress.completedAt ?? now) : null,
    updatedAt: now,
  }
}

export interface ProgressSummary {
  completionPercent: number
  weeksCompleted: number
  readingsCompleted: number
  totalReadings: number
  totalHours: number
  currentTerm: number
  recommendedWeekId: string
}

export function summarizeProgress(progressMap: Record<string, WeekProgress>): ProgressSummary {
  const completedWeeks = allWeeks.filter((week) => isWeekComplete(week, progressMap[week.id]))
  const readingsCompleted = allWeeks.reduce((total, week) => total + week.readings.filter((reading) => progressMap[week.id]?.readingCompletion[reading.id]).length, 0)
  const totalReadings = allWeeks.reduce((total, week) => total + week.readings.length, 0)
  const totalHours = Object.values(progressMap).reduce((total, progress) => total + (Number.isFinite(progress.hoursSpent) ? progress.hoursSpent : 0), 0)
  const recommended = allWeeks.find((week) => !isWeekComplete(week, progressMap[week.id])) ?? allWeeks[allWeeks.length - 1]
  return {
    completionPercent: Math.round((completedWeeks.length / allWeeks.length) * 100),
    weeksCompleted: completedWeeks.length,
    readingsCompleted,
    totalReadings,
    totalHours,
    currentTerm: Math.ceil(recommended.number / 12),
    recommendedWeekId: recommended.id,
  }
}
