import type { Movie } from "#/features/movies/movie.model.ts";

export interface WatchlistEntry {
    id: number;
    added_at: string;
    movie: Movie;
}

export interface WatchlistPage {
    items: WatchlistEntry[];
    total: number;
    page: number;
    size: number;
    pages: number;
}
