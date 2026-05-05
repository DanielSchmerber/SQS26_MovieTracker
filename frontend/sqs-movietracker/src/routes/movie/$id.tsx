import { createFileRoute } from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {fetchMovie} from "#/features/movies/movie.queries.ts";

export const Route = createFileRoute('/movie/$id')({
    component: MoviePage,
})

function MoviePage() {
    const { id } = Route.useParams()

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ['movie', id],
        queryFn: () => fetchMovie(id),
    })
    // id is inferred as string

    if(isLoading) return (
        <>
        Loading...
        </>
    )

    if(error) return (
        <>
            Error :({error})
        </>
    )

    return (
        <>
            <p>Movie id : {id}</p>
            <p>Movie name : {movie?.title}</p>
        </>
        )

}