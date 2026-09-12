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
  points: 0,
  treats: [
    { id: 't1', name: 'Boba tea', icon: 'boba', cost: 40 },
    { id: 't2', name: 'New book', icon: 'book', cost: 100 },
  ],
  history: [], // { id, label, tag?, points, timestamp }
  theme: 'light',
  colors: {
    accentH: 86,
    accentS: 40,
    accentL: 34,
    highlightH: 37,
    highlightS: 68,
    highlightL: 38,
  },
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(seedState)
    const parsed = JSON.parse(raw)
    return {
      ...structuredClone(seedState),
      ...parsed,
      colors: { ...structuredClone(seedState.colors), ...parsed.colors },
    }
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
