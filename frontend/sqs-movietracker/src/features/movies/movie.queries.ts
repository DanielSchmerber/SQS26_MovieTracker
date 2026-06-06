import type {Movie, MovieSearchResponse} from "#/features/movies/movie.model.ts";

export const fetchMovie = async (id: string): Promise<Movie> => {

    const response = await fetch(`/api/v1/movies/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch movie");
    }

    return response.json();

};

export const searchMovies = async (
    query: string,
    page: number = 1,
    year?: number,
): Promise<MovieSearchResponse> => {
    const params = new URLSearchParams({ query, page: String(page) });
    if (year !== undefined) params.set("year", String(year));

    const response = await fetch(`/api/v1/movies/search?${params}`);

    if (!response.ok) {
        throw new Error("Failed to search movies");
    }

    return response.json();
};
