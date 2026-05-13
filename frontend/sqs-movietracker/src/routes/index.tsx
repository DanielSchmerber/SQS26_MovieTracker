import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    navigate({ to: '/search', search: { title: query.trim() } })
  }

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

      <form onSubmit={handleSearch} className="mt-10 w-full max-w-xl">
        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-5 py-4 shadow-lg backdrop-blur-md transition focus-within:border-black/20 focus-within:shadow-xl dark:border-white/10 dark:bg-black/40 dark:focus-within:border-white/20">
          <Search size={20} className="shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for a movie…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {query.trim() && (
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-foreground px-4 py-1.5 text-sm font-semibold text-background transition hover:opacity-80"
            >
              Search
            </button>
          )}
        </div>
      </form>

      <style>{`
        @keyframes hero-shimmer {
          0%   { filter: brightness(1) hue-rotate(0deg); }
          100% { filter: brightness(1.15) hue-rotate(18deg); }
        }
      `}</style>
    </div>
  )
}
