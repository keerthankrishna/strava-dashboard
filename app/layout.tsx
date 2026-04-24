import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RUN STATS — YOUR PERSONAL STRAVA DASHBOARD',
  description: 'Personal running stats dashboard powered by mock Strava data',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-black focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:text-sm"
        >
          Skip to main content
        </a>

        {/* Noise texture overlay */}
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
          aria-hidden="true"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {children}
      </body>
    </html>
  )
}
