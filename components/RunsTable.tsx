'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { Run } from '@/lib/types'
import { formatDuration, formatPace } from '@/lib/utils'

interface RunsTableProps {
  runs: Run[]
}

type SortKey = 'date' | 'distanceKm' | 'durationSeconds' | 'pacePerKm' | 'elevationGainM' | 'heartRateAvg' | 'kudos'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 20

function TypeBadge({ type }: { type: Run['type'] }) {
  const styles = {
    outdoor: 'border-green-500 text-green-400',
    indoor: 'border-blue-500 text-blue-400',
    virtual: 'border-purple-500 text-purple-400',
  }
  return (
    <span className={`border-2 ${styles[type]} uppercase text-xs px-2 py-1 font-bold`}>
      {type}
    </span>
  )
}

export default function RunsTable({ runs }: RunsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(0)
  }

  const sorted = [...runs].sort((a, b) => {
    let va: number | string = a[sortKey]
    let vb: number | string = b[sortKey]
    if (sortKey === 'date') {
      va = new Date(a.date).getTime()
      vb = new Date(b.date).getTime()
    }
    if (va < vb) return sortDir === 'asc' ? -1 : 1
    if (va > vb) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown size={12} className="opacity-30" />
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
  }

  function ThBtn({ col, label }: { col: SortKey; label: string }) {
    return (
      <th scope="col" className="px-4 py-3 text-left">
        <button
          onClick={() => handleSort(col)}
          className="flex items-center gap-1 text-[#A1A1AA] uppercase text-xs tracking-widest font-bold hover:text-[#FAFAFA] transition-colors focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:outline-none"
        >
          {label}
          <SortIcon col={col} />
        </button>
      </th>
    )
  }

  return (
    <section className="border-b-2 border-[#3F3F46]" aria-labelledby="runs-heading">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="mb-2">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">ACTIVITY LOG</p>
        </div>
        <h2
          id="runs-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none border-b-2 border-[#3F3F46] pb-8 mb-0"
        >
          ALL RUNS
        </h2>

        {runs.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-[#3F3F46] text-5xl font-bold uppercase tracking-tighter">NO RUNS FOUND</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full" aria-labelledby="runs-heading">
                <caption className="sr-only">List of all runs sorted by {sortKey} {sortDir}ending</caption>
                <thead>
                  <tr className="border-b-2 border-[#3F3F46]">
                    <ThBtn col="date" label="Date" />
                    <th scope="col" className="px-4 py-3 text-left text-[#A1A1AA] uppercase text-xs tracking-widest font-bold">Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-[#A1A1AA] uppercase text-xs tracking-widest font-bold">Type</th>
                    <ThBtn col="distanceKm" label="Dist" />
                    <ThBtn col="durationSeconds" label="Time" />
                    <ThBtn col="pacePerKm" label="Pace" />
                    <ThBtn col="elevationGainM" label="Elev" />
                    <ThBtn col="heartRateAvg" label="HR" />
                    <ThBtn col="kudos" label="Kudos" />
                  </tr>
                </thead>
                <AnimatePresence mode="wait">
                  <motion.tbody
                    key={`${sortKey}-${sortDir}-${page}`}
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {paginated.map(run => (
                      <tr
                        key={run.id}
                        className="border-b border-[#3F3F46] hover:bg-[#27272A] cursor-pointer h-16 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-[#A1A1AA] text-sm font-mono">
                          {new Date(run.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-[#FAFAFA] text-sm font-bold max-w-[200px] truncate">
                          {run.personalBest && (
                            <span className="text-[#DFE104] mr-1" aria-label="Personal best">★</span>
                          )}
                          {run.name}
                        </td>
                        <td className="px-4 py-3"><TypeBadge type={run.type} /></td>
                        <td className="px-4 py-3 text-[#FAFAFA] font-bold">{run.distanceKm.toFixed(1)} km</td>
                        <td className="px-4 py-3 text-[#FAFAFA]">{formatDuration(run.durationSeconds)}</td>
                        <td className="px-4 py-3 text-[#FAFAFA]">{formatPace(run.pacePerKm)}/km</td>
                        <td className="px-4 py-3 text-[#A1A1AA]">{run.elevationGainM}m</td>
                        <td className="px-4 py-3 text-[#A1A1AA]">{run.heartRateAvg} bpm</td>
                        <td className="px-4 py-3 text-[#A1A1AA]">{run.kudos}</td>
                      </tr>
                    ))}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="md:hidden flex flex-col gap-px bg-[#3F3F46] mt-0">
              {paginated.map(run => (
                <div key={run.id} className="bg-[#09090B] p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[#FAFAFA] font-bold text-base">
                        {run.personalBest && <span className="text-[#DFE104] mr-1">★</span>}
                        {run.name}
                      </p>
                      <p className="text-[#A1A1AA] text-xs mt-1">
                        {new Date(run.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </p>
                    </div>
                    <TypeBadge type={run.type} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">Dist</p>
                      <p className="text-[#FAFAFA] font-bold">{run.distanceKm.toFixed(1)}km</p>
                    </div>
                    <div>
                      <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">Time</p>
                      <p className="text-[#FAFAFA] font-bold">{formatDuration(run.durationSeconds)}</p>
                    </div>
                    <div>
                      <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">Pace</p>
                      <p className="text-[#FAFAFA] font-bold">{formatPace(run.pacePerKm)}/km</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="border-2 border-[#3F3F46] text-[#FAFAFA] uppercase font-bold text-sm px-6 h-12 hover:bg-[#FAFAFA] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:outline-none"
                >
                  PREV
                </button>
                <span className="text-[#A1A1AA] uppercase text-sm font-bold tracking-wider">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="border-2 border-[#3F3F46] text-[#FAFAFA] uppercase font-bold text-sm px-6 h-12 hover:bg-[#FAFAFA] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:outline-none"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
