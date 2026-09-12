import { useState } from 'react'
import { pointsForQuotaInstance, pointsForQuotaBonus, weekKey } from '../lib/habitLogic.js'

export default function LogRun({ state, update, onClose }) {
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [error, setError] = useState('')

  const dist = parseFloat(distance)
  const dur = parseFloat(duration)
  const pace = dist > 0 && dur > 0 ? (dur / dist).toFixed(1) : null

  const runHabit = state.habits.find((h) => h.type === 'quota' && h.name.toLowerCase().includes('run'))

  function save() {
    if (!dist || dist <= 0) {
      setError('Enter a distance greater than 0.')
      return
    }
    if (!dur || dur <= 0) {
      setError('Enter a duration greater than 0.')
      return
    }
    update((s) => {
      s.runs.unshift({ id: crypto.randomUUID(), date: Date.now(), distanceMi: dist, durationMin: dur })

      const instancePoints = pointsForQuotaInstance()
      s.points += instancePoints

      const habit = s.habits.find((h) => h.id === runHabit?.id)
      if (habit) {
        const wk = weekKey()
        const bucket = (s.quotaLog[habit.id] ??= {})
        const week = (bucket[wk] ??= { count: 0, bonusPaid: false })
        week.count += 1
        s.history.unshift({
          id: crypto.randomUUID(),
          label: `Run logged (${week.count}/${habit.target})`,
          points: instancePoints,
          timestamp: Date.now(),
        })
        if (week.count >= habit.target && !week.bonusPaid) {
          week.bonusPaid = true
          const bonus = pointsForQuotaBonus()
          s.points += bonus
          s.history.unshift({
            id: crypto.randomUUID(),
            label: `${habit.name} ${habit.target}x week`,
            tag: 'quota bonus',
            points: bonus,
            timestamp: Date.now(),
          })
        }
      } else {
        s.history.unshift({
          id: crypto.randomUUID(),
          label: 'Run logged',
          points: instancePoints,
          timestamp: Date.now(),
        })
      }
    })
    onClose()
  }

  return (
    <div style={overlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <div className="top-bar">
          <h2 style={{ fontSize: 16 }}>Log a run</h2>
          <button onClick={onClose} aria-label="Close">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <div className="field">
          <label htmlFor="run-distance">Distance (miles)</label>
          <input id="run-distance" type="number" min="0" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="3.1" />
        </div>

        <div className="field">
          <label htmlFor="run-duration">Duration (minutes)</label>
          <input id="run-duration" type="number" min="0" step="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="28" />
        </div>

        {pace && <p className="muted">Pace: {pace} min/mile</p>}

        {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}

        <p className="muted" style={{ marginBottom: 10 }}>
          Earns {pointsForQuotaInstance()} pts, plus a bonus when you hit your weekly target.
        </p>

        <button className="primary" style={{ width: '100%' }} onClick={save}>
          Save run
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
