'use client'

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
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
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
  const yearRuns = runs.filter(r => new Date(r.date).getFullYear() === year)

  const stats: StatBlockProps[] = [
    {
      value: `${formatNumber(Math.round(getTotalKm(yearRuns)))}`,
      label: 'TOTAL KILOMETRES',
      description: `Every km logged in ${year}, from easy recovery jogs to long Sunday efforts.`,
      index: 0,
    },
    {
      value: String(getTotalRunsThisYear(yearRuns, year)),
      label: 'TOTAL RUNS',
      description: `Days you laced up and got out the door in ${year}.`,
      index: 1,
    },
    {
      value: `${formatNumber(getTotalElevation(yearRuns))}m`,
      label: 'TOTAL ELEVATION',
      description: 'Cumulative metres climbed across all outdoor runs this year.',
      index: 2,
    },
    {
      value: `${getAvgPace(yearRuns)}/km`,
      label: 'AVERAGE PACE',
      description: 'Your mean pace across all run types and distances.',
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
        <h2
          id="yir-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none border-b-2 border-[#3F3F46] pb-8 mb-0"
        >
          YEAR IN REVIEW
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#3F3F46]">
          {stats.map((s) => (
            <StatBlock key={s.label} {...s} />
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
