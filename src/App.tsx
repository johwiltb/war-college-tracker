import { Navigate, Route, Routes } from './lib/router'
import { lazy, Suspense } from 'react'
import { AppShell } from './components/AppShell'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'

const CurriculumPage = lazy(() => import('./pages/CurriculumPage').then((module) => ({ default: module.CurriculumPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const WelcomePage = lazy(() => import('./pages/WelcomePage').then((module) => ({ default: module.WelcomePage })))
const NotebookPage = lazy(() => import('./pages/NotebookPage').then((module) => ({ default: module.NotebookPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const WeekWorkspacePage = lazy(() => import('./pages/WeekWorkspacePage').then((module) => ({ default: module.WeekWorkspacePage })))

function DashboardGate() {
  const { user, loading } = useAuth()
  const { data } = useData()
  if (loading) return <div className="app-loading" role="status">Opening your command workspace…</div>
  if (!user && !data.settings.guestWelcomeComplete) return <Navigate to="/welcome" replace />
  return <DashboardPage />
}

export default function App() {
  return <AuthProvider><DataProvider><Suspense fallback={<div className="app-loading" role="status">Opening command workspace…</div>}><Routes>
    <Route path="/welcome" element={<WelcomePage />} />
    <Route element={<AppShell />}>
      <Route index element={<DashboardGate />} />
      <Route path="curriculum" element={<CurriculumPage />} />
      <Route path="week/:weekId" element={<WeekWorkspacePage />} />
      <Route path="notebook" element={<NotebookPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></DataProvider></AuthProvider>
}
