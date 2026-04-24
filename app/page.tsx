import DashboardClient from '@/components/DashboardClient'
import { fetchRuns } from '@/lib/fetchRuns'
import type { Run } from '@/lib/types'

export const revalidate = 3600 // re-fetch from Strava at most once per hour

export default async function DashboardPage() {
  let runs: Run[] = []

  try {
    runs = await fetchRuns()
  } catch {
    console.error('Could not load runs')
  }

  return <DashboardClient runs={runs} />
}
