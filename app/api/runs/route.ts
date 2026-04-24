import { NextResponse } from 'next/server'
import { fetchRuns } from '@/lib/fetchRuns'

export async function GET() {
  try {
    const runs = await fetchRuns()
    return NextResponse.json(runs)
  } catch (err) {
    console.error('Strava fetch failed:', err)
    return NextResponse.json({ error: 'Failed to fetch runs' }, { status: 500 })
  }
}
