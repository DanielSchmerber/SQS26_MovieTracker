import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "#/features/auth/auth.context.tsx";
import { Button } from "#/components/ui/button.tsx";

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
});

function WatchlistPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Your Watchlist</h1>
        <p className="text-muted-foreground">You need to be logged in to view your watchlist.</p>
        <Button asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-2xl font-bold">Your Watchlist</h1>
      <p className="mt-2 text-muted-foreground">No movies yet — go find something to watch!</p>
    </div>
  );
}
