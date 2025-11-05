import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
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

export default function App() {
  const [authState, actions] = useAuth()
  const user = authState.user
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
          <Route>Not found</Route>
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
            <ExperienceTopBar user={user} onSignIn={actions.signIn} onSignOut={actions.signOut} />
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
              ) : (
                <button type="button" className="mobile-auth-button" onClick={actions.signIn}>
                  Sign in
                </button>
              )}
            </div>
            <div className="layout__content">
              {authState.error && (
                <div
                  className="glass-card layout__alert"
                  role="alert"
                  style={{ border: '1px solid rgba(239, 68, 68, 0.45)', color: '#fecaca' }}
                >
                  {authState.error}
                </div>
              )}
              {content}
            </div>
          </main>
        </div>
      </PreferencesProvider>
    </RosterDataProvider>
  )
}

function ExperienceTopBar({
  user,
  onSignIn,
  onSignOut
}: {
  user: User | null
  onSignIn: () => void
  onSignOut: () => void
}) {
  return (
    <header className="layout__topbar" aria-label="Workspace status">
      <div className="layout__topbar-brand">
        <span className="layout__topbar-pill">Premium AI Workspace</span>
        <h1 className="layout__topbar-title">Synapse Intelligence Console</h1>
        <p className="layout__topbar-subtitle">
          Orchestrate Gemini-powered assignments, groupings, and mastery analytics from a single, unified canvas.
        </p>
      </div>
      <div className="layout__topbar-actions">
        {user ? (
          <>
            <div className="layout__topbar-user" aria-label="Authenticated educator">
              <span className="layout__topbar-user-name">{user.displayName ?? 'Educator'}</span>
              <span className="layout__topbar-user-email">{user.email ?? 'Signed in'}</span>
            </div>
            <button type="button" className="secondary" onClick={onSignOut}>
              Log out
            </button>
          </>
        ) : (
          <>
            <div className="layout__topbar-user layout__topbar-user--guest" aria-label="Guest mode">
              <span className="layout__topbar-user-name">Guest mode</span>
              <span className="layout__topbar-user-email">Sign in to sync Gemini deliverables securely.</span>
            </div>
            <button type="button" className="primary" onClick={onSignIn}>
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </header>
  )
}
