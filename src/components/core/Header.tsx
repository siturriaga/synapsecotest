const greetings = [
  'Empower every learner today',
  'Crafting differentiated brilliance',
  'Driving mastery with insight',
  'Designing learning adventures'
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Header({ user }: { user: { displayName?: string | null } | null }) {
  const base = getGreeting()
  const tagline = greetings[(new Date().getDay() + new Date().getHours()) % greetings.length]
  const now = new Date()
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 28px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
      backdropFilter: 'blur(12px)',
      background: 'rgba(15, 23, 42, 0.45)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{base}{user?.displayName ? `, ${user.displayName}` : ''}</div>
        <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>{tagline}</div>
      </div>
      <div style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
        <div>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Eastern Time • Secure Gemini orchestration</div>
      </div>
    </header>
  )
}
