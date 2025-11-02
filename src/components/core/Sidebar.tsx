import { Link, useRoute } from 'wouter'
import type { User } from 'firebase/auth'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/roster', label: 'Roster Upload', icon: '🧑‍🏫' },
  { href: '/groups', label: 'Student Groups', icon: '🧬' },
  { href: '/standards', label: 'Standards Engine', icon: '📋' },
  { href: '/assignments', label: 'Assignments', icon: '✍️' },
  { href: '/settings', label: 'Workspace Settings', icon: '⚙️' }
]

export function Sidebar({ user, onSignIn, onSignOut }: { user: User | null; onSignIn: () => void; onSignOut: () => void }) {
  return (
    <aside className="sidebar" style={{
      position: 'sticky',
      top: 0,
      alignSelf: 'start',
      height: '100vh',
      padding: '32px 28px 28px',
      borderRight: '1px solid rgba(148, 163, 184, 0.18)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.82), rgba(17, 24, 39, 0.95))'
    }}>
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>⚡</span>
        SYNAPSE
      </div>
      <nav style={{ display: 'grid', gap: 8 }}>
        {navItems.map((item) => (
          <SidebarLink key={item.href} {...item} />
        ))}
      </nav>
      <div style={{ marginTop: 'auto', display: 'grid', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {user ? (
            <>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{user.displayName || user.email}</div>
              <div style={{ opacity: 0.8 }}>Secured via Google Sign-In</div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600 }}>Not signed in</div>
              <div style={{ opacity: 0.8 }}>Authenticate to unlock Gemini-powered workflows.</div>
            </>
          )}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {!user ? (
            <button className="primary" onClick={onSignIn}>Sign in with Google</button>
          ) : (
            <button className="secondary" onClick={onSignOut}>Log out</button>
          )}
        </div>
      </div>
    </aside>
  )
}

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  const [isActive] = useRoute(href === '/' ? '/' : href)
  return (
    <Link href={href}>
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderRadius: '14px',
          background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
          color: isActive ? 'white' : 'rgba(226, 232, 240, 0.86)',
          border: isActive ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid transparent',
          transition: 'background 180ms ease, transform 180ms ease, border 180ms ease'
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontWeight: 600 }}>{label}</span>
      </a>
    </Link>
  )
}
