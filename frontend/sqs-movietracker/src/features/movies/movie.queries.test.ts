import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchMovie, searchMovies } from "./movie.queries";

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
}

describe("movie queries", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("fetches a movie by id", async () => {
        const movie = {
            id: "42",
            title: "The Hitchhiker",
            description: "Mostly harmless.",
            year: 1979,
            poster: "/poster.jpg",
            backdrop: "/backdrop.jpg",
            tmdbRating: 8,
        };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(movie));
        vi.stubGlobal("fetch", fetchMock);

        await expect(fetchMovie("42")).resolves.toEqual(movie);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/movies/42");
    });

    it("throws when fetching a movie fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

        await expect(fetchMovie("missing")).rejects.toThrow("Failed to fetch movie");
    });

    it("searches movies with page and year parameters", async () => {
        const result = { page: 2, pages: 5, total_results: 50, results: [] };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(result));
        vi.stubGlobal("fetch", fetchMock);

        await expect(searchMovies("Blade Runner", 2, 1982)).resolves.toEqual(result);
        expect(fetchMock).toHaveBeenCalledWith(
            "/api/v1/movies/search?query=Blade+Runner&page=2&year=1982",
        );
    });
});
