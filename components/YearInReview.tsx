'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Run } from '@/lib/types'
import { getTotalKm, getTotalRunsThisYear, getTotalElevation, getAvgPace, formatNumber } from '@/lib/utils'

interface YearInReviewProps {
  runs: Run[]
  year: number
}

interface StatBlockProps {
  value: string
  label: string
  description: string
  index: number
}

function StatBlock({ value, label, description, index }: StatBlockProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      key={`${label}-${value}`}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="border-2 border-[#3F3F46] p-8 md:p-12"
    >
      <div
        className="font-bold tracking-tighter leading-none text-[#DFE104] mb-3"
        style={{ fontSize: 'clamp(3rem,8vw,8rem)' }}
        aria-hidden="true"
      >
        {value}
      </div>
      <p className="text-[#A1A1AA] uppercase tracking-wide text-sm font-bold mb-2">{label}</p>
      <p className="text-[#A1A1AA] text-base">{description}</p>
    </motion.div>
  )
}

export default function YearInReview({ runs, year }: YearInReviewProps) {
  const prefersReducedMotion = useReducedMotion()

  // Derive all years that have at least one run
  const availableYears = Array.from(
    new Set(runs.map(r => new Date(r.date).getFullYear()))
  ).sort((a, b) => b - a)

  const [selectedYear, setSelectedYear] = useState(year)

  const yearRuns = runs.filter(r => new Date(r.date).getFullYear() === selectedYear)

  const stats: StatBlockProps[] = [
    {
      value: `${formatNumber(Math.round(getTotalKm(yearRuns)))}`,
      label: 'TOTAL KILOMETRES',
      description: `Every km logged in ${selectedYear}, from easy recovery jogs to long Sunday efforts.`,
      index: 0,
    },
    {
      value: String(getTotalRunsThisYear(yearRuns, selectedYear)),
      label: 'TOTAL RUNS',
      description: `Days you laced up and got out the door in ${selectedYear}.`,
      index: 1,
    },
    {
      value: `${formatNumber(getTotalElevation(yearRuns))}m`,
      label: 'TOTAL ELEVATION',
      description: `Cumulative metres climbed across all outdoor runs in ${selectedYear}.`,
      index: 2,
    },
    {
      value: `${getAvgPace(yearRuns)}/km`,
      label: 'AVERAGE PACE',
      description: `Your mean pace across all run types and distances in ${selectedYear}.`,
      index: 3,
    },
  ]

  const repeatText = 'KEEP RUNNING ◆ KEEP RUNNING ◆ KEEP RUNNING ◆ KEEP RUNNING ◆ KEEP RUNNING ◆'

  return (
    <section className="border-b-2 border-[#3F3F46]" aria-labelledby="yir-heading">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="mb-2">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">ANNUAL SUMMARY</p>
        </div>

        {/* Heading row with year toggles */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#3F3F46] pb-8 mb-0">
          <h2
            id="yir-heading"
            className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none"
          >
            YEAR IN REVIEW
          </h2>

          <div className="flex flex-wrap gap-1" role="group" aria-label="Select year">
            {availableYears.map(y => (
              <button
                key={y}
                aria-pressed={y === selectedYear}
                onClick={() => setSelectedYear(y)}
                className={`h-10 px-4 font-bold text-xs uppercase tracking-tighter transition-colors duration-200
                  focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:outline-none min-w-[44px] min-h-[44px]
                  ${y === selectedYear
                    ? 'bg-[#DFE104] text-black border-2 border-[#DFE104]'
                    : 'bg-transparent text-[#FAFAFA] border-2 border-[#3F3F46] hover:border-[#FAFAFA]'
                  }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#3F3F46]">
          {stats.map((s) => (
            <StatBlock key={`${selectedYear}-${s.label}`} {...s} />
          ))}
        </div>

        {/* Scroll-triggered marquee text */}
        <div className="overflow-hidden mt-0 border-t-2 border-[#3F3F46] py-8">
          <motion.p
            initial={prefersReducedMotion ? {} : { x: 200, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-[#27272A] font-bold uppercase tracking-tighter whitespace-nowrap overflow-hidden"
            style={{ fontSize: 'clamp(1.5rem,4vw,3rem)' }}
            aria-hidden="true"
          >
            {repeatText}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
