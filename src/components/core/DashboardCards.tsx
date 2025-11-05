export type StatCard = {
  id: string
  label: string
  value: number
  displayValue?: string
  delta?: string
}

const CARD_THEMES: Array<{ background: string; border: string; accent: string; glow: string }> = [
  {
    background: 'linear-gradient(135deg, rgba(59,130,246,0.55), rgba(14,116,144,0.48))',
    border: 'rgba(96,165,250,0.75)',
    accent: 'rgba(226,245,255,0.94)',
    glow: '0 24px 45px rgba(14,116,144,0.35)'
  },
  {
    background: 'linear-gradient(135deg, rgba(110,231,183,0.55), rgba(16,185,129,0.45))',
    border: 'rgba(45,212,191,0.75)',
    accent: 'rgba(236,253,245,0.94)',
    glow: '0 24px 45px rgba(16,185,129,0.28)'
  },
  {
    background: 'linear-gradient(135deg, rgba(244,114,182,0.55), rgba(251,191,36,0.45))',
    border: 'rgba(244,114,182,0.72)',
    accent: 'rgba(255,241,242,0.94)',
    glow: '0 24px 45px rgba(236,72,153,0.28)'
  },
  {
    background: 'linear-gradient(135deg, rgba(192,132,252,0.55), rgba(79,70,229,0.45))',
    border: 'rgba(167,139,250,0.75)',
    accent: 'rgba(237,233,254,0.94)',
    glow: '0 24px 45px rgba(124,58,237,0.32)'
  }
]

export function DashboardCards({ cards }: { cards: StatCard[] }) {
  return (
    <div className="card-grid card-grid-4">
      {cards.map((card, index) => {
        const theme = CARD_THEMES[index % CARD_THEMES.length]
        return (
          <article
            key={card.id}
            className="glass-card fade-in"
            style={{
              background: theme.background,
              borderColor: theme.border,
              color: theme.accent,
              boxShadow: theme.glow,
              backdropFilter: 'blur(24px)',
              transform: 'translateY(0)',
              transition: 'transform 220ms ease, box-shadow 220ms ease'
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = 'translateY(-6px)'
              event.currentTarget.style.boxShadow = '0 32px 70px rgba(15,23,42,0.45)'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = 'translateY(0)'
              event.currentTarget.style.boxShadow = theme.glow
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.85
              }}
            >
              {card.label}
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 12 }}>{card.displayValue ?? card.value}</div>
            {card.delta && (
              <div
                className="tag"
                style={{
                  marginTop: 10,
                  background: 'rgba(15, 23, 42, 0.25)',
                  border: '1px solid rgba(255,255,255,0.22)'
                }}
              >
                {card.delta}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
