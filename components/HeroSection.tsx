'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { formatNumber } from '@/lib/utils'

interface HeroSectionProps {
  totalKmThisYear: number
  totalRunsThisYear: number
  longestRunKm: number
}

export default function HeroSection({ totalKmThisYear, totalRunsThisYear, longestRunKm }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Only the headline fades/scales — stats are kept outside so they don't vanish
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, prefersReducedMotion ? 1 : 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, prefersReducedMotion ? 1 : 0])

  return (
    <section
      ref={ref}
      className="min-h-[100svh] flex flex-col justify-between border-b-2 border-[#3F3F46] relative overflow-hidden"
    >
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 pt-12 pb-8 md:pt-20 md:pb-12 w-full flex flex-col justify-between flex-1">

        {/* Headline — fades on scroll */}
        <motion.h1
          style={{ scale, opacity }}
          className="font-bold uppercase leading-none tracking-tighter"
          aria-label="Your Runs"
        >
          <div
            className="leading-none text-[clamp(3rem,13vw,18rem)]"
            style={{ color: '#FAFAFA' }}
          >
            YOUR
          </div>
          <div className="leading-none flex items-end gap-2 text-[clamp(3rem,13vw,18rem)]">
            <span style={{ color: '#FAFAFA' }}>RUNS</span>
            <span style={{ color: '#DFE104' }}>.</span>
            <motion.span
              className="inline-block w-[3px] bg-[#DFE104] self-stretch mb-2"
              style={{ height: '0.85em' }}
              animate={prefersReducedMotion ? {} : { opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
              aria-hidden="true"
            />
          </div>
        </motion.h1>

        {/* Stats — outside the fade so they're always visible in the viewport */}
        <div className="flex flex-wrap gap-6 md:gap-16 border-t-2 border-[#3F3F46] pt-6 md:pt-10 mt-6 md:mt-0">
          <StatBlock label="KM THIS YEAR"   value={formatNumber(Math.round(totalKmThisYear))} />
          <StatBlock label="RUNS THIS YEAR" value={String(totalRunsThisYear)} />
          <StatBlock label="LONGEST RUN"    value={`${longestRunKm.toFixed(1)}K`} />
        </div>

      </div>
    </section>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#A1A1AA] uppercase text-xs tracking-widest mb-1">{label}</div>
      <div className="text-[clamp(1.75rem,4vw,4rem)] font-bold tracking-tighter leading-none text-[#FAFAFA]">
        {value}
      </div>
    </div>
  )
}
