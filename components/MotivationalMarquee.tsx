'use client'

import Marquee from 'react-fast-marquee'

const quotes = [
  { text: "The miracle isn't that I finished. The miracle is that I had the courage to start.", author: "JOHN BINGHAM" },
  { text: "Run when you can, walk if you have to, crawl if you must; just never give up.", author: "DEAN KARNAZES" },
  { text: "Pain is inevitable. Suffering is optional.", author: "HARUKI MURAKAMI" },
  { text: "Your body will argue that there is no justifiable reason to continue. Your only recourse is to call on your spirit.", author: "TIM NOAKES" },
  { text: "Ask yourself: 'Can I give more?' The answer is usually: 'Yes.'", author: "PAUL TERGAT" },
  { text: "Every morning in Africa, a gazelle wakes up. It knows it must outrun the fastest lion or it will be killed.", author: "AFRICAN PROVERB" },
]

export default function MotivationalMarquee() {
  return (
    <div
      className="border-t-2 border-b-2 border-[#3F3F46] bg-[#09090B]"
      aria-label="Motivational running quotes"
    >
      <Marquee speed={40} gradient={false} autoFill direction="left">
        <div className="flex items-stretch py-8">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="border-2 border-[#3F3F46] p-8 mx-4 flex-shrink-0"
              style={{ width: '400px' }}
            >
              <p className="text-[#A1A1AA] text-xl mb-4 leading-snug">&ldquo;{q.text}&rdquo;</p>
              <p className="text-[#DFE104] uppercase text-sm font-bold tracking-wider">— {q.author}</p>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  )
}
