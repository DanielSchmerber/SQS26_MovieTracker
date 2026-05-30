export interface ReviewEntry {
    id: number;
    user_id: number;
    movie_id: number;
    rating: number;
    comment: string | null;
}
