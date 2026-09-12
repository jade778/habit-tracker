// Point values per habit type/difficulty. Tune these to retune the whole
// economy without touching individual habits.
export const POINTS = {
  easy: 5,
  medium: 10,
  hard: 15,
  quotaInstance: 8,
  quotaBonus: 20,
}

export function pointsForDaily(difficulty) {
  return POINTS[difficulty] ?? POINTS.medium
}

export function pointsForQuotaInstance() {
  return POINTS.quotaInstance
}

export function pointsForQuotaBonus() {
  return POINTS.quotaBonus
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

// Estimate days remaining for a treat based on recent average earn rate.
export function estimatePaceDays(remainingPoints, recentHistory) {
  if (remainingPoints <= 0) return 0
  const cutoff = Date.now() - 14 * 86400000
  const recent = recentHistory.filter((h) => h.timestamp >= cutoff)
  if (recent.length === 0) return null
  const totalPoints = recent.reduce((sum, h) => sum + h.points, 0)
  const daySpan = Math.max(1, Math.round((Date.now() - Math.min(...recent.map((h) => h.timestamp))) / 86400000))
  const perDay = totalPoints / daySpan
  if (perDay <= 0) return null
  return Math.ceil(remainingPoints / perDay)
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
