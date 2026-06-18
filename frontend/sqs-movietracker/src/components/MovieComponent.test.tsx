import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MovieComponent, MovieComponentSkeleton } from "./MovieComponent";

const movie = {
    id: "11",
    title: "Moon",
    description: "A lone worker nears the end of his lunar shift.",
    year: 2009,
    poster: "/moon.jpg",
    backdrop: "/moon-backdrop.jpg",
    tmdbRating: 7.8,
};

describe("MovieComponent", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders movie details and children", () => {
        render(<MovieComponent movie={movie}>Saved</MovieComponent>);

        expect(screen.getByRole("heading", { name: "Moon" })).toBeTruthy();
        expect(screen.getByText(movie.description)).toBeTruthy();
        expect(screen.getByRole("img", { name: "Moon" })).toHaveProperty("src", "http://localhost:3000/moon.jpg");
        expect(screen.getByText("Saved")).toBeTruthy();
    });

    it("calls onClick for pointer and keyboard activation", () => {
        const onClick = vi.fn();
        render(<MovieComponent movie={movie} onClick={onClick} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);
        fireEvent.keyDown(button, { key: "Enter" });
        fireEvent.keyDown(button, { key: " " });
        fireEvent.keyDown(button, { key: "Escape" });

        expect(onClick).toHaveBeenCalledTimes(3);
    });

    it("renders the skeleton placeholder", () => {
        const { container } = render(<MovieComponentSkeleton />);

        expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(4);
    });
});
