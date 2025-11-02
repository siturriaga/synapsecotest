export type StatCard = {
  id: string
  label: string
  value: number
  displayValue?: string
  delta?: string
}

export function DashboardCards({ cards }: { cards: StatCard[] }) {
  return (
    <div className="card-grid card-grid-4">
      {cards.map((card) => (
        <article key={card.id} className="glass-card fade-in">
          <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{card.label}</div>
          <div style={{ fontSize: 40, fontWeight: 900, marginTop: 12 }}>{card.displayValue ?? card.value}</div>
          {card.delta && <div className="tag" style={{ marginTop: 10 }}>{card.delta}</div>}
        </article>
      ))}
    </div>
  )
}
