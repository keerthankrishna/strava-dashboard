'use client'

import Marquee from 'react-fast-marquee'

interface MarqueeItem {
  label: string
  value: string
}

interface StatsMarqueeProps {
  items: MarqueeItem[]
}

export default function StatsMarquee({ items }: StatsMarqueeProps) {
  return (
    <div className="bg-[#DFE104] border-b-2 border-[#3F3F46]" aria-label="Key running statistics">
      <Marquee speed={80} gradient={false} autoFill>
        <div className="flex items-center py-6">
          {items.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="text-black font-bold uppercase tracking-tighter text-2xl px-6">
                {item.value} {item.label}
              </span>
              <span className="text-black font-bold text-2xl px-2" aria-hidden="true">◆</span>
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  )
}
