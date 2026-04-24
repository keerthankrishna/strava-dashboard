'use client'

import type { RunType, DistanceFilter } from '@/lib/types'

interface FiltersBarProps {
  activeType: RunType | 'all'
  activeYear: string
  activeDistance: DistanceFilter
  filteredCount: number
  onTypeChange: (type: RunType | 'all') => void
  onYearChange: (year: string) => void
  onDistanceChange: (dist: DistanceFilter) => void
}

const types: { label: string; value: RunType | 'all' }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'OUTDOOR', value: 'outdoor' },
  { label: 'INDOOR', value: 'indoor' },
  { label: 'VIRTUAL', value: 'virtual' },
]

const distances: { label: string; value: DistanceFilter }[] = [
  { label: 'ALL DIST', value: 'all' },
  { label: '5K', value: '5k' },
  { label: '10K', value: '10k' },
  { label: 'HALF', value: 'half' },
  { label: 'MARATHON', value: 'marathon' },
]

const currentYear = new Date().getFullYear()
const years = [
  { label: 'ALL YEARS', value: 'all' },
  { label: String(currentYear), value: String(currentYear) },
  { label: String(currentYear - 1), value: String(currentYear - 1) },
]

export default function FiltersBar({
  activeType,
  activeYear,
  activeDistance,
  filteredCount,
  onTypeChange,
  onYearChange,
  onDistanceChange,
}: FiltersBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-[#09090B] border-b-2 border-[#3F3F46]">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-3 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Type filters */}
          <div className="flex gap-1" role="group" aria-label="Filter by run type">
            {types.map(t => (
              <button
                key={t.value}
                aria-pressed={activeType === t.value}
                onClick={() => onTypeChange(t.value)}
                className={`h-10 px-4 font-bold text-xs uppercase tracking-tighter transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:outline-none min-w-[44px] min-h-[44px] ${
                  activeType === t.value
                    ? 'bg-[#DFE104] text-black border-2 border-[#DFE104]'
                    : 'bg-transparent text-[#FAFAFA] border-2 border-[#3F3F46] hover:border-[#FAFAFA]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Distance filters */}
          <div className="flex gap-1" role="group" aria-label="Filter by distance">
            {distances.map(d => (
              <button
                key={d.value}
                aria-pressed={activeDistance === d.value}
                onClick={() => onDistanceChange(d.value)}
                className={`h-10 px-4 font-bold text-xs uppercase tracking-tighter transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:outline-none min-w-[44px] min-h-[44px] ${
                  activeDistance === d.value
                    ? 'bg-[#DFE104] text-black border-2 border-[#DFE104]'
                    : 'bg-transparent text-[#FAFAFA] border-2 border-[#3F3F46] hover:border-[#FAFAFA]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Year filter */}
          <div className="flex gap-1" role="group" aria-label="Filter by year">
            {years.map(y => (
              <button
                key={y.value}
                aria-pressed={activeYear === y.value}
                onClick={() => onYearChange(y.value)}
                className={`h-10 px-4 font-bold text-xs uppercase tracking-tighter transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:outline-none min-w-[44px] min-h-[44px] ${
                  activeYear === y.value
                    ? 'bg-[#DFE104] text-black border-2 border-[#DFE104]'
                    : 'bg-transparent text-[#FAFAFA] border-2 border-[#3F3F46] hover:border-[#FAFAFA]'
                }`}
              >
                {y.label}
              </button>
            ))}
          </div>

          {/* Count */}
          <span className="text-[#A1A1AA] text-sm font-bold uppercase tracking-tighter whitespace-nowrap">
            — {filteredCount} RUNS
          </span>
        </div>
      </div>
    </div>
  )
}
