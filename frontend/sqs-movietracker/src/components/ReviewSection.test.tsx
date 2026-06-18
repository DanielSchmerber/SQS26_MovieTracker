import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "#/features/auth/auth.context.tsx";
import { addReview, fetchReviews } from "#/features/reviews/review.queries.ts";
import { toast } from "sonner";
import { ReviewSection } from "./ReviewSection";

vi.mock("#/features/auth/auth.context.tsx", () => ({
    useAuth: vi.fn(),
}));

vi.mock("#/features/reviews/review.queries.ts", () => ({
    addReview: vi.fn(),
    fetchReviews: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

const user = { id: 1, username: "movieFan", email: "fan@example.com" };
const authActions = { login: vi.fn(), logout: vi.fn() };

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

describe("ReviewSection", () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it("renders only reviews that have comments", async () => {
        vi.mocked(useAuth).mockReturnValue({ user: null, ...authActions });
        vi.mocked(fetchReviews).mockResolvedValue([
            { id: 1, user_id: 1, username: "Ada", movie_id: 5, rating: 9, comment: "Sharp and beautiful." },
            { id: 2, user_id: 2, username: "Ben", movie_id: 5, rating: 8, comment: null },
        ]);

        renderWithClient(<ReviewSection movieId={5} />);

        expect(await screen.findByText("Sharp and beautiful.")).toBeTruthy();
        expect(screen.getByText("Ada")).toBeTruthy();
        expect(screen.queryByText("Ben")).toBeNull();
        expect(screen.queryByRole("button", { name: "Write a review" })).toBeNull();
    });

    it("shows an empty state when there are no written comments", async () => {
        vi.mocked(useAuth).mockReturnValue({ user: null, ...authActions });
        vi.mocked(fetchReviews).mockResolvedValue([
            { id: 1, user_id: 1, username: "Ada", movie_id: 5, rating: 9, comment: null },
        ]);

        renderWithClient(<ReviewSection movieId={5} />);

        expect(await screen.findByText("No reviews yet.")).toBeTruthy();
    });

    it("submits a new review for authenticated users", async () => {
        vi.mocked(useAuth).mockReturnValue({ user, ...authActions });
        vi.mocked(fetchReviews).mockResolvedValue([]);
        vi.mocked(addReview).mockResolvedValue({
            id: 3,
            user_id: 1,
            username: "movieFan",
            movie_id: 5,
            rating: 8,
            comment: "Loved the pacing.",
        });

        renderWithClient(<ReviewSection movieId={5} />);

        expect(await screen.findByRole("button", { name: "Write a review" })).toBeTruthy();
        fireEvent.click(screen.getByRole("button", { name: "Write a review" }));
        fireEvent.click(screen.getByRole("button", { name: "8" }));
        fireEvent.change(screen.getByPlaceholderText("What did you think?"), {
            target: { value: "Loved the pacing." },
        });
        fireEvent.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() =>
            expect(addReview).toHaveBeenCalledWith({
                movie_id: 5,
                rating: 8,
                comment: "Loved the pacing.",
            }),
        );
        expect(toast.success).toHaveBeenCalledWith("Review added!");
    });
});
