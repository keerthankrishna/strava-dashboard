import type { Run, PersonalBest, MonthlyVolume, WeeklyVolume } from './types'

export function formatPace(secondsPerKm: number): string {
  const mins = Math.floor(secondsPerKm / 60)
  const secs = Math.round(secondsPerKm % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function getPaceForDistance(distanceKm: number, durationSeconds: number): string {
  const paceSeconds = durationSeconds / distanceKm
  return formatPace(paceSeconds)
}

export function getTotalKm(runs: Run[]): number {
  return Math.round(runs.reduce((sum, r) => sum + r.distanceKm, 0) * 10) / 10
}

export function getTotalRunsThisYear(runs: Run[], year = new Date().getFullYear()): number {
  return runs.filter(r => new Date(r.date).getFullYear() === year).length
}

export function getRunsByType(runs: Run[], type: Run['type']): Run[] {
  return runs.filter(r => r.type === type)
}

export function getBestRun(runs: Run[], targetDistanceKm: number, tolerance = 0.05): Run | null {
  const candidates = runs.filter(r =>
    Math.abs(r.distanceKm - targetDistanceKm) / targetDistanceKm <= tolerance
  )
  if (candidates.length === 0) return null
  return candidates.reduce((best, r) => r.pacePerKm < best.pacePerKm ? r : best)
}

export function getPersonalBests(runs: Run[]): PersonalBest[] {
  const distances = [
    { label: '5K', km: 5 },
    { label: '10K', km: 10 },
    { label: 'HALF', km: 21.1 },
    { label: 'MARATHON', km: 42.2 },
  ]

  const pbs: PersonalBest[] = distances.map(({ label, km }) => {
    const best = getBestRun(runs, km)
    return {
      distance: label,
      distanceKm: km,
      run: best,
      formattedTime: best ? formatDuration(best.durationSeconds) : '—',
      pace: best ? `${formatPace(best.pacePerKm)}/KM` : '—',
    }
  })

  // Longest run
  const longest = runs.length > 0
    ? runs.reduce((a, b) => a.distanceKm > b.distanceKm ? a : b)
    : null

  pbs.push({
    distance: 'LONGEST',
    distanceKm: longest?.distanceKm ?? 0,
    run: longest,
    formattedTime: longest ? `${longest.distanceKm.toFixed(1)} KM` : '—',
    pace: longest ? `${formatPace(longest.pacePerKm)}/KM` : '—',
  })

  return pbs
}

export function getMonthlyVolume(runs: Run[]): MonthlyVolume[] {
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const map = new Map<string, { km: number; count: number; totalPace: number }>()

  for (const run of runs) {
    const d = new Date(run.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const existing = map.get(key) ?? { km: 0, count: 0, totalPace: 0 }
    map.set(key, {
      km: existing.km + run.distanceKm,
      count: existing.count + 1,
      totalPace: existing.totalPace + run.pacePerKm,
    })
  }

  return Array.from(map.entries())
    .map(([key, val]) => {
      const [year, month] = key.split('-').map(Number)
      return {
        month: monthNames[month],
        monthIndex: month,
        year,
        km: Math.round(val.km * 10) / 10,
        count: val.count,
        avgPaceSeconds: Math.round(val.totalPace / val.count),
      }
    })
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex)
}

export function getWeeklyVolume(runs: Run[]): WeeklyVolume[] {
  const weeks: WeeklyVolume[] = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - i * 7)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const weekRuns = runs.filter(r => {
      const d = new Date(r.date)
      return d >= weekStart && d < weekEnd
    })

    weeks.push({
      weekStart: weekStart.toISOString().slice(0, 10),
      km: Math.round(weekRuns.reduce((s, r) => s + r.distanceKm, 0) * 10) / 10,
      count: weekRuns.length,
    })
  }

  return weeks
}

export function getAvgPace(runs: Run[]): string {
  if (runs.length === 0) return '—'
  const avg = runs.reduce((s, r) => s + r.pacePerKm, 0) / runs.length
  return formatPace(avg)
}

export function getTotalElevation(runs: Run[]): number {
  return Math.round(runs.reduce((s, r) => s + r.elevationGainM, 0))
}

export function getTotalCalories(runs: Run[]): number {
  return Math.round(runs.reduce((s, r) => s + r.calories, 0))
}

export function getAvgHeartRate(runs: Run[]): number {
  if (runs.length === 0) return 0
  return Math.round(runs.reduce((s, r) => s + r.heartRateAvg, 0) / runs.length)
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}
