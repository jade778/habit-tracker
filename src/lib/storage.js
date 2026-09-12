const KEY = 'habit-quest-state-v1'

const seedState = {
  habits: [
    { id: 'h1', name: 'Read 20 min', type: 'daily', difficulty: 'easy' },
    { id: 'h2', name: 'Stretch', type: 'daily', difficulty: 'medium' },
    { id: 'h3', name: 'Run', type: 'quota', unit: 'runs', target: 3 },
  ],
  dailyLog: {}, // { '2026-09-12': { h1: true, h2: false } }
  quotaLog: {}, // { 'h3': { '2026-W37': { count: 2, bonusPaid: false } } }
  runs: [], // { id, date, distanceMi, durationMin }
  treatFund: {
    goalName: 'Boba tea',
    goalCents: 2000,
    currentCents: 0,
    history: [], // { id, label, cents, timestamp }
  },
  theme: 'dark',
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(seedState)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(seedState), ...parsed }
  } catch {
    return structuredClone(seedState)
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage unavailable (private mode, quota) - fail silently, state stays in memory
  }
}

export function resetState() {
  localStorage.removeItem(KEY)
}
