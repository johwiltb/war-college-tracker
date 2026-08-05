import { ArrowRight, BookOpen, CircleUserRound, HardDrive, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Navigate, useNavigate } from '../lib/router'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function WelcomePage() {
  const { user, configured, signIn, error, loading } = useAuth()
  const { data, updateSettings } = useData()
  const navigate = useNavigate()
  if (user || data.settings.guestWelcomeComplete) return <Navigate to="/" replace />

  const continueGuest = () => {
    updateSettings({ guestWelcomeComplete: true })
    navigate('/')
  }

  return (
    <main className="welcome-page">
      <section className="welcome-hero">
        <div className="welcome-brand"><span className="brand-mark large">JC</span><span>PRIVATE PROFESSIONAL STUDY</span></div>
        <p className="eyebrow">96-week command development curriculum</p>
        <h1>Joint Command &amp;<br />War College Tracker</h1>
        <p className="welcome-lede">A disciplined workspace for studying military theory, analyzing campaigns, practicing command judgment, and building a personal doctrine over time.</p>
        <div className="welcome-actions">
          {configured && <button className="primary-button large-button" onClick={() => void signIn()} disabled={loading}><CircleUserRound size={19} /> Continue with GitHub</button>}
          <button className={configured ? 'secondary-button large-button' : 'primary-button large-button'} onClick={continueGuest}><HardDrive size={19} /> Continue in guest mode <ArrowRight size={18} /></button>
        </div>
        {!configured && <div className="setup-note"><LockKeyhole size={18} /><span><strong>Cloud sign-in is not configured.</strong> The full curriculum remains available in guest mode, with progress saved in this browser.</span></div>}
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>
      <aside className="welcome-panel" aria-label="Application principles">
        <div className="staff-line"><span>JCS / PME</span><span>PERSONAL USE</span></div>
        <div className="welcome-feature"><BookOpen /><div><h2>Study with purpose</h2><p>Eight terms connect doctrine, historical decisions, simulations, red-teaming, and strategic command.</p></div></div>
        <div className="welcome-feature"><ShieldCheck /><div><h2>Your notes remain yours</h2><p>Public source code does not expose private notes. Guest data stays in your browser; signed-in data is protected by database row-level security.</p></div></div>
        <div className="welcome-feature"><LockKeyhole /><div><h2>Unclassified study only</h2><p>Do not enter classified, CUI, export-controlled, employer-sensitive, or current operational information.</p></div></div>
        <p className="privacy-footnote">You can export or erase application data at any time. No service-role or administrative credentials are used by the browser.</p>
      </aside>
    </main>
  )
}
