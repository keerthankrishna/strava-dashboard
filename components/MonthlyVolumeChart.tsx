'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line, ComposedChart
} from 'recharts'
import type { MonthlyVolume } from '@/lib/types'
import { formatPace } from '@/lib/utils'

interface MonthlyVolumeChartProps {
  data: MonthlyVolume[]
  year: string
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; name: string; dataKey: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const km = payload.find(p => p.dataKey === 'km')
  const count = payload.find(p => p.dataKey === 'count')
  const pace = payload.find(p => p.dataKey === 'avgPaceSeconds')

  return (
    <div className="bg-[#09090B] border-2 border-[#3F3F46] p-4 min-w-[140px]">
      <p className="text-[#FAFAFA] font-bold uppercase tracking-tighter text-sm mb-2">{label}</p>
      {km && <p className="text-[#DFE104] font-bold text-lg">{km.value.toFixed(1)} KM</p>}
      {count && <p className="text-[#A1A1AA] text-sm uppercase">{count.value} RUNS</p>}
      {pace && <p className="text-[#A1A1AA] text-sm uppercase">{formatPace(pace.value)}/KM AVG</p>}
    </div>
  )
}

export default function MonthlyVolumeChart({ data, year }: MonthlyVolumeChartProps) {
  const filtered = year === 'all' ? data : data.filter(d => String(d.year) === year)

  return (
    <section className="border-b-2 border-[#3F3F46]" aria-labelledby="volume-heading">
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="mb-2">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">MONTHLY BREAKDOWN</p>
        </div>
        <h2
          id="volume-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none border-b-2 border-[#3F3F46] pb-8 mb-12"
        >
          VOLUME
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={filtered} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#A1A1AA', fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v}
              />
              <YAxis
                yAxisId="km"
                tick={{ fill: '#A1A1AA', fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}km`}
              />
              <YAxis
                yAxisId="pace"
                orientation="right"
                tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'Space Grotesk' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => formatPace(v)}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="km"
                dataKey="km"
                fill="#DFE104"
                radius={[0, 0, 0, 0]}
                maxBarSize={60}
              />
              <Line
                yAxisId="pace"
                type="monotone"
                dataKey="avgPaceSeconds"
                stroke="#A1A1AA"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#A1A1AA' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  )
}
