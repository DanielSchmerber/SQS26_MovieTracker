import type { WatchlistEntry, WatchlistPage } from "#/features/watchlist/watchlist.model.ts";

export const fetchWatchlist = async (page = 1): Promise<WatchlistPage> => {
    const response = await fetch(`/api/v1/watchlist/?page=${page}`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch watchlist");
    return response.json();
};

export const addToWatchlist = async (movieId: number): Promise<WatchlistEntry> => {
    const response = await fetch("/api/v1/watchlist/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id: movieId }),
    });
    if (!response.ok) throw new Error("Failed to add to watchlist");
    return response.json();
};

export const isInWatchlist = async (movieId: number): Promise<boolean> => {
    const response = await fetch(`/api/v1/watchlist/${movieId}`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to check watchlist");
    return response.json();
};

export const removeFromWatchlist = async (movieId: number): Promise<void> => {
    const response = await fetch(`/api/v1/watchlist/${movieId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to remove from watchlist");
};
