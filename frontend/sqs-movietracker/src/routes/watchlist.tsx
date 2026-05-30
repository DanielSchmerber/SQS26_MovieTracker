import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "#/features/auth/auth.context.tsx";
import { fetchWatchlist, removeFromWatchlist } from "#/features/watchlist/watchlist.queries.ts";
import { MovieComponent, MovieComponentSkeleton } from "#/components/MovieComponent.tsx";
import { Button } from "#/components/ui/button.tsx";
import { toast } from "sonner";
import { useState } from 'react'
import { PaginationBar } from '#/components/Paginationbar.tsx'

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
});

function WatchlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ["watchlist", page],
    queryFn: () => fetchWatchlist(page),
    enabled: !!user,
    placeholderData: keepPreviousData,
  });

  const removeMutation = useMutation({
    mutationFn: (movieId: number) => removeFromWatchlist(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Removed from watchlist");
    },
    onError: () => toast.error("Failed to remove from watchlist"),
  });




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

      {isLoading && (
        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <MovieComponentSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && watchlist?.items.length === 0 && (
        <p className="mt-2 text-muted-foreground">No movies yet — go find something to watch!</p>
      )}

      {!isLoading && watchlist && watchlist.items.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {watchlist.items.map((entry) => (
            <MovieComponent
              key={entry.id}
              movie={entry.movie}
              onClick={() => navigate({ to: "/movie/$id", params: { id: entry.movie.id } , viewTransition: true})}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeMutation.mutate(parseInt(entry.movie.id));
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={32} />
              </button>
            </MovieComponent>
          ))}
        </div>
      )}

      <PaginationBar currentPage={page} totalPages={watchlist?.pages ?? 1} setPage={setPage} pageRange={3} />
    </div>
  );
}
