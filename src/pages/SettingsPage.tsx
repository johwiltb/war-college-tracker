import { CircleUserRound, Cloud, Database, Download, HardDrive, LogOut, ShieldAlert, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { combinedMarkdown, downloadText } from '../lib/export'
import { createExport, parseDataExport } from '../lib/storage'
import type { DataExport, DisplayMode } from '../types/domain'

export function SettingsPage() {
  const { configured, user, signIn, signOut, error: authError } = useAuth()
  const { data, connectionError, updateSettings, replaceData, deleteAllData, migrateGuestData, guestDataAvailable } = useData()
  const [staged, setStaged] = useState<DataExport | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const exportJson = () => downloadText(`war-college-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(createExport(data), null, 2), 'application/json')
  const readImport = async (file?: File) => {
    if (!file) return
    setError(null)
    try { setStaged(parseDataExport(await file.text())) } catch (importError) { setStaged(null); setError(importError instanceof Error ? importError.message : 'Import failed.') }
    if (fileInput.current) fileInput.current.value = ''
  }
  const confirmImport = async () => {
    if (!staged) return
    try {
      await replaceData({ version: 1, settings: staged.settings, weekProgress: staged.weekProgress, commandDocuments: staged.commandDocuments })
      setMessage(`Import complete: ${Object.keys(staged.weekProgress).length} week records and ${staged.commandDocuments.length} documents applied.`)
      setStaged(null)
    } catch (importError) { setError(importError instanceof Error ? importError.message : 'Import failed.') }
  }
  const reset = async () => {
    const label = user ? 'authenticated application data' : 'guest data in this browser'
    if (!window.confirm(`Permanently delete all ${label}? Export a backup first if you may need it.`)) return
    if (!window.confirm('Final confirmation: this action cannot be undone. Continue?')) return
    try { await deleteAllData(); setMessage('Application data deleted.') } catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : 'Delete failed.') }
  }
  const migrate = async () => {
    try { const result = await migrateGuestData(); setMessage(`Copied ${result.weeks} guest week records and ${result.documents} documents into your signed-in account.`) } catch (migrationError) { setError(migrationError instanceof Error ? migrationError.message : 'Migration failed.') }
  }

  return (
    <div className="page settings-page">
      <div className="page-heading"><div><p className="eyebrow">Control and custody</p><h1>Data &amp; account settings</h1><p>Manage identity, backups, local preferences, and application data.</p></div></div>
      {(message || error || authError) && <div className={error || authError ? 'settings-message error-message' : 'settings-message success-message'} role="status">{error || authError || message}<button onClick={() => { setError(null); setMessage(null) }} aria-label="Dismiss message">×</button></div>}
      <div className="settings-grid">
        <section className="settings-card"><div className="settings-card-heading"><div className="settings-icon"><CircleUserRound /></div><div><h2>Authentication</h2><p>Identity and cross-device access</p></div></div>{user ? <div className="account-summary"><span className="avatar-placeholder">{(user.user_metadata.user_name || user.email || 'U').slice(0, 2).toUpperCase()}</span><div><strong>{user.user_metadata.user_name || 'GitHub user'}</strong><span>{user.email}</span><small>Authenticated with GitHub through Supabase</small></div></div> : <div className="account-summary"><span className="avatar-placeholder guest"><HardDrive /></span><div><strong>Guest mode</strong><span>Saved only in this browser</span><small>{configured ? 'Sign in to sync across devices.' : 'Supabase credentials are not configured.'}</small></div></div>}<div className="settings-actions">{user ? <button className="secondary-button" onClick={() => void signOut()}><LogOut size={17} /> Sign out</button> : configured ? <button className="primary-button" onClick={() => void signIn()}><CircleUserRound size={17} /> Sign in with GitHub</button> : <span className="config-warning">Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable sign-in.</span>}{user && guestDataAvailable && <button className="secondary-button" onClick={() => void migrate()}><Upload size={17} /> Copy guest data to account</button>}</div></section>
        <section className="settings-card"><div className="settings-card-heading"><div className="settings-icon"><Cloud /></div><div><h2>Connection status</h2><p>Autosave and database readiness</p></div></div><dl className="status-list"><div><dt>Operating mode</dt><dd><span className={user ? 'status-dot online' : 'status-dot local'} />{user ? 'Authenticated' : 'Guest'}</dd></div><div><dt>Database</dt><dd>{!configured ? 'Not configured' : connectionError ? 'Connection error' : user ? 'Connected' : 'Ready for sign-in'}</dd></div><div><dt>Autosave</dt><dd>{user ? 'Local recovery + Supabase' : 'Browser local storage'}</dd></div><div><dt>Autosave delay</dt><dd>{data.settings.autosaveDelayMs} ms</dd></div></dl>{connectionError && <p className="error-message">{connectionError}</p>}</section>
        <section className="settings-card wide"><div className="settings-card-heading"><div className="settings-icon"><Database /></div><div><h2>Export &amp; import</h2><p>Portable, versioned backups under your control</p></div></div><div className="data-action-grid"><button className="data-action" onClick={exportJson}><Download /><span><strong>Export all data</strong><small>Versioned JSON backup</small></span></button><button className="data-action" onClick={() => downloadText(`war-college-notes-${new Date().toISOString().slice(0, 10)}.md`, combinedMarkdown(data), 'text/markdown')}><Download /><span><strong>Export completed work</strong><small>Combined Markdown file</small></span></button><button className="data-action" onClick={() => fileInput.current?.click()}><Upload /><span><strong>Import a backup</strong><small>Validated JSON only</small></span></button><input ref={fileInput} hidden type="file" accept="application/json,.json" onChange={(event) => void readImport(event.target.files?.[0])} /></div>{staged && <div className="import-confirm"><ShieldAlert /><div><strong>Review before import</strong><p>Backup from {new Date(staged.exportedAt).toLocaleString()} contains {Object.keys(staged.weekProgress).length} week records and {staged.commandDocuments.length} documents. Importing will overwrite the current workspace after remote deletion where applicable.</p><div><button className="primary-button" onClick={() => void confirmImport()}>Confirm import</button><button className="quiet-button" onClick={() => setStaged(null)}>Cancel</button></div></div></div>}</section>
        <section className="settings-card"><div className="settings-card-heading"><div className="settings-icon"><HardDrive /></div><div><h2>Display &amp; autosave</h2><p>Device-level preferences</p></div></div><label><span>Display mode</span><select value={data.settings.displayMode} onChange={(event) => updateSettings({ displayMode: event.target.value as DisplayMode })}><option value="system">Use system setting</option><option value="light">Light</option><option value="dark">Dark</option></select></label><label><span>Autosave delay</span><select value={data.settings.autosaveDelayMs} onChange={(event) => updateSettings({ autosaveDelayMs: Number(event.target.value) })}><option value="500">0.5 seconds</option><option value="800">0.8 seconds</option><option value="1500">1.5 seconds</option><option value="3000">3 seconds</option></select></label></section>
        <section className="settings-card danger-zone"><div className="settings-card-heading"><div className="settings-icon danger"><Trash2 /></div><div><h2>Danger zone</h2><p>Permanent data deletion</p></div></div><p>{user ? 'Delete your week progress and command documents from Supabase. Your authentication account remains intact.' : 'Clear all guest progress and command documents stored in this browser.'}</p><button className="danger-button" onClick={() => void reset()}><Trash2 size={17} /> {user ? 'Delete authenticated app data' : 'Reset guest data'}</button></section>
      </div>
    </div>
  )
}
