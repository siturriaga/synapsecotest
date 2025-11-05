import { Suspense, lazy, useMemo } from 'react'
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
        <div className="layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: '100vh' }}>
          <Sidebar user={user} onSignIn={actions.signIn} onSignOut={actions.signOut} />
          <main
            style={{
              padding: '32px',
              minHeight: '100vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 24
            }}
          >
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
