import { useState } from 'react'
import { resetState } from '../lib/storage.js'
import { TREAT_ICONS, iconById } from '../lib/icons.jsx'

function ColorGroup({ title, prefix, colors, update }) {
  const h = colors[`${prefix}H`]
  const s = colors[`${prefix}S`]
  const l = colors[`${prefix}L`]

  function set(key, value) {
    update((st) => {
      st.colors[`${prefix}${key}`] = Number(value)
    })
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', border: 'none', padding: '0 0 10px' }}>
        <span>{title}</span>
        <span className="color-swatch" style={{ background: `hsl(${h}, ${s}%, ${l}%)` }} />
      </div>
      <div className="field" style={{ marginBottom: 8 }}>
        <label>Hue</label>
        <input type="range" min="0" max="360" value={h} onChange={(e) => set('H', e.target.value)} />
      </div>
      <div className="field" style={{ marginBottom: 8 }}>
        <label>Saturation</label>
        <input type="range" min="0" max="100" value={s} onChange={(e) => set('S', e.target.value)} />
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>Lightness</label>
        <input type="range" min="10" max="90" value={l} onChange={(e) => set('L', e.target.value)} />
      </div>
    </div>
  )
}

function HabitRow({ habit, onSave, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(habit.name)
  const [difficulty, setDifficulty] = useState(habit.difficulty ?? 'medium')
  const [unit, setUnit] = useState(habit.unit ?? 'times')
  const [target, setTarget] = useState(String(habit.target ?? 1))
  const [error, setError] = useState('')

  function startEdit() {
    setName(habit.name)
    setDifficulty(habit.difficulty ?? 'medium')
    setUnit(habit.unit ?? 'times')
    setTarget(String(habit.target ?? 1))
    setError('')
    setEditing(true)
  }

  function save() {
    if (!name.trim()) {
      setError('Give the habit a name first.')
      return
    }
    if (habit.type === 'quota' && (!target || Number(target) <= 0)) {
      setError('Enter a weekly target greater than 0.')
      return
    }
    onSave(habit.id, { name: name.trim(), difficulty, unit: unit.trim() || 'times', target: Number(target) })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="field" style={{ marginBottom: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Habit name" />
        </div>
        {habit.type === 'daily' ? (
          <div className="field" style={{ marginBottom: 8 }}>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        ) : (
          <>
            <div className="field" style={{ marginBottom: 8 }}>
              <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="runs, sessions, miles" />
            </div>
            <div className="field" style={{ marginBottom: 8 }}>
              <input type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
          </>
        )}
        {error && <div className="error-text" style={{ marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1 }} onClick={() => setEditing(false)}>
            Cancel
          </button>
          <button className="primary" style={{ flex: 1 }} onClick={save}>
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span style={{ fontSize: 14 }}>
        {habit.name} <span className="muted">{habit.type === 'daily' ? habit.difficulty : `${habit.target}x/week`}</span>
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn-sm" onClick={startEdit} aria-label={`Edit ${habit.name}`}>
          <i className="ti ti-edit" aria-hidden="true" /> Edit
        </button>
        <button className="btn-sm btn-danger" onClick={() => onRemove(habit.id)} aria-label={`Delete ${habit.name}`}>
          <i className="ti ti-trash" aria-hidden="true" /> Delete
        </button>
      </div>
    </div>
  )
}

function TreatRow({ treat, onSave, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(treat.name)
  const [cost, setCost] = useState(String(treat.cost))
  const [iconId, setIconId] = useState(treat.icon)
  const [error, setError] = useState('')

  function startEdit() {
    setName(treat.name)
    setCost(String(treat.cost))
    setIconId(treat.icon)
    setError('')
    setEditing(true)
  }

  function save() {
    const parsed = Number(cost)
    if (!name.trim()) {
      setError('Give the treat a name first.')
      return
    }
    if (!parsed || parsed <= 0) {
      setError('Enter a point cost greater than 0.')
      return
    }
    onSave(treat.id, { name: name.trim(), cost: Math.round(parsed), icon: iconId })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="field" style={{ marginBottom: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Treat name" />
        </div>
        <div className="field" style={{ marginBottom: 8 }}>
          <input type="number" min="1" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
        <div className="icon-picker-grid" style={{ marginBottom: 8 }}>
          {TREAT_ICONS.map((icon) => (
            <button
              key={icon.id}
              type="button"
              className={`icon-picker-item ${iconId === icon.id ? 'selected' : ''}`}
              onClick={() => setIconId(icon.id)}
              aria-label={icon.label}
            >
              {icon.render()}
            </button>
          ))}
        </div>
        {error && <div className="error-text" style={{ marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1 }} onClick={() => setEditing(false)}>
            Cancel
          </button>
          <button className="primary" style={{ flex: 1 }} onClick={save}>
            Save
          </button>
        </div>
      </div>
    )
  }

  const icon = iconById(treat.icon)

  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon.render({ size: 18 })}
        {treat.name} <span className="muted">{treat.cost} pts</span>
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn-sm" onClick={startEdit} aria-label={`Edit ${treat.name}`}>
          <i className="ti ti-edit" aria-hidden="true" /> Edit
        </button>
        <button className="btn-sm btn-danger" onClick={() => onRemove(treat.id)} aria-label={`Delete ${treat.name}`}>
          <i className="ti ti-trash" aria-hidden="true" /> Delete
        </button>
      </div>
    </div>
  )
}

export default function Settings({ state, update }) {
  function saveHabit(id, changes) {
    update((s) => {
      const habit = s.habits.find((h) => h.id === id)
      if (!habit) return
      habit.name = changes.name
      if (habit.type === 'daily') {
        habit.difficulty = changes.difficulty
      } else {
        habit.unit = changes.unit
        habit.target = changes.target
      }
    })
  }

  function removeHabit(id) {
    update((s) => {
      s.habits = s.habits.filter((h) => h.id !== id)
    })
  }

  function saveTreat(id, changes) {
    update((s) => {
      const treat = s.treats.find((t) => t.id === id)
      if (!treat) return
      treat.name = changes.name
      treat.cost = changes.cost
      treat.icon = changes.icon
    })
  }

  function removeTreat(id) {
    update((s) => {
      s.treats = s.treats.filter((t) => t.id !== id)
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
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400, margin: '0 0 8px' }}>Colors</h3>
      <div className="card" style={{ marginBottom: 16 }}>
        <ColorGroup title="Accent color" prefix="accent" colors={state.colors} update={update} />
        <ColorGroup title="Highlight color" prefix="highlight" colors={state.colors} update={update} />
      </div>

      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400, margin: '0 0 8px' }}>Habits</h3>
      <div className="card" style={{ marginBottom: 16 }}>
        {state.habits.length === 0 && <p className="muted">No habits yet.</p>}
        {state.habits.map((h) => (
          <HabitRow key={h.id} habit={h} onSave={saveHabit} onRemove={removeHabit} />
        ))}
      </div>

      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400, margin: '0 0 8px' }}>Treats</h3>
      <div className="card" style={{ marginBottom: 16 }}>
        {state.treats.length === 0 && <p className="muted">No treats yet.</p>}
        {state.treats.map((t) => (
          <TreatRow key={t.id} treat={t} onSave={saveTreat} onRemove={removeTreat} />
        ))}
      </div>

      <button onClick={resetAll} style={{ width: '100%' }}>
        Reset all data
      </button>
    </div>
  )
}
