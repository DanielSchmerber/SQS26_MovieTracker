import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "#/features/auth/auth.context.tsx";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "#/features/watchlist/watchlist.queries.ts";
import { toast } from "sonner";

interface WatchlistButtonProps {
    movieId: number;
    movieTitle?: string;
}

function getWatchlistButtonClass(user: unknown, watched?: boolean): string {
    if (!user) {
        return "bg-muted text-muted-foreground cursor-not-allowed opacity-50";
    }

    if (watched) {
        return "bg-green-600 text-white hover:bg-green-700";
    }

    return "bg-foreground text-background hover:opacity-90";
}

export function WatchlistButton({ movieId, movieTitle }: Readonly<WatchlistButtonProps>) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: watched } = useQuery({
        queryKey: ["watchlist", movieId],
        queryFn: () => isInWatchlist(movieId),
        enabled: !!user,
    });

    const addMutation = useMutation({
        mutationFn: () => addToWatchlist(movieId),
        onSuccess: () => {
            queryClient.setQueryData(["watchlist", movieId], true);
            toast.success(`${movieTitle} added to your Watchlist!`);
        },
        onError: () => toast.error("Failed to add to watchlist"),
    });

    const removeMutation = useMutation({
        mutationFn: () => removeFromWatchlist(movieId),
        onSuccess: () => {
            queryClient.setQueryData(["watchlist", movieId], false);
            toast.success(`${movieTitle} removed from your Watchlist`);
        },
        onError: () => toast.error("Failed to remove from watchlist"),
    });

    const isPending = addMutation.isPending || removeMutation.isPending;

    const handleClick = () => {
        if (watched) {
            removeMutation.mutate();
        } else {
            addMutation.mutate();
        }
    };

    return (
        <button
            disabled={!user || isPending}
            onClick={handleClick}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition
                ${getWatchlistButtonClass(user, watched)}`}
        >
            {watched ? "Watched" : "Add to Watchlist"}
        </button>
    );
}
