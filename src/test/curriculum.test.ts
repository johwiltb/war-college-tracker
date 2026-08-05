import { describe, expect, it } from 'vitest'
import { allWeeks, curriculum, validateCurriculum } from '../data/curriculum'

describe('curriculum validation', () => {
  it('contains eight terms and 96 complete weeks', () => {
    expect(curriculum).toHaveLength(8)
    expect(allWeeks).toHaveLength(96)
    expect(validateCurriculum()).toEqual([])
  })

  it('gives every week real study material', () => {
    allWeeks.forEach((week) => {
      expect(week.coreMinutes).toBeGreaterThanOrEqual(60)
      expect(week.coreMinutes).toBeLessThanOrEqual(120)
      expect(week.extensionMinutes).toBeGreaterThanOrEqual(0)
      expect(week.guidanceSteps.length).toBeGreaterThanOrEqual(3)
      expect(week.learningObjectives.length).toBeGreaterThanOrEqual(3)
      expect(week.readings.some((reading) => reading.requirement === 'required')).toBe(true)
      expect(week.exercises[0].instructions.length).toBeGreaterThan(100)
      expect(week.prompts[0].prompt.length).toBeGreaterThan(200)
    })
  })

  it('gives Term 1 exact section-level reading assignments and progressive writing targets', () => {
    const termOne = allWeeks.slice(0, 12)
    termOne.forEach((week) => {
      expect(week.readings[0].assignment).not.toContain('sections most directly addressing')
      expect(week.readings[0].assignment.length).toBeGreaterThan(80)
    })
    expect(termOne[0].prompts[0].suggestedMinimumWords).toBe(250)
    expect(termOne[11].prompts[0].suggestedMinimumWords).toBe(700)
  })

  it('keeps week numbering and IDs stable', () => {
    allWeeks.forEach((week, index) => {
      expect(week.number).toBe(index + 1)
      expect(week.id).toBe(`week-${index + 1}`)
    })
  })
})
