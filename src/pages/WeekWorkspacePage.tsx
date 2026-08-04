import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, ExternalLink, FileText, Lightbulb, MessageSquareText, ShieldAlert, Target } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SaveIndicator } from '../components/SaveIndicator'
import { useData } from '../context/DataContext'
import { allWeeks, curriculum } from '../data/curriculum'
import { assessmentCriteria, templateById } from '../data/templates'
import { useAutosave } from '../hooks/useAutosave'
import { applyStatusDates, calculateWeekPercent, createBlankWeekProgress } from '../lib/progress'
import { draftKey } from '../lib/storage'
import type { ProgressStatus, WeekProgress } from '../types/domain'
import { ProgressBar } from '../components/ProgressBar'

function loadDraft(weekId: string, base: WeekProgress): WeekProgress {
  try {
    const raw = localStorage.getItem(draftKey('week', weekId))
    if (!raw) return base
    const draft = JSON.parse(raw) as WeekProgress
    return draft.weekId === weekId && Date.parse(draft.updatedAt) >= Date.parse(base.updatedAt) ? draft : base
  } catch {
    return base
  }
}

function wordCount(value: string): number {
  return value.trim() ? value.trim().split(/\s+/).length : 0
}

export function WeekWorkspacePage() {
  const { weekId = '' } = useParams()
  const { data, saveWeekProgress } = useData()
  const week = allWeeks.find((item) => item.id === weekId)
  const baseProgress = useMemo(() => week ? (data.weekProgress[week.id] ?? createBlankWeekProgress(week.id)) : createBlankWeekProgress(weekId), [data.weekProgress, week, weekId])
  const [progress, setProgress] = useState<WeekProgress>(() => loadDraft(weekId, baseProgress))

  useEffect(() => setProgress(loadDraft(weekId, baseProgress)), [weekId]) // eslint-disable-line react-hooks/exhaustive-deps

  const onDraft = useCallback((value: WeekProgress) => localStorage.setItem(draftKey('week', value.weekId), JSON.stringify(value)), [])
  const onSave = useCallback(async (value: WeekProgress) => {
    await saveWeekProgress(value)
    localStorage.removeItem(draftKey('week', value.weekId))
  }, [saveWeekProgress])
  const saveStatus = useAutosave({ value: progress, delay: data.settings.autosaveDelayMs, onDraft, onSave })

  if (!week) return <div className="page empty-state"><h1>Week not found</h1><p>The requested curriculum week does not exist.</p><Link className="primary-button" to="/curriculum">Return to curriculum</Link></div>
  const term = curriculum.find((item) => item.id === week.termId)!
  const previous = allWeeks[week.number - 2]
  const next = allWeeks[week.number]
  const percent = calculateWeekPercent(week, progress)

  const update = (patch: Partial<WeekProgress>) => setProgress((current) => {
    const now = new Date().toISOString()
    const nextProgress = { ...current, ...patch, updatedAt: now }
    return current.status === 'not-started' && !('status' in patch) ? applyStatusDates(nextProgress, 'in-progress', now) : nextProgress
  })
  const setStatus = (status: ProgressStatus) => setProgress((current) => applyStatusDates(current, status))
  const applyTemplate = (promptId: string, templateId?: string) => {
    const template = templateById(templateId)
    if (!template) return
    update({ responses: { ...progress.responses, [promptId]: progress.responses[promptId]?.trim() ? progress.responses[promptId] : template.content } })
  }

  return (
    <div className="page week-page">
      <div className="week-topline"><Link to="/curriculum"><ArrowLeft size={16} /> Curriculum</Link><SaveIndicator status={saveStatus} /></div>
      <header className="week-header">
        <div className="week-header-index"><span>TERM {term.number}</span><strong>{String(week.number).padStart(2, '0')}</strong><small>WEEK</small></div>
        <div><p className="eyebrow">{term.title}</p><h1>{week.title}</h1><p>{week.topic}</p><div className="week-meta"><span>{week.era}</span><span>{week.commandLevel}</span><span><Clock3 size={15} /> {week.estimatedHours} estimated hours</span></div></div>
        <div className="week-header-progress"><strong>{percent}%</strong><span>assigned work</span><ProgressBar value={percent} /></div>
      </header>
      <div className="unclassified-banner"><ShieldAlert size={18} /><span><strong>Unclassified personal study only.</strong> Never enter classified, CUI, export-controlled, employer-sensitive, or current operational information.</span></div>

      <div className="workspace-layout">
        <div className="workspace-main">
          <section className="workspace-section objectives-section"><div className="section-icon"><Target /></div><div><p className="section-number">01 · INTENT</p><h2>Learning objectives</h2><ol>{week.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}</ol></div></section>
          <section className="workspace-section"><div className="section-title-row"><div><p className="section-number">02 · PREPARATION</p><h2>Assigned readings</h2></div><BookOpen /></div>
            {(['required', 'optional'] as const).map((requirement) => <div className="reading-group" key={requirement}><h3>{requirement === 'required' ? 'Required' : 'Optional'} readings</h3>{week.readings.filter((reading) => reading.requirement === requirement).map((reading) => <article className={`reading-item ${progress.readingCompletion[reading.id] ? 'complete' : ''}`} key={reading.id}><label className="check-control"><input type="checkbox" checked={Boolean(progress.readingCompletion[reading.id])} onChange={(event) => update({ readingCompletion: { ...progress.readingCompletion, [reading.id]: event.target.checked } })} /><span><CheckCircle2 /></span></label><div className="reading-copy"><div><h4>{reading.title}</h4><span>{reading.author}</span></div><p><strong>Assignment:</strong> {reading.assignment}</p><p>{reading.instructions}</p><details><summary>Citation &amp; availability</summary><p>{reading.citation}</p>{reading.availabilityNotes && <p>{reading.availabilityNotes}</p>}</details><div className="reading-footer"><span>{reading.estimatedMinutes} minutes</span>{reading.url ? <a href={reading.url} target="_blank" rel="noreferrer">Open official source <ExternalLink size={14} /></a> : <span className="verification-label">Link verification required</span>}</div></div></article>)}</div>)}
          </section>
          <section className="workspace-section"><div className="section-title-row"><div><p className="section-number">03 · APPLICATION</p><h2>Exercises</h2></div><Lightbulb /></div>{week.exercises.map((exercise) => <article className={`exercise-item ${progress.exerciseCompletion[exercise.id] ? 'complete' : ''}`} key={exercise.id}><label className="check-control"><input type="checkbox" checked={Boolean(progress.exerciseCompletion[exercise.id])} onChange={(event) => update({ exerciseCompletion: { ...progress.exerciseCompletion, [exercise.id]: event.target.checked } })} /><span><CheckCircle2 /></span></label><div><h3>{exercise.title}</h3><p>{exercise.instructions}</p><span>{exercise.estimatedMinutes} minutes · Suggested template: {templateById(exercise.templateId)?.label}</span></div></article>)}</section>
          <section className="workspace-section"><div className="section-title-row"><div><p className="section-number">04 · COMMAND WRITING</p><h2>Writing prompts</h2></div><MessageSquareText /></div>{week.prompts.map((prompt) => <article className="prompt-item" key={prompt.id}><div className="prompt-heading"><div><h3>{prompt.title}</h3><span>{prompt.responseType.replace('-', ' ')} · Suggested minimum {prompt.suggestedMinimumWords} words</span></div>{prompt.planningTemplateId && <button className="quiet-button" onClick={() => applyTemplate(prompt.id, prompt.planningTemplateId)}>Use {templateById(prompt.planningTemplateId)?.label} template</button>}</div><p className="prompt-text">{prompt.prompt}</p><label className="editor-label"><span>Your response</span><textarea className="large-editor" value={progress.responses[prompt.id] ?? ''} onChange={(event) => update({ responses: { ...progress.responses, [prompt.id]: event.target.value } })} placeholder="Develop your analysis here…" /><small>{wordCount(progress.responses[prompt.id] ?? '')} words</small></label></article>)}</section>
          <section className="workspace-section"><div className="section-title-row"><div><p className="section-number">05 · REFLECTION</p><h2>Command record</h2></div><FileText /></div><div className="editor-stack">
            <Editor label="Private notes" value={progress.privateNotes} onChange={(value) => update({ privateNotes: value })} placeholder="Personal observations, excerpts, and connections…" />
            <Editor label="Decision journal" value={progress.decisionJournal} onChange={(value) => update({ decisionJournal: value })} placeholder="Record decisions, available information, expected effects, risks, and outcomes…" />
            <Editor label="Lessons learned" value={progress.lessonsLearned} onChange={(value) => update({ lessonsLearned: value })} placeholder="What will you carry into future command problems?" />
            <Editor label="Remaining questions" value={progress.remainingQuestions} onChange={(value) => update({ remainingQuestions: value })} placeholder="What remains uncertain or deserves further study?" />
          </div></section>
          <section className="workspace-section"><div className="section-title-row"><div><p className="section-number">06 · SELF-ASSESSMENT</p><h2>Command judgment rubric</h2></div><Target /></div><p className="section-intro">Score the quality of your reasoning, not whether the simulated outcome was a victory. Maximum: 100 points.</p><div className="rubric-list">{assessmentCriteria.map((criterion) => { const score = progress.rubricScores.find((item) => item.categoryId === criterion.id) ?? { categoryId: criterion.id, score: 0, notes: '' }; return <div className="rubric-row" key={criterion.id}><label><span>{criterion.label}</span><span><input type="number" min="0" max={criterion.maxScore} value={score.score} onChange={(event) => update({ rubricScores: progress.rubricScores.map((item) => item.categoryId === criterion.id ? { ...item, score: Math.min(criterion.maxScore, Math.max(0, Number(event.target.value))) } : item) })} /> / {criterion.maxScore}</span></label><input aria-label={`${criterion.label} notes`} value={score.notes} onChange={(event) => update({ rubricScores: progress.rubricScores.map((item) => item.categoryId === criterion.id ? { ...item, notes: event.target.value } : item) })} placeholder="Assessment notes" /></div> })}<div className="rubric-total"><span>Total self-assessment</span><strong>{progress.rubricScores.reduce((total, item) => total + item.score, 0)} / 100</strong></div></div></section>
        </div>
        <aside className="workspace-sidebar">
          <section className="status-card"><p className="section-number">WEEK STATUS</p><label><span>Status</span><select value={progress.status} onChange={(event) => setStatus(event.target.value as ProgressStatus)}><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="needs-review">Needs review</option><option value="completed">Completed</option></select></label><label><span>Hours spent</span><input type="number" min="0" max="100" step="0.25" value={progress.hoursSpent} onChange={(event) => update({ hoursSpent: Math.max(0, Number(event.target.value)) })} /></label><fieldset><legend>Confidence</legend><div className="confidence-control">{[1,2,3,4,5].map((rating) => <button type="button" className={progress.confidence === rating ? 'selected' : ''} onClick={() => update({ confidence: rating })} key={rating} aria-label={`Confidence ${rating} of 5`}>{rating}</button>)}</div></fieldset><dl><div><dt>Started</dt><dd>{progress.startedAt ? new Date(progress.startedAt).toLocaleDateString() : '—'}</dd></div><div><dt>Completed</dt><dd>{progress.completedAt ? new Date(progress.completedAt).toLocaleDateString() : '—'}</dd></div><div><dt>Last updated</dt><dd>{new Date(progress.updatedAt).toLocaleString()}</dd></div></dl><SaveIndicator status={saveStatus} /></section>
          <section className="week-outline-card"><p className="section-number">THIS WEEK</p><a href="#readings">Assigned readings <span>{week.readings.length}</span></a><span>Required tasks <b>{week.exercises.length}</b></span><span>Writing prompts <b>{week.prompts.length}</b></span><span>Estimated load <b>{week.estimatedHours}h</b></span></section>
        </aside>
      </div>
      <nav className="week-navigation" aria-label="Week navigation">{previous ? <Link to={`/week/${previous.id}`}><ArrowLeft /><span><small>PREVIOUS · WEEK {previous.number}</small><strong>{previous.title}</strong></span></Link> : <span />}{next ? <Link to={`/week/${next.id}`}><span><small>NEXT · WEEK {next.number}</small><strong>{next.title}</strong></span><ArrowRight /></Link> : <Link to="/"><span><small>CURRICULUM COMPLETE</small><strong>Return to dashboard</strong></span><ArrowRight /></Link>}</nav>
    </div>
  )
}

function Editor({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="editor-label"><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><small>{wordCount(value)} words</small></label>
}
