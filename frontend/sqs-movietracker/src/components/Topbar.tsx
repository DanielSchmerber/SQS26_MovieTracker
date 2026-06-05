import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Monitor, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "#/features/auth/auth.context.tsx";

type Theme = "light" | "dark" | "system";

export function TopNav() {
  const [theme, setTheme] = useState<Theme>("system");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode: Theme) => {
      root.classList.remove("light", "dark");

      if (mode === "system") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.add(isDark ? "dark" : "light");
      } else {
        root.classList.add(mode);
      }
    };

    applyTheme(theme);
  }, [theme]);

  async function handleLogout() {
    await logout();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-10">
          <div className="text-lg font-black tracking-tight">
            MovieTracker
          </div>

          <nav className="hidden items-center gap-6 md:flex ">
            <Link
              to="/"
              className="text-sm text-neutral-500 transition hover:text-black dark:hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/search"
              className="text-sm text-neutral-500 transition hover:text-black dark:hover:text-white"
            >
              Search
            </Link>

            <Link
              to="/watchlist"
              className="text-sm text-neutral-500 transition hover:text-black dark:hover:text-white"
            >
              Watchlist
            </Link>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme */}
          <div className="flex items-center rounded-xl border border-black/10 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.03]">
            <ThemeButton
              active={theme === "light"}
              onClick={() => setTheme("light")}
              icon={<Sun size={16} />}
            />

            <ThemeButton
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
              icon={<Moon size={16} />}
            />

            <ThemeButton
              active={theme === "system"}
              onClick={() => setTheme("system")}
              icon={<Monitor size={16} />}
            />
          </div>

          {/* User */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                <User size={16} className="text-neutral-400" />
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="rounded-xl border border-black/10 bg-black/[0.03] p-2 transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-black/10 bg-black/[0.03] p-2 transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <User size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function ThemeButton({
  active,
  onClick,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-2 transition ${
        active
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-neutral-500 hover:text-black dark:hover:text-white"
      }`}
    >
      {icon}
    </button>
  );
}
