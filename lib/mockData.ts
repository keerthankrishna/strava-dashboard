import type { Run } from './types'

const cities = ['London', 'Berlin', 'New York', 'Tokyo', 'Barcelona', 'Amsterdam', 'Paris', 'Sydney', 'Chicago', 'Melbourne']
const runNames = [
  'Morning Easy Run', 'Tempo Blast', 'Long Slow Distance', 'Interval Session',
  'Recovery Jog', 'Fartlek Fun', 'Hill Repeats', 'Lunch Break Run', 'Sunset Miles',
  'Pre-Race Shakeout', 'Sunday Long Run', 'Track Tuesday', 'Threshold Thursday',
  'Easy Wednesday', 'Race Day', 'Weekend Warrior', 'Early Bird Run', 'Dusk Patrol',
  'Coffee Run', 'Commute Run', 'Treadmill Grind', 'Virtual 10K', 'Zwift Sufferfest',
  'Base Building', 'Marathon Prep', 'Speed Work', 'Strides Session',
]
const weatherConditions: Run['weatherCondition'][] = ['sunny', 'cloudy', 'rainy', 'windy']

function randomBetween(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min
  return decimals > 0 ? Math.round(val * 10 ** decimals) / 10 ** decimals : Math.round(val)
}

function generateRun(index: number, date: Date): Run {
  const typeRoll = Math.random()
  const type: Run['type'] = typeRoll < 0.6 ? 'outdoor' : typeRoll < 0.8 ? 'indoor' : 'virtual'

  // Realistic distance distribution
  const distRoll = Math.random()
  let distanceKm: number
  if (distRoll < 0.25) distanceKm = randomBetween(3, 6, 1)
  else if (distRoll < 0.5) distanceKm = randomBetween(7, 11, 1)
  else if (distRoll < 0.7) distanceKm = randomBetween(12, 16, 1)
  else if (distRoll < 0.85) distanceKm = randomBetween(18, 24, 1)
  else if (distRoll < 0.95) distanceKm = 42.2
  else distanceKm = randomBetween(25, 35, 1)

  // Pace varies by distance and type (indoor slightly faster)
  const basePace = type === 'indoor' ? randomBetween(285, 340) : randomBetween(295, 360)
  const paceAdjust = distanceKm > 20 ? 20 : distanceKm > 15 ? 10 : 0
  const pacePerKm = basePace + paceAdjust

  const durationSeconds = Math.round(distanceKm * pacePerKm)

  const heartRateAvg = randomBetween(138, 172)
  const heartRateMax = heartRateAvg + randomBetween(12, 28)

  return {
    id: `run-${index}-${date.getTime()}`,
    name: runNames[index % runNames.length],
    date: date.toISOString(),
    type,
    distanceKm,
    durationSeconds,
    pacePerKm,
    elevationGainM: type === 'indoor' ? 0 : randomBetween(0, 320),
    heartRateAvg,
    heartRateMax,
    calories: Math.round(distanceKm * randomBetween(58, 72)),
    cadenceAvg: randomBetween(162, 184),
    sufferScore: Math.round((heartRateAvg / 170) * (durationSeconds / 3600) * 100),
    weatherTemp: type !== 'indoor' ? randomBetween(5, 28) : undefined,
    weatherCondition: type !== 'indoor' ? weatherConditions[Math.floor(Math.random() * weatherConditions.length)] : undefined,
    city: type === 'outdoor' ? cities[Math.floor(Math.random() * cities.length)] : undefined,
    stravaLink: `https://www.strava.com/activities/${1000000 + index}`,
    kudos: randomBetween(0, 48),
    personalBest: false,
  }
}

// Generate 85 runs spread across 2024 and 2025
function generateMockRuns(): Run[] {
  const runs: Run[] = []
  const now = new Date('2025-12-31')

  // 50 runs in 2025 (approx weekly)
  for (let i = 0; i < 50; i++) {
    const daysBack = Math.round((365 / 50) * i) + randomBetween(0, 3)
    const date = new Date(now)
    date.setDate(date.getDate() - daysBack)
    if (date.getFullYear() >= 2025) {
      runs.push(generateRun(i, date))
    }
  }

  // 35 runs in 2024
  const start2024 = new Date('2024-12-31')
  for (let i = 0; i < 35; i++) {
    const daysBack = Math.round((365 / 35) * i) + randomBetween(0, 4)
    const date = new Date(start2024)
    date.setDate(date.getDate() - daysBack)
    if (date.getFullYear() >= 2024) {
      runs.push(generateRun(50 + i, date))
    }
  }

  // Sort by date desc
  runs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Mark personal bests
  const pbDistances = [5, 10, 21.1, 42.2]
  const tolerance = 0.05

  for (const targetDist of pbDistances) {
    const candidates = runs.filter(r =>
      Math.abs(r.distanceKm - targetDist) / targetDist <= tolerance
    )
    if (candidates.length > 0) {
      const best = candidates.reduce((a, b) => a.pacePerKm < b.pacePerKm ? a : b)
      const idx = runs.findIndex(r => r.id === best.id)
      if (idx >= 0) runs[idx].personalBest = true
    }
  }

  return runs
}

export const mockRuns: Run[] = generateMockRuns()
