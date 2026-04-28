import type { Run } from '@/lib/types'

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  })
  const data = await res.json()
  return data.access_token
}

async function fetchActivities(token: string) {
  const all: Record<string, unknown>[] = []
  let page = 1

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const batch: Record<string, unknown>[] = await res.json()
    if (!batch.length) break
    all.push(...batch)
    if (batch.length < 200) break
    page++
  }

  return all
}

function mapActivity(a: Record<string, unknown>): Run {
  const distanceKm = (a.distance as number) / 1000
  const durationSeconds = a.moving_time as number
  const pacePerKm = durationSeconds / distanceKm

  const typeMap: Record<string, Run['type']> = {
    Run:        'outdoor',
    TrailRun:   'outdoor',
    VirtualRun: 'virtual',
    Treadmill:  'indoor',
  }

  return {
    id:             String(a.id),
    name:           a.name as string,
    date:           a.start_date as string,
    type:           typeMap[a.sport_type as string] ?? 'outdoor',
    distanceKm,
    durationSeconds,
    pacePerKm,
    elevationGainM: (a.total_elevation_gain as number) ?? 0,
    heartRateAvg:   (a.average_heartrate as number) ?? 0,
    heartRateMax:   (a.max_heartrate as number) ?? 0,
    calories:       (a.calories as number) ?? 0,
    cadenceAvg:     (a.average_cadence as number) ?? 0,
    sufferScore:    (a.suffer_score as number) ?? 0,
    city:           a.location_city as string | undefined,
    stravaLink:     `https://www.strava.com/activities/${a.id}`,
    kudos:          (a.kudos_count as number) ?? 0,
    personalBest:   (a.pr_count as number) > 0,
  }
}

export async function fetchRuns(): Promise<Run[]> {
  const token = await getAccessToken()
  const activities = await fetchActivities(token)

  return activities
    .filter((a: Record<string, unknown>) =>
      ['Run', 'TrailRun', 'VirtualRun', 'Treadmill'].includes(a.sport_type as string)
    )
    .map(mapActivity)
}
