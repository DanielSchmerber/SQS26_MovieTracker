import { afterEach, describe, expect, it, vi } from "vitest";

import {
    addReview,
    deleteReview,
    fetchRating,
    fetchReviews,
    updateReview,
} from "./review.queries";

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
}

describe("review queries", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("fetches reviews for a movie", async () => {
        const reviews = [{ id: 1, user_id: 2, username: "Ada", movie_id: 3, rating: 9, comment: "Great" }];
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(reviews));
        vi.stubGlobal("fetch", fetchMock);

        await expect(fetchReviews(3)).resolves.toEqual(reviews);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/reviews/3", {
            credentials: "include",
        });
    });

    it("fetches a movie rating", async () => {
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(8.5));
        vi.stubGlobal("fetch", fetchMock);

        await expect(fetchRating(3)).resolves.toBe(8.5);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/reviews/3/rating", {
            credentials: "include",
        });
    });

    it("adds a review with a JSON body", async () => {
        const review = { id: 1, user_id: 2, username: "Ada", movie_id: 3, rating: 9, comment: "Great" };
        const data = { movie_id: 3, rating: 9, comment: "Great" };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(review));
        vi.stubGlobal("fetch", fetchMock);

        await expect(addReview(data)).resolves.toEqual(review);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/reviews/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    });

    it("updates a review", async () => {
        const review = { id: 1, user_id: 2, username: "Ada", movie_id: 3, rating: 10, comment: "Perfect" };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(review));
        vi.stubGlobal("fetch", fetchMock);

        await expect(updateReview(1, { rating: 10 })).resolves.toEqual(review);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/reviews/1", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: 10 }),
        });
    });

    it("throws when deleting a review fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

        await expect(deleteReview(1)).rejects.toThrow("Failed to delete review");
    });
});
