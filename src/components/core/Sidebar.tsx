import type { HTMLAttributes } from 'react'
import { Link, useRoute } from 'wouter'
import type { User } from 'firebase/auth'
import { usePreferences } from '../../hooks/usePreferences'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/roster', label: 'Roster Upload', icon: '🧑‍🏫' },
  { href: '/groups', label: 'Student Groups', icon: '🧬' },
  { href: '/standards', label: 'Standards Engine', icon: '📋' },
  { href: '/assignments', label: 'Assignments', icon: '✍️' },
  { href: '/settings', label: 'Workspace Settings', icon: '⚙️' }
]

type SidebarProps = {
  user: User | null
  authAvailable: boolean
  onSignIn: () => void
  onSignOut: () => void
  onDismiss?: () => void
} & HTMLAttributes<HTMLElement>

export function Sidebar({ user, authAvailable, onSignIn, onSignOut, onDismiss, className, ...rest }: SidebarProps) {
  const { displayName } = usePreferences()
  const asideClassName = className ? `sidebar ${className}` : 'sidebar'

  const handleSignIn = () => {
    onSignIn()
    onDismiss?.()
  }

  const handleSignOut = () => {
    onSignOut()
    onDismiss?.()
  }

  return (
    <aside className={asideClassName} {...rest}>
      <div className="sidebar__inner">
        <button type="button" className="sidebar__close" onClick={onDismiss}>
          Close
        </button>
        <div className="sidebar__brand">
          <span className="sidebar__logo">⚡</span>
          <span className="sidebar__title">SYNAPSE</span>
        </div>
        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <SidebarLink key={item.href} {...item} onNavigate={onDismiss} />
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="sidebar__account">
            {user ? (
              <>
                <div className="sidebar__account-name">{displayName}</div>
                <div className="sidebar__account-email">{user.email}</div>
                <div className="sidebar__account-meta">Secured via Google Sign-In</div>
              </>
            ) : (
              <>
                <div className="sidebar__account-name">Not signed in</div>
                <div className="sidebar__account-meta">
                  {authAvailable
                    ? 'Authenticate to unlock Gemini-powered workflows.'
                    : 'Firebase credentials are missing. Update Settings → Diagnostics to enable Google sign-in.'}
                </div>
              </>
            )}
          </div>
          <div className="sidebar__actions">
            {!user ? (
              <button className="primary" onClick={handleSignIn} disabled={!authAvailable}>
                Sign in with Google
              </button>
            ) : (
              <button className="secondary" onClick={handleSignOut}>
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

function SidebarLink({ href, label, icon, onNavigate }: { href: string; label: string; icon: string; onNavigate?: () => void }) {
  const [isActive] = useRoute(href === '/' ? '/' : href)
  return (
    <Link
      href={href}
      className="sidebar-link"
      data-active={isActive ? 'true' : undefined}
      onClick={() => {
        onNavigate?.()
      }}
    >
      <span className="sidebar-link__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sidebar-link__label">{label}</span>
    </Link>
  )
}
