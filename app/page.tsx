'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

import { mockRuns } from '@/lib/mockData'
import {
  getTotalKm,
  getTotalRunsThisYear,
  getPersonalBests,
  getMonthlyVolume,
  getAvgPace,
  getTotalElevation,
  getTotalCalories,
  getAvgHeartRate,
  formatNumber,
  formatPace,
} from '@/lib/utils'
import type { RunType, DistanceFilter } from '@/lib/types'

import HeroSection from '@/components/HeroSection'
import StatsMarquee from '@/components/StatsMarquee'
import FiltersBar from '@/components/FiltersBar'
import PersonalBestsGrid from '@/components/PersonalBestsGrid'
import RunsTable from '@/components/RunsTable'
import MonthlyVolumeChart from '@/components/MonthlyVolumeChart'
import RunTypeBreakdown from '@/components/RunTypeBreakdown'
import RecentRunCard from '@/components/RecentRunCard'
import YearInReview from '@/components/YearInReview'
import MotivationalMarquee from '@/components/MotivationalMarquee'
import Footer from '@/components/Footer'

const CURRENT_YEAR = new Date().getFullYear()

const DISTANCE_RANGES: Record<DistanceFilter, [number, number] | null> = {
  all: null,
  '5k': [4.5, 5.5],
  '10k': [9, 11],
  half: [19, 23],
  marathon: [40, 45],
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const [activeType, setActiveType] = useState<RunType | 'all'>('all')
  const [activeYear, setActiveYear] = useState<string>('all')
  const [activeDistance, setActiveDistance] = useState<DistanceFilter>('all')

  // All runs for hero / marquee / footer (unfiltered)
  const allRuns = mockRuns
  const thisYearRuns = allRuns.filter(r => new Date(r.date).getFullYear() === CURRENT_YEAR)
  const longestRun = allRuns.reduce((best, r) => r.distanceKm > best.distanceKm ? r : best, allRuns[0])

  // Filtered runs (for table & charts)
  const filteredRuns = useMemo(() => {
    let runs = allRuns

    if (activeType !== 'all') {
      runs = runs.filter(r => r.type === activeType)
    }

    if (activeYear !== 'all') {
      runs = runs.filter(r => new Date(r.date).getFullYear() === Number(activeYear))
    }

    const range = DISTANCE_RANGES[activeDistance]
    if (range) {
      runs = runs.filter(r => r.distanceKm >= range[0] && r.distanceKm <= range[1])
    }

    return runs
  }, [activeType, activeYear, activeDistance])

  // Global stats for marquee
  const pb5k = allRuns
    .filter(r => Math.abs(r.distanceKm - 5) / 5 <= 0.1)
    .reduce<typeof allRuns[0] | null>((b, r) => !b || r.pacePerKm < b.pacePerKm ? r : b, null)

  const pb10k = allRuns
    .filter(r => Math.abs(r.distanceKm - 10) / 10 <= 0.1)
    .reduce<typeof allRuns[0] | null>((b, r) => !b || r.pacePerKm < b.pacePerKm ? r : b, null)

  const formatRunTime = (run: typeof allRuns[0] | null) => {
    if (!run) return 'N/A'
    const h = Math.floor(run.durationSeconds / 3600)
    const m = Math.floor((run.durationSeconds % 3600) / 60)
    const s = Math.round(run.durationSeconds % 60)
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const marqueeItems = [
    { label: 'KM TOTAL', value: formatNumber(Math.round(getTotalKm(allRuns))) },
    { label: 'RUNS', value: String(allRuns.length) },
    { label: 'AVG PACE', value: `${getAvgPace(allRuns)}/KM` },
    { label: '5K BEST', value: pb5k ? formatRunTime(pb5k) : 'N/A' },
    { label: '10K BEST', value: pb10k ? formatRunTime(pb10k) : 'N/A' },
    { label: 'M ELEVATION', value: formatNumber(getTotalElevation(allRuns)) },
    { label: 'AVG HR', value: `${getAvgHeartRate(allRuns)} BPM` },
    { label: 'KCAL TOTAL', value: formatNumber(getTotalCalories(allRuns)) },
  ]

  const pbs = getPersonalBests(allRuns)
  const monthlyData = getMonthlyVolume(allRuns)

  return (
    <main id="main-content">
      {/* Hero */}
      <HeroSection
        totalKmThisYear={getTotalKm(thisYearRuns)}
        totalRunsThisYear={getTotalRunsThisYear(allRuns, CURRENT_YEAR)}
        longestRunKm={longestRun?.distanceKm ?? 0}
      />

      {/* Stats Marquee */}
      <StatsMarquee items={marqueeItems} />

      {/* Personal Bests */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <PersonalBestsGrid pbs={pbs} />
      </motion.div>

      {/* Recent Runs */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <RecentRunCard runs={allRuns} />
      </motion.div>

      {/* Run Type Breakdown */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <RunTypeBreakdown runs={allRuns} />
      </motion.div>

      {/* Monthly Volume Chart */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <MonthlyVolumeChart data={monthlyData} year={activeYear} />
      </motion.div>

      {/* Year in Review */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <YearInReview runs={allRuns} year={CURRENT_YEAR} />
      </motion.div>

      {/* Motivational Marquee */}
      <MotivationalMarquee />

      {/* Filters + Runs Table */}
      <FiltersBar
        activeType={activeType}
        activeYear={activeYear}
        activeDistance={activeDistance}
        filteredCount={filteredRuns.length}
        onTypeChange={setActiveType}
        onYearChange={setActiveYear}
        onDistanceChange={setActiveDistance}
      />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <RunsTable runs={filteredRuns} />
      </motion.div>

      {/* Footer */}
      <Footer runs={allRuns} />
    </main>
  )
}
