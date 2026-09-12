import { pointsForDaily, computeStreak, todayKey, weekKey } from '../lib/habitLogic.js'

export default function Home({ state, update, onAddHabit, onLogRun }) {
  const today = todayKey()
  const week = weekKey()
  const dailyHabits = state.habits.filter((h) => h.type === 'daily')
  const quotaHabits = state.habits.filter((h) => h.type === 'quota')

  const overallStreak = dailyHabits.length
    ? Math.min(...dailyHabits.map((h) => computeStreak(state.dailyLog, h.id)))
    : 0

  function toggleDaily(habit) {
    update((s) => {
      const dayLog = (s.dailyLog[today] ??= {})
      const wasDone = !!dayLog[habit.id]
      dayLog[habit.id] = !wasDone
      const points = pointsForDaily(habit.difficulty)
      if (!wasDone) {
        s.points += points
        s.history.unshift({
          id: crypto.randomUUID(),
          label: habit.name,
          difficulty: habit.difficulty,
          points,
          timestamp: Date.now(),
        })
      } else {
        // undo: remove the most recent matching earning
        const idx = s.history.findIndex((h) => h.label === habit.name && h.points === points)
        if (idx !== -1) {
          s.points -= points
          s.history.splice(idx, 1)
        }
      }
    })
  }

  return (
    <div className="screen">
      <div className="top-bar">
        <h2>Today</h2>
        <span className="muted">
          <i className="ti ti-flame" style={{ color: 'var(--amber)', verticalAlign: '-2px' }} aria-hidden="true" />{' '}
          {overallStreak} day streak
        </span>
      </div>

      <div className="card">
        {dailyHabits.length === 0 && <p className="muted">No daily habits yet. Add one below.</p>}
        {dailyHabits.map((h) => {
          const done = !!state.dailyLog[today]?.[h.id]
          return (
            <div className={`row ${done ? 'row-done' : ''}`} key={h.id}>
              <button
                className={`checkbox ${done ? 'checked' : ''}`}
                aria-label={done ? `Mark ${h.name} not done` : `Mark ${h.name} done`}
                onClick={() => toggleDaily(h)}
              >
                {done && <i className="ti ti-check" style={{ fontSize: 14 }} aria-hidden="true" />}
              </button>
              <span style={{ flex: 1, fontSize: 14, textDecoration: done ? 'line-through' : 'none' }}>{h.name}</span>
              <span className={`badge ${h.difficulty}`}>{h.difficulty}</span>
            </div>
          )
        })}

        {quotaHabits.map((h) => {
          const progress = state.quotaLog[h.id]?.[week]?.count ?? 0
          const pct = Math.min(100, Math.round((progress / h.target) * 100))
          return (
            <div key={h.id} style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span>
                  {h.name} {h.target}x this week
                </span>
                <span className="muted">
                  {progress} / {h.target}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button style={{ flex: 1 }} onClick={onAddHabit}>
            <i className="ti ti-plus" aria-hidden="true" /> Add habit
          </button>
          <button className="primary" style={{ flex: 1 }} onClick={onLogRun}>
            <i className="ti ti-plus" aria-hidden="true" /> Log a run
          </button>
        </div>
      </div>
    </div>
  )
}
