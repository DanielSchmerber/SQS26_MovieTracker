import { createFileRoute } from '@tanstack/react-router'
import { SearchBar } from '#/components/SearchBar.tsx'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">

      <h1
        className="text-6xl font-black tracking-tight md:text-8xl"
        style={{
          background: 'linear-gradient(135deg, var(--lagoon-deep) 0%, var(--lagoon) 40%, var(--palm) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'hero-shimmer 6s ease-in-out infinite alternate',
        }}
      >
        MovieTracker
      </h1>

      <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
        Discover, track, and review every film you've ever loved.
      </p>

      <div className="mt-10 w-full max-w-xl">
        <SearchBar autoFocus />
      </div>

      <style>{`
        @keyframes hero-shimmer {
          0%   { filter: brightness(1) hue-rotate(0deg); }
          100% { filter: brightness(1.15) hue-rotate(18deg); }
        }
      `}</style>
    </div>
  )
}
