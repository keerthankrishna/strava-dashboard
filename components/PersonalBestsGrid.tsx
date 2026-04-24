'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { PersonalBest } from '@/lib/types'

interface PersonalBestsGridProps {
  pbs: PersonalBest[]
}

export default function PersonalBestsGrid({ pbs }: PersonalBestsGridProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="border-b-2 border-[#3F3F46]" aria-labelledby="pb-heading">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="mb-2">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">TRAINING DATA</p>
        </div>
        <h2
          id="pb-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none border-b-2 border-[#3F3F46] pb-8 mb-0"
        >
          PERSONAL BESTS
        </h2>

        {/* gap-px creates hairline dividers via background color showing through */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[#3F3F46]">
          {pbs.map((pb, i) => (
            <motion.div
              key={pb.distance}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group bg-[#09090B] p-8 cursor-default transition-colors duration-300 hover:bg-[#DFE104] border-0"
            >
              {/* Distance label */}
              <p className="text-[#A1A1AA] uppercase text-xl font-bold tracking-tight mb-4 group-hover:text-black transition-colors duration-300">
                {pb.distance}
              </p>

              {/* Time */}
              <div
                className="font-bold tracking-tighter leading-none text-[#FAFAFA] group-hover:text-black transition-colors duration-300 mb-3"
                style={{ fontSize: 'clamp(2rem,4vw,5rem)' }}
                aria-label={pb.run ? `Personal best ${pb.distance}: ${pb.formattedTime}` : `No ${pb.distance} personal best`}
              >
                {pb.formattedTime}
              </div>

              {/* Pace */}
              <p className="text-[#A1A1AA] text-sm font-bold uppercase tracking-tight mb-6 group-hover:text-black transition-colors duration-300">
                {pb.pace}
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-auto">
                {pb.run ? (
                  <>
                    <span className="text-[#A1A1AA] text-xs uppercase tracking-wider group-hover:text-black transition-colors duration-300">
                      {new Date(pb.run.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </span>
                    <span className="bg-[#DFE104] text-black text-xs font-bold uppercase px-2 py-1 group-hover:bg-black group-hover:text-[#DFE104] transition-colors duration-300">
                      PB
                    </span>
                  </>
                ) : (
                  <span className="text-[#3F3F46] text-xs uppercase tracking-wider group-hover:text-black transition-colors duration-300">
                    NO DATA YET
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
