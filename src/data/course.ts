import type { CurriculumTerm } from '../types/domain'
import { curriculum as baseCurriculum, validateCurriculum } from './curriculum'
import { curatedReadingsForWeek } from './curatedReadings'

export const curriculum: CurriculumTerm[] = baseCurriculum.map((term) => ({
  ...term,
  weeks: term.weeks.map((week) => ({
    ...week,
    readings: curatedReadingsForWeek(week.number) ?? week.readings,
  })),
}))

export const allWeeks = curriculum.flatMap((term) => term.weeks)

const errors = validateCurriculum(curriculum)
if (errors.length) throw new Error(`Invalid curated curriculum:\n${errors.join('\n')}`)
