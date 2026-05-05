import type {Movie} from "#/features/movies/movie.model.ts";

export const fetchMovie = async (id: string): Promise<Movie> => {
    // TODO implement backend
    // const { data } = await api.get<Movie>(`/movies/${id}`);
    //return data;

    return {
        id: id,
        title: "Inception",
        description: "A skilled thief is given a chance at redemption if he can successfully perform an inception—planting an idea into a target's subconscious.",
        year: 2010,

        poster: "https://m.media-amazon.com/images/M/MV5BMjQwNGE0MjctMDA3Yi00MGEyLTkyNTAtMjcxMTYxOWE0ZWRkXkEyXkFqcGc@._V1_.jpg",
        cover: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",

        tmdbRating: 8.8,
    }

};