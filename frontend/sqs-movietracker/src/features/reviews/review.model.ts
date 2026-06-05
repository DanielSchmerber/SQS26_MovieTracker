export interface ReviewEntry {
    id: number;
    user_id: number;
    username: string;
    movie_id: number;
    rating: number;
    comment: string | null;
}
