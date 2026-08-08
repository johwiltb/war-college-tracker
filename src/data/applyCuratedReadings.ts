import { curriculum, validateCurriculum } from './curriculum'
import { curatedReadingsForWeek } from './curatedReadings'

for (const term of curriculum) {
  for (const week of term.weeks) {
    const curated = curatedReadingsForWeek(week.number)
    if (curated) week.readings = curated
  }
}

const errors = validateCurriculum(curriculum)
if (errors.length) throw new Error(`Invalid curated curriculum:\n${errors.join('\n')}`)
