import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import * as React from 'react'

interface SearchBarProps {
  initialQuery?: string
  autoFocus?: boolean
}

export function SearchBar({ initialQuery = '', autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const navigate = useNavigate()

  function handleSearch(e: React.SubmitEvent) {
    e.preventDefault()
    if (!query.trim()) return
    navigate({ to: '/search', search: { title: query.trim() } })
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-5 py-4 shadow-lg backdrop-blur-md transition focus-within:border-black/20 focus-within:shadow-xl dark:border-white/10 dark:bg-black/40 dark:focus-within:border-white/20">
        <Search size={20} className="shrink-0 text-muted-foreground" />
        <input
          autoFocus={autoFocus}
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
  )
}
