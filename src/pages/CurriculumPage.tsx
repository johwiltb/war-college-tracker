import { ChevronRight, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from '../lib/router'
import { ProgressBar } from '../components/ProgressBar'
import { useData } from '../context/DataContext'
import { allWeeks, curriculum } from '../data/curriculum'
import { calculateWeekPercent } from '../lib/progress'
import type { ProgressStatus } from '../types/domain'

export function CurriculumPage() {
  const { data } = useData()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [term, setTerm] = useState(params.get('term') ?? 'all')
  const [era, setEra] = useState('all')
  const [level, setLevel] = useState('all')
  const [status, setStatus] = useState<'all' | ProgressStatus>('all')
  const [reading, setReading] = useState('all')
  const eras = [...new Set(allWeeks.map((week) => week.era))]
  const levels = [...new Set(allWeeks.map((week) => week.commandLevel))]
  const results = useMemo(() => allWeeks.filter((week) => {
    const progress = data.weekProgress[week.id]
    const text = [week.title, week.topic, ...week.tags, ...week.readings.flatMap((item) => [item.title, item.author, item.publication])].join(' ').toLowerCase()
    const readingComplete = week.readings.filter((item) => item.requirement === 'required').every((item) => progress?.readingCompletion[item.id])
    return (!query || text.includes(query.toLowerCase()))
      && (term === 'all' || week.termId === term)
      && (era === 'all' || week.era === era)
      && (level === 'all' || week.commandLevel === level)
      && (status === 'all' || (progress?.status ?? 'not-started') === status)
      && (reading === 'all' || (reading === 'complete' ? readingComplete : !readingComplete))
  }), [data.weekProgress, era, level, query, reading, status, term])

  const resetFilters = () => { setQuery(''); setTerm('all'); setEra('all'); setLevel('all'); setStatus('all'); setReading('all') }

  return (
    <div className="page curriculum-page">
      <div className="page-heading"><div><p className="eyebrow">Full program of study</p><h1>Curriculum</h1><p>Eight terms. Ninety-six command problems. Built for deliberate weekly practice.</p></div><div className="curriculum-count"><strong>{results.length}</strong><span>weeks shown</span></div></div>
      <section className="filter-panel" aria-label="Curriculum filters">
        <label className="search-field"><Search size={18} /><span className="sr-only">Search curriculum</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, campaigns, doctrine, or topics…" /></label>
        <div className="filter-grid">
          <label><span>Term</span><select value={term} onChange={(event) => setTerm(event.target.value)}><option value="all">All terms</option>{curriculum.map((item) => <option value={item.id} key={item.id}>Term {item.number}: {item.title}</option>)}</select></label>
          <label><span>Era</span><select value={era} onChange={(event) => setEra(event.target.value)}><option value="all">All eras</option>{eras.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Command level</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="all">All levels</option>{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">All statuses</option><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="needs-review">Needs review</option><option value="completed">Completed</option></select></label>
          <label><span>Reading</span><select value={reading} onChange={(event) => setReading(event.target.value)}><option value="all">Any reading status</option><option value="complete">Required complete</option><option value="incomplete">Required incomplete</option></select></label>
          <button className="quiet-button reset-filter" onClick={resetFilters}><SlidersHorizontal size={16} /> Reset filters</button>
        </div>
      </section>
      {curriculum.map((termItem) => {
        const termWeeks = results.filter((week) => week.termId === termItem.id)
        if (!termWeeks.length) return null
        return <section className="curriculum-term" key={termItem.id}><div className="term-heading"><span className="term-seal">{termItem.number}</span><div><p>TERM {String(termItem.number).padStart(2, '0')}</p><h2>{termItem.title}</h2><span>{termItem.description}</span></div></div><div className="week-list">{termWeeks.map((week) => { const progress = data.weekProgress[week.id]; const percent = calculateWeekPercent(week, progress); return <Link className="week-row" to={`/week/${week.id}`} key={week.id}><div className="week-number"><span>WEEK</span><strong>{String(week.number).padStart(2, '0')}</strong></div><div className="week-row-main"><div><h3>{week.title}</h3><p>{week.topic}</p></div><div className="week-tags"><span>{week.era}</span><span>{week.commandLevel}</span><span>{week.coreMinutes} min core</span><span>+{week.extensionMinutes} min optional</span><span>{week.readings.length} readings</span></div></div><div className="week-progress"><span className={`status-pill status-${progress?.status ?? 'not-started'}`}>{(progress?.status ?? 'not-started').replace('-', ' ')}</span><ProgressBar value={percent} label={`${percent}%`} /></div><ChevronRight /></Link> })}</div></section>
      })}
      {!results.length && <div className="empty-state"><Filter size={32} /><h2>No weeks match these filters</h2><p>Try broadening the search or clearing one or more filters.</p><button className="secondary-button" onClick={resetFilters}>Reset all filters</button></div>}
    </div>
  )
}
