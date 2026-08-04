import { describe, expect, it } from 'vitest'
import { allWeeks } from '../data/curriculum'
import { applyStatusDates, calculateWeekPercent, createBlankWeekProgress, isWeekComplete, summarizeProgress } from '../lib/progress'

describe('week completion behavior', () => {
  const week = allWeeks[0]

  it('does not treat status alone as complete', () => {
    const progress = applyStatusDates(createBlankWeekProgress(week.id), 'completed', '2026-08-04T12:00:00.000Z')
    expect(isWeekComplete(week, progress)).toBe(false)
  })

  it('requires required readings and exercises', () => {
    let progress = applyStatusDates(createBlankWeekProgress(week.id), 'completed', '2026-08-04T12:00:00.000Z')
    progress = {
      ...progress,
      readingCompletion: Object.fromEntries(week.readings.filter((reading) => reading.requirement === 'required').map((reading) => [reading.id, true])),
      exerciseCompletion: Object.fromEntries(week.exercises.map((exercise) => [exercise.id, true])),
    }
    expect(isWeekComplete(week, progress)).toBe(true)
  })

  it('calculates granular assigned-work progress', () => {
    const progress = createBlankWeekProgress(week.id)
    progress.readingCompletion[week.readings[0].id] = true
    expect(calculateWeekPercent(week, progress)).toBe(33)
  })

  it('summarizes hours and recommends the first incomplete week', () => {
    const progress = createBlankWeekProgress(week.id)
    progress.hoursSpent = 2.5
    const summary = summarizeProgress({ [week.id]: progress })
    expect(summary.totalHours).toBe(2.5)
    expect(summary.recommendedWeekId).toBe('week-1')
  })
})
