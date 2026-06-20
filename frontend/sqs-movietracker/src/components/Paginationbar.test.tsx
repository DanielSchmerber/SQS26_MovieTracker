import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PaginationBar } from "./Paginationbar";

describe("PaginationBar", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders nothing when there is only one page", () => {
        const { container } = render(
            <PaginationBar currentPage={1} totalPages={1} setPage={vi.fn()} />,
        );

        expect(container.firstChild).toBeNull();
    });

    it("renders a compact page range with ellipses", () => {
        render(<PaginationBar currentPage={5} totalPages={10} setPage={vi.fn()} />);

        expect(screen.getByRole("link", { name: "1" })).toBeTruthy();
        expect(screen.getByRole("link", { name: "4" })).toBeTruthy();
        expect(screen.getByRole("link", { name: "5" }).getAttribute("aria-current")).toBe("page");
        expect(screen.getByRole("link", { name: "6" })).toBeTruthy();
        expect(screen.getByRole("link", { name: "10" })).toBeTruthy();
        expect(screen.getAllByText("More pages")).toHaveLength(2);
    });

    it("moves to previous, next, and selected pages", () => {
        const setPage = vi.fn();
        render(<PaginationBar currentPage={3} totalPages={5} setPage={setPage} />);

        fireEvent.click(screen.getByLabelText("Go to previous page"));
        fireEvent.click(screen.getByLabelText("Go to next page"));
        fireEvent.click(screen.getByRole("link", { name: "5" }));

        expect(setPage).toHaveBeenNthCalledWith(1, 2);
        expect(setPage).toHaveBeenNthCalledWith(2, 4);
        expect(setPage).toHaveBeenNthCalledWith(3, 5);
    });

    it("disables previous and next at the range boundaries", () => {
        const setPage = vi.fn();
        const { rerender } = render(
            <PaginationBar currentPage={1} totalPages={3} setPage={setPage} />,
        );

        fireEvent.click(screen.getByLabelText("Go to previous page"));
        expect(setPage).not.toHaveBeenCalled();
        expect(screen.getByLabelText("Go to previous page").getAttribute("aria-disabled")).toBe("true");

        rerender(<PaginationBar currentPage={3} totalPages={3} setPage={setPage} />);
        fireEvent.click(screen.getByLabelText("Go to next page"));

        expect(setPage).not.toHaveBeenCalled();
        expect(screen.getByLabelText("Go to next page").getAttribute("aria-disabled")).toBe("true");
    });
});
