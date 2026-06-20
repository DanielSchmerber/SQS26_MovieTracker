import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { searchMovies } from "#/features/movies/movie.queries.ts";
import { Route } from "#/routes/search.tsx";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
    createFileRoute: () => (config: unknown) => ({
        ...config,
        useSearch: vi.fn(),
    }),
    useNavigate: () => navigate,
}));

vi.mock("#/features/movies/movie.queries.ts", () => ({
    searchMovies: vi.fn(),
}));

const movie = {
    id: "42",
    title: "Inception",
    description: "A thief steals corporate secrets through dream-sharing technology.",
    year: 2010,
    poster: "/inception.jpg",
    backdrop: "/inception-backdrop.jpg",
    tmdbRating: 8.8,
};

function routeComponent(route: unknown) {
    return (route as { component: ComponentType }).component;
}

function renderWithClient(ui: React.ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return {
        queryClient,
        ...render(
            <QueryClientProvider client={queryClient}>
                {ui}
            </QueryClientProvider>,
        ),
    };
}

describe("search integration flow", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("loads search results and navigates to a selected movie", async () => {
        vi.mocked(searchMovies).mockResolvedValue({
            page: 1,
            pages: 1,
            total_results: 1,
            results: [movie],
        });
        vi.mocked(Route.useSearch).mockReturnValue({ title: "Inception" });
        const SearchPage = routeComponent(Route);

        const { queryClient } = renderWithClient(<SearchPage />);

        expect(await screen.findByRole("heading", { name: "Inception" })).toBeTruthy();
        expect(searchMovies).toHaveBeenCalledWith("Inception", 1);

        fireEvent.click(screen.getByRole("button", { name: /Inception/ }));

        await waitFor(() =>
            expect(navigate).toHaveBeenCalledWith({
                to: "/movie/$id",
                params: { id: "42" },
                viewTransition: true,
            }),
        );
        expect(queryClient.getQueryData(["movie", "42"])).toEqual(movie);
    });
});
