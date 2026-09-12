import { useState } from 'react'

export default function AddHabit({ update, onClose }) {
  const [type, setType] = useState('daily')
  const [name, setName] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [unit, setUnit] = useState('sessions')
  const [target, setTarget] = useState('3')
  const [error, setError] = useState('')

  function save() {
    if (!name.trim()) {
      setError('Give the habit a name first.')
      return
    }
    if (type === 'quota' && (!target || Number(target) <= 0)) {
      setError('Enter a weekly target greater than 0.')
      return
    }
    update((s) => {
      const habit =
        type === 'daily'
          ? { id: crypto.randomUUID(), name: name.trim(), type: 'daily', difficulty }
          : { id: crypto.randomUUID(), name: name.trim(), type: 'quota', unit: unit.trim() || 'times', target: Number(target) }
      s.habits.push(habit)
    })
    onClose()
  }

  return (
    <div style={overlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <div className="top-bar">
          <h2 style={{ fontSize: 16 }}>Add habit</h2>
          <button onClick={onClose} aria-label="Close">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <div className="field">
          <label htmlFor="habit-type">Type</label>
          <select id="habit-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="daily">Daily (yes/no)</option>
            <option value="quota">Weekly quota (e.g. 3x a week)</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="habit-name">Name</label>
          <input id="habit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Stretch" />
        </div>

        {type === 'daily' ? (
          <div className="field">
            <label htmlFor="habit-difficulty">Difficulty</label>
            <select id="habit-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        ) : (
          <>
            <div className="field">
              <label htmlFor="habit-unit">Unit</label>
              <input id="habit-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="runs, sessions, miles" />
            </div>
            <div className="field">
              <label htmlFor="habit-target">Weekly target</label>
              <input id="habit-target" type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
          </>
        )}

        {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}

        <button className="primary" style={{ width: '100%' }} onClick={save}>
          Add habit
        </button>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: 16,
  zIndex: 20,
}
