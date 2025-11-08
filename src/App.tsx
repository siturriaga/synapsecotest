import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Switch } from 'wouter'
import { useAuth } from './hooks/useAuth'
import { Sidebar } from './components/core/Sidebar'
import { RosterDataProvider } from './hooks/useRosterData'
import { PreferencesProvider } from './hooks/usePreferences'
import { ErrorBoundary } from './components/ErrorBoundary'
import { firebaseIsConfigured } from './firebase'

const DashboardPage = lazy(() => import('./pages/Dashboard'))
const RosterUploadPage = lazy(() => import('./pages/Roster'))
const StudentGroupsPage = lazy(() => import('./pages/Groups'))
const StandardsEnginePage = lazy(() => import('./pages/Standards'))
const AssignmentsPage = lazy(() => import('./pages/Assignments'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

export default function App() {
  const { user, loading, available, signIn, logout } = useAuth()
  const authEnabled = available
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
          <Route path="/" component={() => <DashboardPage user={user} loading={loading} />} />
          <Route path="/roster" component={() => <RosterUploadPage user={user} />} />
          <Route path="/groups" component={() => <StudentGroupsPage user={user} />} />
          <Route path="/standards" component={() => <StandardsEnginePage user={user} />} />
          <Route path="/assignments" component={() => <AssignmentsPage user={user} />} />
          <Route path="/settings" component={() => <SettingsPage user={user} />} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    ),
    [user, loading]
  )

  return (
    <ErrorBoundary>
      <RosterDataProvider user={user}>
        <PreferencesProvider user={user}>
          <div className={`layout${isSidebarOpen && isNarrow ? ' layout--sidebar-open' : ''}`}>
            <Sidebar
              user={user}
              authEnabled={authEnabled}
              onSignIn={signIn}
              onSignOut={logout}
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
                  <button type="button" className="mobile-auth-button" onClick={logout}>
                    Log out
                  </button>
                ) : authEnabled ? (
                  <button type="button" className="mobile-auth-button" onClick={signIn}>
                    Sign in
                  </button>
                ) : (
                  <button type="button" className="mobile-auth-button" disabled>
                    Sign in unavailable
                  </button>
                )}
              </div>
              {!firebaseIsConfigured() && (
                <div style={{background:"#fff3cd", color:"#664d03", padding:"8px 12px", border:"1px solid #ffe69c", borderRadius:8, margin:"8px 12px"}}>
                  <strong>Configuration:</strong> Firebase keys not injected at build time (VITE_FIREBASE_*).
                </div>
              )}
              {content}
            </main>
          </div>
        </PreferencesProvider>
      </RosterDataProvider>
    </ErrorBoundary>
  )
}
