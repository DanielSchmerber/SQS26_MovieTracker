import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ReviewCard, ReviewCardSkeleton } from "./ReviewCard";

describe("ReviewCard", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders reviewer initials, rating, and comment", () => {
        render(
            <ReviewCard
                review={{
                    id: 1,
                    user_id: 2,
                    username: "Ada",
                    movie_id: 3,
                    rating: 9,
                    comment: "Elegant and emotional.",
                }}
            />,
        );

        expect(screen.getByText("A")).toBeTruthy();
        expect(screen.getByText("Ada")).toBeTruthy();
        expect(screen.getByText("9/10")).toBeTruthy();
        expect(screen.getByText("Elegant and emotional.")).toBeTruthy();
    });

    it("renders skeleton placeholders", () => {
        const { container } = render(<ReviewCardSkeleton />);

        expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(5);
    });
});
