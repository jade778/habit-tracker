import { resetState } from '../lib/storage.js'

export default function Settings({ state, update }) {
  function removeHabit(id) {
    update((s) => {
      s.habits = s.habits.filter((h) => h.id !== id)
    })
  }

  function resetAll() {
    if (confirm('Reset all data? This clears habits, history, and the treat fund.')) {
      resetState()
      location.reload()
    }
  }

  return (
    <div className="screen">
      <div className="top-bar">
        <h2>Settings</h2>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>Theme</span>
          <select
            value={state.theme}
            onChange={(e) => update((s) => { s.theme = e.target.value })}
            style={{ width: 120 }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400, margin: '0 0 8px' }}>Habits</h3>
      <div className="card" style={{ marginBottom: 16 }}>
        {state.habits.length === 0 && <p className="muted">No habits yet.</p>}
        {state.habits.map((h) => (
          <div className="row" key={h.id} style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14 }}>
              {h.name} <span className="muted">{h.type === 'daily' ? h.difficulty : `${h.target}x/week`}</span>
            </span>
            <button onClick={() => removeHabit(h.id)} aria-label={`Delete ${h.name}`}>
              <i className="ti ti-trash" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={resetAll} style={{ width: '100%' }}>
        Reset all data
      </button>
    </div>
  )
}
