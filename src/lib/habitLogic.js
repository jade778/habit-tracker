// Point values per habit type/difficulty. Tune these to retune the whole
// economy without touching individual habits.
export const POINTS = {
  easy: 1,
  medium: 2,
  hard: 3,
  quotaInstance: 2,
  quotaBonus: 4,
}

// Single conversion rate: points -> cents. Change this one number to make
// the whole app's payouts feel faster or slower.
export const CENTS_PER_POINT = 25

export function centsForDaily(difficulty) {
  return (POINTS[difficulty] ?? POINTS.medium) * CENTS_PER_POINT
}

export function centsForQuotaInstance() {
  return POINTS.quotaInstance * CENTS_PER_POINT
}

export function centsForQuotaBonus() {
  return POINTS.quotaBonus * CENTS_PER_POINT
}

export function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

// ISO week key so quota habits reset weekly regardless of which day you open the app.
export function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${weekNo}`
}

// Estimate days remaining for a goal based on recent average earn rate.
export function estimatePaceDays(remainingCents, recentHistory) {
  if (remainingCents <= 0) return 0
  const cutoff = Date.now() - 14 * 86400000
  const recent = recentHistory.filter((h) => h.timestamp >= cutoff)
  if (recent.length === 0) return null
  const totalCents = recent.reduce((sum, h) => sum + h.cents, 0)
  const daySpan = Math.max(1, Math.round((Date.now() - Math.min(...recent.map((h) => h.timestamp))) / 86400000))
  const perDay = totalCents / daySpan
  if (perDay <= 0) return null
  return Math.ceil(remainingCents / perDay)
}

export function computeStreak(dailyLog, habitId) {
  let streak = 0
  const d = new Date()
  while (true) {
    const key = todayKey(d)
    if (dailyLog[key]?.[habitId]) {
      streak += 1
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
