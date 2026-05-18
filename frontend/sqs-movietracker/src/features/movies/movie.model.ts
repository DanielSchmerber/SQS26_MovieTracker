export interface Movie {
    id: string,
    title : string,
    description : string,
    year : number,

    poster: string,
    backdrop: string,

    tmdbRating: number,
}

export interface MovieSearchResponse {
    page: number,
    pages: number,
    total_results: number,
    results: Movie[],
}