// components/bottom-nav.tsx

import { Link } from "@tanstack/react-router";

export function BottomNav() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-6 py-5 text-xs text-neutral-500 md:max-w-7xl md:flex-row">
        <div className="font-semibold tracking-wide">
          PLACEHOLDER
        </div>

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