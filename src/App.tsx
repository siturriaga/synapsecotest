import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Switch } from 'wouter'
import { useAuth } from './hooks/useAuth'
import { Sidebar } from './components/core/Sidebar'
import { RosterDataProvider } from './hooks/useRosterData'
import { PreferencesProvider } from './hooks/usePreferences'
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const RosterUploadPage = lazy(() => import('./pages/Roster'))
const StudentGroupsPage = lazy(() => import('./pages/Groups'))
const StandardsEnginePage = lazy(() => import('./pages/Standards'))
const AssignmentsPage = lazy(() => import('./pages/Assignments'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

export default function App() {
  const [authState, actions] = useAuth()
  const user = authState.user
  const authEnabled = authState.authConfigured
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(max-width: 960px)')
    const updateMatches = () => setIsNarrow(mediaQuery.matches)
    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)
    return () => mediaQuery.removeEventListener('change', updateMatches)
  }, [])

  useEffect(() => {
    if (!isNarrow) {
      setSidebarOpen(false)
    }
  }, [isNarrow])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!isNarrow || !isSidebarOpen) {
      document.body.style.removeProperty('overflow')
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isSidebarOpen, isNarrow])

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((value) => !value)
  }, [])

  const content = useMemo(
    () => (
      <Suspense fallback={<div style={{ padding: 24 }}>Loading experience…</div>}>
        <Switch>
          <Route path="/" component={() => <DashboardPage user={user} loading={authState.loading} />} />
          <Route path="/roster" component={() => <RosterUploadPage user={user} />} />
          <Route path="/groups" component={() => <StudentGroupsPage user={user} />} />
          <Route path="/standards" component={() => <StandardsEnginePage user={user} />} />
          <Route path="/assignments" component={() => <AssignmentsPage user={user} />} />
          <Route path="/settings" component={() => <SettingsPage user={user} />} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    ),
    [user, authState.loading]
  )

  return (
    <RosterDataProvider user={user}>
      <PreferencesProvider user={user}>
        <div className={`layout${isSidebarOpen && isNarrow ? ' layout--sidebar-open' : ''}`}>
          <Sidebar
            user={user}
            authEnabled={authEnabled}
            onSignIn={actions.signIn}
            onSignOut={actions.signOut}
            onDismiss={handleSidebarClose}
            aria-hidden={isNarrow && !isSidebarOpen ? true : undefined}
            data-open={isSidebarOpen && isNarrow ? 'true' : undefined}
          />
          <button
            type="button"
            className="layout__backdrop"
            aria-hidden={isSidebarOpen ? 'false' : 'true'}
            onClick={handleSidebarClose}
          />
          <main className="layout__main">
            <div className="layout__mobile-bar">
              <button
                type="button"
                className="mobile-menu-button"
                aria-label="Toggle navigation"
                aria-expanded={isSidebarOpen}
                onClick={handleSidebarToggle}
              >
                <span aria-hidden="true">☰</span>
              </button>
              <div className="layout__mobile-title">Synapse</div>
              {user ? (
                <button type="button" className="mobile-auth-button" onClick={actions.signOut}>
                  Log out
                </button>
              ) : authEnabled ? (
                <button type="button" className="mobile-auth-button" onClick={actions.signIn}>
                  Sign in
                </button>
              ) : (
                <button type="button" className="mobile-auth-button" disabled>
                  Sign in unavailable
                </button>
              )}
            </div>
            {authState.error && (
              <div className="glass-card" style={{ marginBottom: 20, border: '1px solid rgba(239, 68, 68, 0.45)', color: '#fecaca' }}>
                {authState.error}
              </div>
            )}
            {content}
          </main>
        </div>
      </PreferencesProvider>
    </RosterDataProvider>
  )
}
