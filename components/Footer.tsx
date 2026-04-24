import type { Run } from '@/lib/types'
import { getTotalKm, getAvgPace, formatNumber } from '@/lib/utils'

interface FooterProps {
  runs: Run[]
}

export default function Footer({ runs }: FooterProps) {
  const totalKm = getTotalKm(runs)
  const totalRuns = runs.length
  const avgPace = getAvgPace(runs)

  return (
    <footer className="bg-[#DFE104] border-t-4 border-black py-16 px-8" aria-label="Site footer">
      <div className="max-w-[95vw] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
        {/* Brand */}
        <div>
          <p
            className="font-bold uppercase tracking-tighter leading-none text-black"
            style={{ fontSize: 'clamp(2rem,6vw,5rem)' }}
          >
            STRAVA<br />DASH.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4">
          <FooterStat label="TOTAL KM" value={`${formatNumber(Math.round(totalKm))} km`} />
          <FooterStat label="TOTAL RUNS" value={String(totalRuns)} />
          <FooterStat label="AVG PACE" value={`${avgPace}/km`} />
        </div>

        {/* Credits */}
        <div className="flex flex-col gap-2 text-black opacity-60">
          <p className="uppercase tracking-wide text-sm font-bold">POWERED BY MOCK DATA</p>
          <p className="uppercase tracking-wide text-sm font-bold">BUILT WITH NEXT.JS</p>
          <p className="uppercase tracking-wide text-sm font-bold">DEPLOYED ON VERCEL</p>
        </div>
      </div>
    </footer>
  )
}

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-black opacity-60 uppercase text-xs tracking-widest font-bold">{label}</p>
      <p className="text-black font-bold text-2xl tracking-tighter">{value}</p>
    </div>
  )
}
