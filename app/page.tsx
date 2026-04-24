// Remove 'use client' from the top — this becomes a server component

import DashboardClient from '@/components/DashboardClient'
import type { Run } from '@/lib/types'

export default async function DashboardPage() {
  let runs: Run[] = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/runs`, {
      next: { revalidate: 3600 } // re-fetch from Strava at most once per hour
    })
    runs = await res.json()
  } catch {
    console.error('Could not load runs')
  }

  return <DashboardClient runs={runs} />
}
