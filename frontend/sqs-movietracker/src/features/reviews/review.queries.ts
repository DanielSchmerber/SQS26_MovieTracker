import type { ReviewEntry } from "#/features/reviews/review.model.ts";
import type { ReviewFormValues, ReviewUpdateFormValues } from "#/features/reviews/review.schema.ts";

export const fetchReviews = async (movieId: number): Promise<ReviewEntry[]> => {
    const response = await fetch(`/api/v1/reviews/${movieId}`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
};

export const fetchRating = async (movieId: number): Promise<number> => {
    const response = await fetch(`/api/v1/reviews/${movieId}/rating`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch rating");
    return response.json();
};

export const addReview = async (data: ReviewFormValues): Promise<ReviewEntry> => {
    const response = await fetch("/api/v1/reviews/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to add review: " + response.statusText);
    return response.json();
};

export const updateReview = async (reviewId: number, data: ReviewUpdateFormValues): Promise<ReviewEntry> => {
    const response = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update review");
    return response.json();
};

export const deleteReview = async (reviewId: number): Promise<void> => {
    const response = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete review");
};
