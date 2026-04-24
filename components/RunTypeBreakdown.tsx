'use client'

import { motion } from 'framer-motion'
import type { Run } from '@/lib/types'

interface RunTypeBreakdownProps {
  runs: Run[]
}

interface TypeCardProps {
  label: string
  count: number
  totalKm: number
  percentage: number
  index: number
}

function TypeCard({ label, count, totalKm, percentage, index }: TypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group bg-[#09090B] p-8 transition-colors duration-300 hover:bg-[#DFE104] cursor-default"
    >
      <div
        className="font-bold tracking-tighter leading-none text-[#FAFAFA] group-hover:text-black transition-colors duration-300 mb-1"
        style={{ fontSize: 'clamp(3rem,8vw,8rem)' }}
        aria-hidden="true"
      >
        {percentage}%
      </div>
      <p className="text-[#A1A1AA] uppercase text-sm tracking-widest font-bold mb-4 group-hover:text-black transition-colors duration-300">
        OF ALL RUNS
      </p>
      <p className="text-[#FAFAFA] uppercase font-bold text-2xl tracking-tighter mb-1 group-hover:text-black transition-colors duration-300">
        {label}
      </p>
      <p className="text-[#A1A1AA] text-sm uppercase font-bold group-hover:text-black transition-colors duration-300 mb-4">
        {count} RUNS · {totalKm.toFixed(0)} KM
      </p>
      {/* Proportion bar */}
      <div className="h-1 bg-[#3F3F46] group-hover:bg-black transition-colors duration-300">
        <div
          className="h-full bg-[#DFE104] group-hover:bg-black transition-colors duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${percentage}%`}
        />
      </div>
    </motion.div>
  )
}

export default function RunTypeBreakdown({ runs }: RunTypeBreakdownProps) {
  const total = runs.length

  const types: { key: Run['type']; label: string }[] = [
    { key: 'outdoor', label: 'OUTDOOR' },
    { key: 'indoor', label: 'INDOOR' },
    { key: 'virtual', label: 'VIRTUAL' },
  ]

  const stats = types.map(({ key, label }) => {
    const filtered = runs.filter(r => r.type === key)
    const km = filtered.reduce((s, r) => s + r.distanceKm, 0)
    const pct = total > 0 ? Math.round((filtered.length / total) * 100) : 0
    return { label, count: filtered.length, totalKm: km, percentage: pct }
  })

  return (
    <section className="border-b-2 border-[#3F3F46]" aria-labelledby="type-heading">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="mb-2">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">ACTIVITY TYPES</p>
        </div>
        <h2
          id="type-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none border-b-2 border-[#3F3F46] pb-8 mb-0"
        >
          BREAKDOWN
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#3F3F46]">
          {stats.map((s, i) => (
            <TypeCard key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
