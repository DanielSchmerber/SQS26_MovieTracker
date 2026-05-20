import type {Movie} from "#/features/movies/movie.model.ts";

export const fetchMovie = async (id: string): Promise<Movie> => {

    const response = await fetch(`/api/v1/movie/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch movie");
    }

    return response.json();

};