import { Download, FilePlus2, FileText, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from '../lib/router'
import { SaveIndicator } from '../components/SaveIndicator'
import { useData } from '../context/DataContext'
import { allWeeks } from '../data/curriculum'
import { documentTypeLabels, planningTemplates } from '../data/templates'
import { exportDocumentMarkdown } from '../lib/export'
import { draftKey } from '../lib/storage'
import { useAutosave } from '../hooks/useAutosave'
import type { CommandDocument, DocumentType } from '../types/domain'

function newDocument(): CommandDocument {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), type: 'doctrine-ledger', title: 'Untitled command document', relatedWeekId: null, content: '', metadata: {}, createdAt: now, updatedAt: now }
}

export function NotebookPage() {
  const { data, saveDocument, deleteDocument } = useData()
  const [params] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(params.get('document'))
  const [editor, setEditor] = useState<CommandDocument | null>(null)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | DocumentType>('all')
  const documents = useMemo(() => [...data.commandDocuments].filter((document) => (typeFilter === 'all' || document.type === typeFilter) && `${document.title} ${document.content}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [data.commandDocuments, query, typeFilter])

  useEffect(() => {
    if (!selectedId) { setEditor(null); return }
    const document = data.commandDocuments.find((item) => item.id === selectedId)
    if (!document) return
    try {
      const raw = localStorage.getItem(draftKey('document', selectedId))
      const draft = raw ? JSON.parse(raw) as CommandDocument : null
      setEditor(draft && Date.parse(draft.updatedAt) >= Date.parse(document.updatedAt) ? draft : document)
    } catch { setEditor(document) }
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const onDraft = useCallback((value: CommandDocument | null) => { if (value) localStorage.setItem(draftKey('document', value.id), JSON.stringify(value)) }, [])
  const onSave = useCallback(async (value: CommandDocument | null) => { if (!value) return; await saveDocument(value); localStorage.removeItem(draftKey('document', value.id)) }, [saveDocument])
  const saveStatus = useAutosave({ value: editor, delay: data.settings.autosaveDelayMs, onDraft, onSave, enabled: Boolean(editor) })
  const update = (patch: Partial<CommandDocument>) => setEditor((current) => current ? { ...current, ...patch, updatedAt: new Date().toISOString() } : current)
  const create = async () => { const document = newDocument(); await saveDocument(document); setSelectedId(document.id); setEditor(document) }
  const remove = async () => { if (!editor || !window.confirm(`Delete “${editor.title}”? This cannot be undone.`)) return; await deleteDocument(editor.id); setSelectedId(null); setEditor(null) }
  const applyPlanningTemplate = (templateId: string) => { const template = planningTemplates.find((item) => item.id === templateId); if (template && editor && (!editor.content.trim() || window.confirm('Replace the current document content with this template?'))) update({ type: template.documentType, content: template.content }) }

  return (
    <div className="page notebook-page">
      <div className="page-heading"><div><p className="eyebrow">Living command record</p><h1>Command notebook</h1><p>Capture doctrine, decisions, estimates, intent, and lessons in one durable workspace.</p></div><button className="primary-button" onClick={() => void create()}><FilePlus2 size={18} /> New document</button></div>
      <div className="notebook-layout">
        <aside className="document-browser">
          <label className="search-field"><Search size={17} /><span className="sr-only">Search documents</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documents…" /></label>
          <label><span>Document type</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}><option value="all">All categories</option>{Object.entries(documentTypeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <div className="document-list">{documents.map((document) => { const week = allWeeks.find((item) => item.id === document.relatedWeekId); return <button className={selectedId === document.id ? 'selected' : ''} onClick={() => setSelectedId(document.id)} key={document.id}><FileText size={18} /><span><strong>{document.title || 'Untitled document'}</strong><small>{documentTypeLabels[document.type]}{week ? ` · W${week.number}` : ''}</small><small>Updated {new Date(document.updatedAt).toLocaleDateString()}</small></span></button> })}{!documents.length && <div className="empty-state small"><FileText /><p>No documents found.</p><button onClick={() => void create()}>Create the first</button></div>}</div>
        </aside>
        <section className="document-editor-panel">
          {editor ? <>
            <div className="document-toolbar"><SaveIndicator status={saveStatus} /><div><button className="icon-button" onClick={() => exportDocumentMarkdown(editor)} aria-label="Export document as Markdown"><Download /></button><button className="icon-button danger" onClick={() => void remove()} aria-label="Delete document"><Trash2 /></button></div></div>
            <input className="document-title-input" aria-label="Document title" value={editor.title} onChange={(event) => update({ title: event.target.value })} />
            <div className="document-meta-grid"><label><span>Category</span><select value={editor.type} onChange={(event) => update({ type: event.target.value as DocumentType })}>{Object.entries(documentTypeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>Related week</span><select value={editor.relatedWeekId ?? ''} onChange={(event) => update({ relatedWeekId: event.target.value || null })}><option value="">No related week</option>{allWeeks.map((week) => <option value={week.id} key={week.id}>Week {week.number}: {week.title}</option>)}</select></label><label><span>Insert planning template</span><select value="" onChange={(event) => applyPlanningTemplate(event.target.value)}><option value="">Choose a template…</option>{planningTemplates.map((template) => <option value={template.id} key={template.id}>{template.label}</option>)}</select></label></div>
            <label className="document-content-label"><span>Markdown-capable notes</span><textarea value={editor.content} onChange={(event) => update({ content: event.target.value })} placeholder="Write your command document here. Markdown syntax is preserved in export." /><small>{editor.content.trim() ? editor.content.trim().split(/\s+/).length : 0} words · Plain text is displayed safely and never rendered as untrusted HTML.</small></label>
          </> : <div className="document-empty"><div className="document-empty-mark">JC</div><h2>Select a document</h2><p>Choose an existing command document or create a new one to begin.</p><button className="primary-button" onClick={() => void create()}><FilePlus2 size={18} /> Create document</button></div>}
        </section>
      </div>
    </div>
  )
}
