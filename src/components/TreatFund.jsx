import { useState } from 'react'
import { TREAT_ICONS, iconById } from '../lib/icons.jsx'

function TreatCard({ treat, points, onRedeem, onSave, onRemove }) {
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
      <div className="treat-card">
        <div className="field" style={{ width: '100%', marginBottom: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Treat name" />
        </div>
        <div className="field" style={{ width: '100%', marginBottom: 8 }}>
          <input type="number" min="1" step="1" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
        <div className="icon-picker-grid" style={{ width: '100%', marginBottom: 8 }}>
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
        <div style={{ display: 'flex', gap: 6, width: '100%' }}>
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
  const canRedeem = points >= treat.cost

  return (
    <div className="treat-card">
      <div className="treat-card-actions">
        <button className="btn-sm" onClick={startEdit} aria-label={`Edit ${treat.name}`}>
          <i className="ti ti-edit" aria-hidden="true" /> Edit
        </button>
        <button className="btn-sm btn-danger" onClick={() => onRemove(treat.id)} aria-label={`Delete ${treat.name}`}>
          <i className="ti ti-trash" aria-hidden="true" /> Delete
        </button>
      </div>
      {icon.render({ size: 32 })}
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{treat.name}</div>
      <div className="muted" style={{ marginTop: 2 }}>{treat.cost} pts</div>
      <button className={canRedeem ? 'primary' : ''} disabled={!canRedeem} style={{ width: '100%', marginTop: 8 }} onClick={() => onRedeem(treat)}>
        Redeem
      </button>
    </div>
  )
}

export default function TreatFund({ state, update }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [cost, setCost] = useState('20')
  const [iconId, setIconId] = useState(TREAT_ICONS[0].id)
  const [error, setError] = useState('')

  function redeem(treat) {
    if (state.points < treat.cost) return
    update((s) => {
      s.points -= treat.cost
      s.history.unshift({
        id: crypto.randomUUID(),
        label: treat.name,
        tag: 'redeemed',
        points: -treat.cost,
        timestamp: Date.now(),
      })
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

  function addTreat() {
    const parsed = Number(cost)
    if (!name.trim()) {
      setError('Give the treat a name first.')
      return
    }
    if (!parsed || parsed <= 0) {
      setError('Enter a point cost greater than 0.')
      return
    }
    update((s) => {
      s.treats.push({ id: crypto.randomUUID(), name: name.trim(), icon: iconId, cost: Math.round(parsed) })
    })
    setName('')
    setCost('20')
    setIconId(TREAT_ICONS[0].id)
    setError('')
    setShowForm(false)
  }

  return (
    <div className="screen">
      <div className="top-bar">
        <h2>Treat fund</h2>
      </div>

      <div className="card" style={{ background: 'var(--amber-bg)', textAlign: 'center', border: 'none' }}>
        <i className="ti ti-star" style={{ fontSize: 26, color: 'var(--amber)' }} aria-hidden="true" />
        <div className="muted" style={{ marginTop: 4 }}>Points balance</div>
        <div style={{ fontSize: 32, fontWeight: 500, marginTop: 2 }}>{state.points}</div>
      </div>

      <div className="top-bar" style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400, margin: 0 }}>Treats</h3>
        <button onClick={() => setShowForm((v) => !v)} aria-label="New treat">
          <i className="ti ti-plus" aria-hidden="true" />
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="field">
            <label htmlFor="treat-name">Treat name</label>
            <input id="treat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Movie night" />
          </div>
          <div className="field">
            <label htmlFor="treat-cost">Point cost</label>
            <input id="treat-cost" type="number" min="1" step="1" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
          <div className="field">
            <label>Icon</label>
            <div className="icon-picker-grid">
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
          </div>
          {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}
          <button className="primary" style={{ width: '100%' }} onClick={addTreat}>
            Add treat
          </button>
        </div>
      )}

      <div className="treat-grid">
        {state.treats.length === 0 && <p className="muted">No treats yet. Add one above.</p>}
        {state.treats.map((t) => (
          <TreatCard key={t.id} treat={t} points={state.points} onRedeem={redeem} onSave={saveTreat} onRemove={removeTreat} />
        ))}
      </div>

      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400, margin: '18px 0 8px' }}>Recent activity</h3>
      <div className="card">
        {state.history.length === 0 && <p className="muted">Complete a habit to start earning.</p>}
        {state.history.slice(0, 20).map((h) => (
          <div className="row" key={h.id} style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13 }}>
              {h.label}
              {h.tag && (
                <span className="badge" style={{ marginLeft: 6, background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                  {h.tag}
                </span>
              )}
            </span>
            <span style={{ color: h.points < 0 ? 'var(--coral)' : 'var(--green)', fontWeight: 500, fontSize: 13 }}>
              {h.points < 0 ? '' : '+'}
              {h.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
