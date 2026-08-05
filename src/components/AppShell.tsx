import { BookOpen, Database, FileText, LayoutDashboard, LogIn, LogOut, Menu, Moon, Settings, ShieldAlert, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from '../lib/router'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/curriculum', label: 'Curriculum', icon: BookOpen },
  { to: '/notebook', label: 'Command notebook', icon: FileText },
  { to: '/settings', label: 'Data & settings', icon: Database },
]

export function AppShell() {
  const { user, signIn, signOut, configured } = useAuth()
  const { data, updateSettings } = useData()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])
  useEffect(() => {
    const mode = data.settings.displayMode
    const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [data.settings.displayMode])

  const toggleTheme = () => updateSettings({ displayMode: data.settings.displayMode === 'dark' ? 'light' : 'dark' })

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        <NavLink to="/" className="brand" aria-label="Joint Command & War College Tracker dashboard">
          <span className="brand-mark">JC</span>
          <span><strong>Joint Command</strong><small>War College Tracker</small></span>
        </NavLink>
        <div className="top-actions">
          <span className={`mode-chip ${user ? 'authenticated' : ''}`}><span />{user ? 'Authenticated' : 'Guest mode'}</span>
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle light and dark mode">{data.settings.displayMode === 'dark' ? <Sun /> : <Moon />}</button>
          {user ? (
            <button className="quiet-button account-button" onClick={() => void signOut()}><LogOut size={16} /> Sign out</button>
          ) : configured ? (
            <button className="quiet-button account-button" onClick={() => void signIn()}><LogIn size={16} /> Sign in</button>
          ) : null}
        </div>
      </header>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <nav aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={19} /><span>{label}</span></NavLink>)}
        </nav>
        <div className="sidebar-footer">
          <div className="unclassified-mini"><ShieldAlert size={17} /><span><strong>Unclassified only</strong>Do not enter CUI, classified, employer-sensitive, or operational information.</span></div>
          <NavLink to="/settings"><Settings size={17} /> Preferences</NavLink>
        </div>
      </aside>
      {menuOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <main className="main-content" id="main-content"><Outlet /></main>
    </div>
  )
}
