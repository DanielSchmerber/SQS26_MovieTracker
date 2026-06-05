import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "#/features/movies/movie.queries.ts";
import { fetchRating } from "#/features/reviews/review.queries.ts";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { ErrorDisplay } from '#/components/ErrorDisplay.tsx';
import { WatchlistButton } from '#/components/WatchlistButton.tsx';
import { ReviewSection } from '#/components/ReviewSection.tsx';

export const Route = createFileRoute('/movie/$id')({
    component: MoviePage,
})

function MoviePage() {
    const { id } = Route.useParams()

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ['movie', id],
        queryFn: () => fetchMovie(id),
    })

    const { data: ourRating, isLoading: ratingLoading } = useQuery({
        queryKey: ['rating', parseInt(id)],
        queryFn: () => fetchRating(parseInt(id)),
    })

    if(error) return (
        <>
            <ErrorDisplay message={error.message}></ErrorDisplay>
        </>
    )

    return (
        <div>
            {/* Backdrop + centered poster */}
            <div className="relative h-72 w-full overflow-hidden md:h-96">
                {isLoading
                    ? <Skeleton className="h-full w-full rounded-none" />
                    : <img
                        src={movie?.backdrop || movie?.poster}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                }

                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-7xl px-6">
                    <div className="w-28 h-40 md:w-36 md:h-52 rounded-xl overflow-hidden shadow-2xl ring-4 ring-background">
                        {isLoading
                            ? <Skeleton className="h-full w-full" />
                            : <img
                                src={movie?.poster || movie?.backdrop}
                                alt={movie?.title}
                                className="h-full w-full object-cover"
                                style={{ viewTransitionName: `movie-poster-${id}` }}
                            />
                        }
                    </div>
                    </div>
                </div>
            </div>

            {/* Page body */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

                    {/* ── Left column (title + description + reviews) ── */}
                    <div className="md:col-span-2 flex flex-col gap-6 order-2 md:order-1">

                        {/* Title */}
                        {isLoading
                            ? <Skeleton className="h-9 w-3/4" />
                            : <h1 className="text-3xl font-black tracking-tight md:text-4xl"
                                  style={{ viewTransitionName: `movie-title-${movie?.id}` }}
                            >
                                {movie?.title}
                            </h1>
                        }

                        {/* Description */}
                        {isLoading
                            ? <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            : <p className="leading-relaxed text-muted-foreground">
                                {movie?.description}
                            </p>
                        }

                        <ReviewSection movieId={parseInt(id)} />
                    </div>

                    {/* ── Right column (rating + meta + CTAs + cast) ── */}
                    <div className="flex flex-col gap-6 order-1 md:order-2">

                        {/* Our rating */}
                        <div className="rounded-xl border border-border bg-card p-5">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Our Rating
                            </p>
                            {ratingLoading
                                ? <Skeleton className="mt-2 h-12 w-28" />
                                : <div className="mt-1 flex items-baseline gap-1">
                                    <span className="text-5xl font-black">
                                        {ourRating === -1 ? "—" : ourRating?.toFixed(1)}
                                    </span>
                                    {ourRating !== -1 && (
                                        <span className="text-lg text-muted-foreground">/10</span>
                                    )}
                                </div>
                            }
                            <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">TMDB</span>
                                {isLoading
                                    ? <Skeleton className="h-3 w-10" />
                                    : <span className="text-sm font-semibold">{movie?.tmdbRating}</span>
                                }
                            </div>
                        </div>

                        {/* Metadata rows */}
                        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
                            {["Director", "Genre", "Writer"].map((label) => (
                                <div key={label} className="flex items-center justify-between px-4 py-3">
                                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        {label}
                                    </span>
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-2">
                            <WatchlistButton movieId={parseInt(id)} movieTitle={movie?.title} />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
