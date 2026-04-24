'use client'

import type { Run } from '@/lib/types'
import { formatDuration, formatPace } from '@/lib/utils'

interface RecentRunCardProps {
  runs: Run[]
}

const typeColors: Record<Run['type'], string> = {
  outdoor: 'text-green-400 border-green-500',
  indoor: 'text-blue-400 border-blue-500',
  virtual: 'text-purple-400 border-purple-500',
}

function RunCard({ run }: { run: Run }) {
  return (
    <div className="group flex-shrink-0 w-72 border-2 border-[#3F3F46] p-8 transition-colors duration-300 hover:bg-[#DFE104] hover:border-[#DFE104] cursor-default bg-[#09090B]">
      {/* Type indicator */}
      <span className={`border-2 ${typeColors[run.type]} uppercase text-xs px-2 py-1 font-bold group-hover:border-black group-hover:text-black transition-colors duration-300`}>
        {run.type}
      </span>

      {/* Name */}
      <p className="text-[#FAFAFA] font-bold text-base mt-4 mb-1 truncate group-hover:text-black transition-colors duration-300">
        {run.personalBest && <span className="text-[#DFE104] mr-1 group-hover:text-black transition-colors duration-300">★</span>}
        {run.name}
      </p>

      {/* Date */}
      <p className="text-[#A1A1AA] text-xs uppercase tracking-widest mb-6 group-hover:text-black transition-colors duration-300">
        {new Date(run.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>

      {/* Stats */}
      <div className="flex gap-6">
        <div>
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest group-hover:text-black transition-colors duration-300">DIST</p>
          <p className="text-[#FAFAFA] font-bold text-xl tracking-tighter group-hover:text-black transition-colors duration-300">
            {run.distanceKm.toFixed(1)}<span className="text-sm ml-0.5">km</span>
          </p>
        </div>
        <div>
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest group-hover:text-black transition-colors duration-300">TIME</p>
          <p className="text-[#FAFAFA] font-bold text-xl tracking-tighter group-hover:text-black transition-colors duration-300">
            {formatDuration(run.durationSeconds)}
          </p>
        </div>
        <div>
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest group-hover:text-black transition-colors duration-300">PACE</p>
          <p className="text-[#FAFAFA] font-bold text-xl tracking-tighter group-hover:text-black transition-colors duration-300">
            {formatPace(run.pacePerKm)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RecentRunCard({ runs }: RecentRunCardProps) {
  const recent = runs.slice(0, 8)

  return (
    <section className="border-b-2 border-[#3F3F46]" aria-labelledby="recent-heading">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="mb-2">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">LATEST ACTIVITY</p>
        </div>
        <h2
          id="recent-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none border-b-2 border-[#3F3F46] pb-8 mb-8"
        >
          RECENT
        </h2>

        <div className="flex items-stretch overflow-x-auto gap-px bg-[#3F3F46] pb-0">
          {recent.map(run => (
            <RunCard key={run.id} run={run} />
          ))}
          {/* Decorative count */}
          <div className="flex-shrink-0 flex items-center justify-center w-48 bg-[#09090B] px-8">
            <span
              className="font-bold tracking-tighter text-[#27272A] leading-none"
              style={{ fontSize: '8rem' }}
              aria-hidden="true"
            >
              {String(recent.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
