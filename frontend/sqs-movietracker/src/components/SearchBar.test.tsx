import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SearchBar } from "./SearchBar";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
    useNavigate: () => navigate,
}));

describe("SearchBar", () => {
    afterEach(() => {
        cleanup();
        navigate.mockClear();
    });

    it("shows the submit button only when the query has content", () => {
        render(<SearchBar />);

        expect(screen.queryByRole("button", { name: "Search" })).toBeNull();

        fireEvent.change(screen.getByPlaceholderText("Search for a movie…"), {
            target: { value: "Alien" },
        });

        expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
    });

    it("navigates to search with a trimmed query", () => {
        render(<SearchBar initialQuery="  Arrival  " />);

        fireEvent.submit(screen.getByRole("button", { name: "Search" }));

        expect(navigate).toHaveBeenCalledWith({
            to: "/search",
            search: { title: "Arrival" },
        });
    });

    it("does not navigate for blank queries", () => {
        const { container } = render(<SearchBar initialQuery="   " />);

        fireEvent.submit(container.querySelector("form")!);

        expect(navigate).not.toHaveBeenCalled();
    });
});
