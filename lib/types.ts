export interface Run {
  id: string
  name: string
  date: string // ISO format
  type: 'outdoor' | 'indoor' | 'virtual'
  distanceKm: number
  durationSeconds: number
  pacePerKm: number // seconds per km
  elevationGainM: number
  heartRateAvg: number
  heartRateMax: number
  calories: number
  cadenceAvg: number
  sufferScore: number
  weatherTemp?: number // celsius, outdoor only
  weatherCondition?: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  city?: string // outdoor runs
  stravaLink?: string
  kudos: number
  personalBest: boolean
}

export type RunType = 'outdoor' | 'indoor' | 'virtual'
export type DistanceFilter = 'all' | '5k' | '10k' | 'half' | 'marathon'
export type YearFilter = 'all' | string

export interface PersonalBest {
  distance: string
  distanceKm: number
  run: Run | null
  formattedTime: string
  pace: string
}

export interface MonthlyVolume {
  month: string
  monthIndex: number
  year: number
  km: number
  count: number
  avgPaceSeconds: number
}

export interface WeeklyVolume {
  weekStart: string
  km: number
  count: number
}
