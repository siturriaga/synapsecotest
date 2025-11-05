export default function NotFoundPage() {
  return (
    <div className="glass-card" style={{ padding: 32, display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>We couldn&apos;t find that workspace view.</h2>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>
        Double-check the address or return to the dashboard to keep working with your synced roster insights.
      </p>
      <a
        href="/"
        className="button button--primary"
        style={{ width: 'fit-content', padding: '10px 18px', borderRadius: 999 }}
      >
        Go back to dashboard
      </a>
    </div>
  )
}
