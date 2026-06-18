import { afterEach, describe, expect, it, vi } from "vitest";

import {
    addToWatchlist,
    fetchWatchlist,
    isInWatchlist,
    removeFromWatchlist,
} from "./watchlist.queries";

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
}

describe("watchlist queries", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("fetches a paginated watchlist with credentials", async () => {
        const page = { items: [], total: 0, page: 3, size: 10, pages: 0 };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(page));
        vi.stubGlobal("fetch", fetchMock);

        await expect(fetchWatchlist(3)).resolves.toEqual(page);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/watchlist/?page=3", {
            credentials: "include",
        });
    });

    it("adds a movie to the watchlist", async () => {
        const entry = { id: 1, added_at: "2026-06-18", movie: { id: "7" } };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(entry));
        vi.stubGlobal("fetch", fetchMock);

        await expect(addToWatchlist(7)).resolves.toEqual(entry);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/watchlist/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie_id: 7 }),
        });
    });

    it("checks whether a movie is in the watchlist", async () => {
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(true));
        vi.stubGlobal("fetch", fetchMock);

        await expect(isInWatchlist(9)).resolves.toBe(true);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/watchlist/9", {
            credentials: "include",
        });
    });

    it("throws when removing a movie fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

        await expect(removeFromWatchlist(9)).rejects.toThrow(
            "Failed to remove from watchlist",
        );
    });
});
