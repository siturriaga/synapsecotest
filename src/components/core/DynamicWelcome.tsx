const scenes = [
  {
    id: 'sunrise',
    gradient: 'linear-gradient(140deg, rgba(99,102,241,0.35), rgba(14,165,233,0.2))',
    caption: 'Sunrise sync — line up your day with clarity.'
  },
  {
    id: 'day',
    gradient: 'linear-gradient(140deg, rgba(14,165,233,0.28), rgba(59,130,246,0.24))',
    caption: 'Midday momentum — keep every learner on track.'
  },
  {
    id: 'sunset',
    gradient: 'linear-gradient(140deg, rgba(249,115,22,0.28), rgba(168,85,247,0.24))',
    caption: 'Sunset reflections — capture progress effortlessly.'
  },
  {
    id: 'night',
    gradient: 'linear-gradient(160deg, rgba(15,118,110,0.28), rgba(99,102,241,0.28))',
    caption: 'Evening planning — design tomorrow’s breakthroughs.'
  }
]

function pickScene() {
  const hour = new Date().getHours()
  if (hour < 10) return scenes[0]
  if (hour < 16) return scenes[1]
  if (hour < 20) return scenes[2]
  return scenes[3]
}

export function DynamicWelcome() {
  const scene = pickScene()
  return (
    <section className="glass-card" style={{ marginBottom: 28, backgroundImage: scene.gradient }}>
      <div className="badge">Dynamic welcome</div>
      <h1 style={{ fontSize: 34, margin: '12px 0 6px', fontWeight: 800 }}>Your co-pilot for standards-aligned mastery</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 520 }}>{scene.caption}</p>
    </section>
  )
}
