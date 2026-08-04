import { allWeeks } from '../data/curriculum'
import { documentTypeLabels } from '../data/templates'
import type { AppData, CommandDocument } from '../types/domain'

function safeFilename(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'document'
}

export function downloadText(filename: string, text: string, type = 'text/plain'): void {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function commandDocumentMarkdown(document: CommandDocument): string {
  const week = allWeeks.find((item) => item.id === document.relatedWeekId)
  return `# ${document.title || 'Untitled document'}\n\n- Type: ${documentTypeLabels[document.type]}\n- Related week: ${week ? `Week ${week.number}: ${week.title}` : 'None'}\n- Updated: ${document.updatedAt}\n\n${document.content}\n`
}

export function exportDocumentMarkdown(document: CommandDocument): void {
  downloadText(`${safeFilename(document.title)}.md`, commandDocumentMarkdown(document), 'text/markdown')
}

export function combinedMarkdown(data: AppData): string {
  const documents = data.commandDocuments.map(commandDocumentMarkdown).join('\n\n---\n\n')
  const completedWork = allWeeks.flatMap((week) => {
    const progress = data.weekProgress[week.id]
    if (!progress || progress.status !== 'completed') return []
    const responses = week.prompts.map((prompt) => `### ${prompt.title}\n\n${progress.responses[prompt.id] || '_No response recorded._'}`).join('\n\n')
    const readings = week.readings.map((reading) => `- [${progress.readingCompletion[reading.id] ? 'x' : ' '}] ${reading.title} (${reading.requirement})`).join('\n')
    const exercises = week.exercises.map((exercise) => `- [${progress.exerciseCompletion[exercise.id] ? 'x' : ' '}] ${exercise.title}`).join('\n')
    const rubric = progress.rubricScores.map((score) => `- ${score.categoryId}: ${score.score}${score.notes ? ` — ${score.notes}` : ''}`).join('\n')
    return [`# Week ${week.number}: ${week.title}\n\n- Status: Completed\n- Hours: ${progress.hoursSpent}\n- Confidence: ${progress.confidence}/5\n- Started: ${progress.startedAt ?? 'Not recorded'}\n- Completed: ${progress.completedAt ?? 'Not recorded'}\n\n## Readings\n\n${readings}\n\n## Exercises\n\n${exercises}\n\n## Responses\n\n${responses}\n\n## Private notes\n\n${progress.privateNotes || '_None._'}\n\n## Decision journal\n\n${progress.decisionJournal || '_None._'}\n\n## Lessons learned\n\n${progress.lessonsLearned || '_None._'}\n\n## Remaining questions\n\n${progress.remainingQuestions || '_None._'}\n\n## Self-assessment\n\n${rubric || '_Not scored._'}`]
  }).join('\n\n---\n\n')
  return `# Joint Command & War College Tracker Export\n\nGenerated ${new Date().toISOString()}\n\n## Command documents\n\n${documents || '_No command documents._'}\n\n---\n\n## Completed weekly work\n\n${completedWork || '_No completed weeks._'}\n`
}
