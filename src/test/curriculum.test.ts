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
      expect(week.learningObjectives.length).toBeGreaterThanOrEqual(3)
      expect(week.readings.some((reading) => reading.requirement === 'required')).toBe(true)
      expect(week.exercises[0].instructions.length).toBeGreaterThan(100)
      expect(week.prompts[0].prompt.length).toBeGreaterThan(200)
    })
  })

  it('keeps week numbering and IDs stable', () => {
    allWeeks.forEach((week, index) => {
      expect(week.number).toBe(index + 1)
      expect(week.id).toBe(`week-${index + 1}`)
    })
  })
})
