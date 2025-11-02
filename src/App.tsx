import { useMemo } from 'react'
import { Route, Switch } from 'wouter'
import { useAuth } from './hooks/useAuth'
import { Sidebar } from './components/core/Sidebar'
import { Header } from './components/core/Header'
import DashboardPage from './pages/Dashboard'
import RosterUploadPage from './pages/Roster'
import StudentGroupsPage from './pages/Groups'
import StandardsEnginePage from './pages/Standards'
import AssignmentsPage from './pages/Assignments'
import SettingsPage from './pages/Settings'

export default function App() {
  const [authState, actions] = useAuth()
  const user = authState.user

  const content = useMemo(() => (
    <Switch>
      <Route path="/" component={() => <DashboardPage user={user} loading={authState.loading} />} />
      <Route path="/roster" component={() => <RosterUploadPage user={user} />} />
      <Route path="/groups" component={() => <StudentGroupsPage user={user} />} />
      <Route path="/standards" component={() => <StandardsEnginePage user={user} />} />
      <Route path="/assignments" component={() => <AssignmentsPage user={user} />} />
      <Route path="/settings" component={() => <SettingsPage user={user} />} />
      <Route>Not found</Route>
    </Switch>
  ), [user, authState.loading])

  return (
    <div className="layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: '100vh' }}>
      <Sidebar user={user} onSignIn={actions.signIn} onSignOut={actions.signOut} />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header user={user} />
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {authState.error && (
            <div className="glass-card" style={{ marginBottom: 20, border: '1px solid rgba(239, 68, 68, 0.45)', color: '#fecaca' }}>
              {authState.error}
            </div>
          )}
          {content}
        </main>
      </div>
    </div>
  )
}
