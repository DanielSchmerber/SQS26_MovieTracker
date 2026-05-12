import type {Movie} from "#/features/movies/movie.model.ts";

export const fetchMovie = async (id: string): Promise<Movie> => {

    // for now, until we get reverse proxy working
    const response = await fetch(`http://localhost:8000/movie/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch movie");
    }

    return response.json();

};