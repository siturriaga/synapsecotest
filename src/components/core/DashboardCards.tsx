export type StatCard = {
  id: string
  label: string
  value: number
  displayValue?: string
  delta?: string
}

const CARD_THEMES: Array<{ background: string; border: string; accent: string }> = [
  {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.65), rgba(168,85,247,0.55))',
    border: 'rgba(129, 140, 248, 0.75)',
    accent: 'rgba(226, 232, 240, 0.82)'
  },
  {
    background: 'linear-gradient(135deg, rgba(56,189,248,0.65), rgba(14,165,233,0.55))',
    border: 'rgba(56, 189, 248, 0.75)',
    accent: 'rgba(240, 249, 255, 0.9)'
  },
  {
    background: 'linear-gradient(135deg, rgba(244,114,182,0.65), rgba(251,191,36,0.6))',
    border: 'rgba(244, 114, 182, 0.75)',
    accent: 'rgba(255, 241, 230, 0.92)'
  },
  {
    background: 'linear-gradient(135deg, rgba(45,212,191,0.65), rgba(34,197,94,0.6))',
    border: 'rgba(45, 212, 191, 0.75)',
    accent: 'rgba(240, 253, 244, 0.9)'
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
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.32)'
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.9
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
