// components/bottom-nav.tsx

import { Link } from "@tanstack/react-router";
import { GitBranch  } from 'lucide-react'

export function BottomNav() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-6 py-5 text-xs text-neutral-500 md:max-w-7xl md:flex-row">
        <a
          href="https://github.com/DanielSchmerber/SQS26_MovieTracker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition hover:text-black dark:hover:text-white"
        >
          <GitBranch size={16} />
          Repository
        </a>

        <div>© 2026 Movietracker</div>

        <div className="flex items-center gap-4">

          <Link
            to="/apidoc"
            className="transition hover:text-black dark:hover:text-white"
          >
            API
          </Link>
        </div>
      </div>
    </footer>
  );
}