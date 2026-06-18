import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "#/features/auth/auth.context.tsx";
import {
    addToWatchlist,
    isInWatchlist,
    removeFromWatchlist,
} from "#/features/watchlist/watchlist.queries.ts";
import { toast } from "sonner";
import { WatchlistButton } from "./WatchlistButton";

vi.mock("#/features/auth/auth.context.tsx", () => ({
    useAuth: vi.fn(),
}));

vi.mock("#/features/watchlist/watchlist.queries.ts", () => ({
    addToWatchlist: vi.fn(),
    isInWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

const user = { id: 1, username: "movieFan", email: "fan@example.com" };

function renderWithClient(ui: React.ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>,
    );
}

describe("WatchlistButton", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("is disabled and does not check the watchlist without a user", () => {
        vi.mocked(useAuth).mockReturnValue({ user: null, login: vi.fn(), logout: vi.fn() });

        renderWithClient(<WatchlistButton movieId={7} movieTitle="Moon" />);

        expect(screen.getByRole<HTMLButtonElement>("button", { name: "Add to Watchlist" }).disabled).toBe(true);
        expect(isInWatchlist).not.toHaveBeenCalled();
    });

    it("adds an unwatched movie to the watchlist", async () => {
        vi.mocked(useAuth).mockReturnValue({ user, login: vi.fn(), logout: vi.fn() });
        vi.mocked(isInWatchlist).mockResolvedValue(false);
        vi.mocked(addToWatchlist).mockResolvedValue({
            id: 1,
            added_at: "2026-06-18",
            movie: {
                id: "7",
                title: "Moon",
                description: "A lunar story.",
                year: 2009,
                poster: "/moon.jpg",
                backdrop: "/moon-backdrop.jpg",
                tmdbRating: 8,
            },
        });

        renderWithClient(<WatchlistButton movieId={7} movieTitle="Moon" />);

        const button = await screen.findByRole("button", { name: "Add to Watchlist" });
        fireEvent.click(button);

        await waitFor(() => expect(addToWatchlist).toHaveBeenCalledWith(7));
        expect(toast.success).toHaveBeenCalledWith("Moon added to your Watchlist!");
    });

    it("removes a watched movie from the watchlist", async () => {
        vi.mocked(useAuth).mockReturnValue({ user, login: vi.fn(), logout: vi.fn() });
        vi.mocked(isInWatchlist).mockResolvedValue(true);
        vi.mocked(removeFromWatchlist).mockResolvedValue(undefined);

        renderWithClient(<WatchlistButton movieId={7} movieTitle="Moon" />);

        const button = await screen.findByRole("button", { name: "Watched" });
        fireEvent.click(button);

        await waitFor(() => expect(removeFromWatchlist).toHaveBeenCalledWith(7));
        expect(toast.success).toHaveBeenCalledWith("Moon removed from your Watchlist");
    });
});
