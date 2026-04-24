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

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, prefersReducedMotion ? 1 : 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, prefersReducedMotion ? 1 : 0])

  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center border-b-2 border-[#3F3F46] relative overflow-hidden">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-20 w-full">
        <motion.div style={{ scale, opacity }}>
          {/* Main headline */}
          <h1 className="font-bold uppercase leading-none tracking-tighter" aria-label="Your Runs">
            <div
              className="text-[clamp(4rem,15vw,18rem)] leading-none"
              style={{ color: '#FAFAFA' }}
            >
              YOUR
            </div>
            <div className="text-[clamp(4rem,15vw,18rem)] leading-none flex items-end gap-2">
              <span style={{ color: '#FAFAFA' }}>RUNS</span>
              <span style={{ color: '#DFE104' }}>.</span>
              {/* Blinking cursor */}
              <motion.span
                className="inline-block w-[3px] bg-[#DFE104] self-stretch mb-2"
                style={{ height: '0.85em' }}
                animate={prefersReducedMotion ? {} : { opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
                aria-hidden="true"
              />
            </div>
          </h1>

          {/* Inline stats */}
          <div className="mt-16 flex flex-wrap gap-12 md:gap-20 border-t-2 border-[#3F3F46] pt-10">
            <StatBlock label="KM THIS YEAR" value={formatNumber(Math.round(totalKmThisYear))} />
            <StatBlock label="RUNS THIS YEAR" value={String(totalRunsThisYear)} />
            <StatBlock label="LONGEST RUN" value={`${longestRunKm.toFixed(1)}K`} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#A1A1AA] uppercase text-xs tracking-widest mb-1">{label}</div>
      <div className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-tighter leading-none text-[#FAFAFA]">
        {value}
      </div>
    </div>
  )
}
