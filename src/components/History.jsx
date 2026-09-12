import { todayKey } from '../lib/habitLogic.js'

export default function History({ state }) {
  const dailyHabits = state.habits.filter((h) => h.type === 'daily')
  const days = []
  const cursor = new Date()
  for (let i = 27; i >= 0; i--) {
    const d = new Date(cursor)
    d.setDate(cursor.getDate() - i)
    days.push(d)
  }

  function completionForDay(d) {
    const key = todayKey(d)
    const log = state.dailyLog[key]
    if (!log || dailyHabits.length === 0) return 0
    const doneCount = dailyHabits.filter((h) => log[h.id]).length
    return doneCount / dailyHabits.length
  }

  const last7 = days.slice(-7)
  const weekPct = dailyHabits.length
    ? Math.round((last7.reduce((sum, d) => sum + completionForDay(d), 0) / 7) * 100)
    : 0

  return (
    <div className="screen">
      <div className="top-bar">
        <h2>History</h2>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="muted">This week's completion</div>
        <div style={{ fontSize: 24, fontWeight: 500, marginTop: 2 }}>{weekPct}%</div>
      </div>

      <div className="card">
        <div className="muted" style={{ marginBottom: 10 }}>
          Last 28 days
        </div>
        <div className="streak-grid">
          {days.map((d, i) => {
            const pct = completionForDay(d)
            return (
              <div
                key={i}
                className={`streak-cell ${pct >= 1 ? 'done' : ''}`}
                style={pct > 0 && pct < 1 ? { background: 'var(--amber-bg)' } : undefined}
                title={todayKey(d)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
