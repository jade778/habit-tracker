import { useState } from 'react'
import { estimatePaceDays, formatCents } from '../lib/habitLogic.js'

export default function TreatFund({ state, update }) {
  const [editingGoal, setEditingGoal] = useState(false)
  const [name, setName] = useState(state.treatFund.goalName)
  const [amount, setAmount] = useState((state.treatFund.goalCents / 100).toString())
  const [error, setError] = useState('')

  const { currentCents, goalCents, goalName, history } = state.treatFund
  const pct = Math.min(100, Math.round((currentCents / goalCents) * 100))
  const canRedeem = currentCents >= goalCents
  const remaining = Math.max(0, goalCents - currentCents)
  const paceDays = remaining > 0 ? estimatePaceDays(remaining, history) : 0

  function redeem() {
    update((s) => {
      s.treatFund.currentCents = 0
    })
  }

  function saveGoal() {
    const parsed = parseFloat(amount)
    if (!name.trim()) {
      setError('Give the treat a name first.')
      return
    }
    if (!parsed || parsed <= 0) {
      setError('Enter an amount greater than $0.')
      return
    }
    update((s) => {
      s.treatFund.goalName = name.trim()
      s.treatFund.goalCents = Math.round(parsed * 100)
    })
    setError('')
    setEditingGoal(false)
  }

  return (
    <div className="screen">
      <div className="top-bar">
        <h2>Treat fund</h2>
        <button onClick={() => setEditingGoal((v) => !v)} aria-label="Edit goal">
          <i className="ti ti-edit" aria-hidden="true" />
        </button>
      </div>

      {editingGoal ? (
        <div className="card">
          <div className="field">
            <label htmlFor="goal-name">Treat name</label>
            <input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Boba tea" />
          </div>
          <div className="field">
            <label htmlFor="goal-amount">Goal amount ($)</label>
            <input id="goal-amount" type="number" min="0" step="0.5" value={amount} onChange={(e) => setAmount(e.target.value)} />
            {error && <div className="error-text">{error}</div>}
          </div>
          <button className="primary" style={{ width: '100%' }} onClick={saveGoal}>
            Save goal
          </button>
        </div>
      ) : (
        <div className="card" style={{ background: 'var(--amber-bg)', textAlign: 'center', border: 'none' }}>
          <i className="ti ti-cup" style={{ fontSize: 26, color: 'var(--amber)' }} aria-hidden="true" />
          <div className="muted" style={{ marginTop: 4 }}>
            {goalName}
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, marginTop: 2 }}>
            {formatCents(currentCents)} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>/ {formatCents(goalCents)}</span>
          </div>
          <div className="progress-track" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--amber)' }} />
          </div>
          {!canRedeem && paceDays !== null && (
            <div className="muted" style={{ marginTop: 8 }}>
              At your current pace, about {paceDays} day{paceDays === 1 ? '' : 's'}
            </div>
          )}
          <button className={canRedeem ? 'primary' : ''} style={{ width: '100%', marginTop: 12 }} disabled={!canRedeem} onClick={redeem}>
            {canRedeem ? 'Redeem now' : `Redeem at ${formatCents(goalCents)}`}
          </button>
        </div>
      )}

      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400, margin: '18px 0 8px' }}>Recent earnings</h3>
      <div className="card">
        {history.length === 0 && <p className="muted">Complete a habit to start earning.</p>}
        {history.slice(0, 20).map((h) => (
          <div className="row" key={h.id} style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13 }}>
              {h.label}
              {h.tag && (
                <span className="badge" style={{ marginLeft: 6, background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                  {h.tag}
                </span>
              )}
            </span>
            <span style={{ color: 'var(--green)', fontWeight: 500, fontSize: 13 }}>+{formatCents(h.cents)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
