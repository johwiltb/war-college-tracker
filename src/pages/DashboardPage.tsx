import { ArrowRight, BookCheck, Clock3, FileText, Gauge, Target } from 'lucide-react'
import { Link } from '../lib/router'
import { curriculum, allWeeks } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { calculateWeekPercent, summarizeProgress } from '../lib/progress'
import { documentTypeLabels } from '../data/templates'
import { ProgressBar } from '../components/ProgressBar'

export function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, connectionError } = useData()
  const summary = summarizeProgress(data.weekProgress)
  const recommended = allWeeks.find((week) => week.id === summary.recommendedWeekId) ?? allWeeks[0]
  const recentProgress = Object.values(data.weekProgress).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4)
  const recentDocuments = [...data.commandDocuments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)

  return (
    <div className="page dashboard-page">
      <div className="page-heading dashboard-heading">
        <div><p className="eyebrow">Command development overview</p><h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}.</h1><p>Your next decision problem is ready when you are.</p></div>
        <div className="identity-card"><span className={user ? 'online-dot' : 'guest-dot'} /> <div><strong>{user ? (user.user_metadata.user_name || user.email) : 'Local guest workspace'}</strong><small>{loading ? 'Synchronizing…' : user ? (connectionError ? 'Remote connection needs attention' : 'Synced across devices') : 'Saved in this browser'}</small></div></div>
      </div>

      <section className="dashboard-grid">
        <article className="readiness-card">
          <div className="card-kicker"><Target size={17} /> CURRENT ASSIGNMENT</div>
          <p>Term {summary.currentTerm} · Week {recommended.number}</p>
          <h2>{recommended.title}</h2>
          <p className="muted">{recommended.topic}</p>
          <div className="assignment-meta"><span>{recommended.era}</span><span>{recommended.commandLevel}</span><span>{recommended.estimatedHours} hrs</span></div>
          <ProgressBar value={calculateWeekPercent(recommended, data.weekProgress[recommended.id])} label={`${calculateWeekPercent(recommended, data.weekProgress[recommended.id])}% of assigned work`} />
          <Link className="primary-button" to={`/week/${recommended.id}`}>Continue current week <ArrowRight size={17} /></Link>
        </article>
        <article className="overall-card">
          <div className="card-kicker"><Gauge size={17} /> CURRICULUM READINESS</div>
          <div className="completion-ring" style={{ '--completion': `${summary.completionPercent * 3.6}deg` } as React.CSSProperties}><span><strong>{summary.completionPercent}%</strong><small>complete</small></span></div>
          <div><h2>{summary.weeksCompleted} of 96 weeks</h2><p className="muted">Progress reflects completed required readings, exercises, and command status.</p></div>
        </article>
      </section>

      <section className="metric-row" aria-label="Progress statistics">
        <article><BookCheck /><span><strong>{summary.readingsCompleted}</strong><small>of {summary.totalReadings} readings</small></span></article>
        <article><Clock3 /><span><strong>{summary.totalHours.toFixed(1)}</strong><small>hours recorded</small></span></article>
        <article><FileText /><span><strong>{data.commandDocuments.length}</strong><small>command documents</small></span></article>
        <article><Target /><span><strong>Term {summary.currentTerm}</strong><small>{curriculum[summary.currentTerm - 1].title}</small></span></article>
      </section>

      <div className="section-heading"><div><p className="eyebrow">Eight-term curriculum</p><h2>Term progress</h2></div><Link to="/curriculum">View full curriculum <ArrowRight size={16} /></Link></div>
      <section className="term-card-grid">
        {curriculum.map((term) => {
          const completed = term.weeks.filter((week) => data.weekProgress[week.id]?.status === 'completed').length
          return <Link to={`/curriculum?term=${term.id}`} className="term-progress-card" key={term.id}><div><span className="term-number">{String(term.number).padStart(2, '0')}</span><span>{completed}/12</span></div><h3>{term.title}</h3><ProgressBar value={Math.round(completed / 12 * 100)} /><p>{term.description}</p></Link>
        })}
      </section>

      <section className="dashboard-lower">
        <div><div className="section-heading compact"><div><p className="eyebrow">Activity</p><h2>Recently updated work</h2></div></div><div className="activity-list">{recentProgress.length ? recentProgress.map((progress) => { const week = allWeeks.find((item) => item.id === progress.weekId); return week && <Link to={`/week/${week.id}`} key={week.id}><span className="week-index">W{week.number}</span><span><strong>{week.title}</strong><small>{new Date(progress.updatedAt).toLocaleDateString()} · {progress.status.replace('-', ' ')}</small></span><ArrowRight size={16} /></Link> }) : <div className="empty-state small"><p>No weekly work yet.</p><Link to={`/week/${recommended.id}`}>Begin the first assignment</Link></div>}</div></div>
        <div><div className="section-heading compact"><div><p className="eyebrow">Notebook</p><h2>Recent command documents</h2></div><Link to="/notebook">Open notebook</Link></div><div className="activity-list">{recentDocuments.length ? recentDocuments.map((document) => <Link to={`/notebook?document=${document.id}`} key={document.id}><FileText size={18} /><span><strong>{document.title || 'Untitled document'}</strong><small>{documentTypeLabels[document.type]} · {new Date(document.updatedAt).toLocaleDateString()}</small></span><ArrowRight size={16} /></Link>) : <div className="empty-state small"><p>Your doctrine ledger and decision files will appear here.</p><Link to="/notebook">Create a document</Link></div>}</div></div>
      </section>
    </div>
  )
}
