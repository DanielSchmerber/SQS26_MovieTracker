import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "#/features/movies/movie.queries.ts";
import { Skeleton } from "#/components/ui/skeleton.tsx";

export const Route = createFileRoute('/movie/$id')({
    component: MoviePage,
})

function MoviePage() {
    const { id } = Route.useParams()

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ['movie', id],
        queryFn: () => fetchMovie(id),
    })

    if (error) return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <p className="text-muted-foreground">Failed to load movie.</p>
        </div>
    )

    return (
        <div>
            {/* Cover image */}
            <div className="h-72 w-full overflow-hidden md:h-96">
                {isLoading
                    ? <Skeleton className="h-full w-full rounded-none" />
                    : <img
                        src={movie?.cover}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                }
            </div>

            {/* Page body */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

                    {/* ── Left column (title + description + reviews) ── */}
                    <div className="md:col-span-2 flex flex-col gap-6">

                        {/* Badges: year · runtime · rating */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {isLoading
                                ? <Skeleton className="h-4 w-40" />
                                : <>
                                    <span>{movie?.year}</span>
                                    <span>·</span>
                                    <span className="rounded border border-black/20 px-1.5 py-0.5 text-xs font-medium dark:border-white/20">
                                        PG-13
                                    </span>
                                </>
                            }
                        </div>

                        {/* Title */}
                        {isLoading
                            ? <Skeleton className="h-9 w-3/4" />
                            : <h1 className="text-3xl font-black tracking-tight md:text-4xl">
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

                        {/* Reviews */}
                        <section className="flex flex-col gap-4 pt-4">
                            <div className="flex items-center justify-between border-b border-border pb-2">
                                <h2 className="text-lg font-bold">Reviews</h2>
                                <span className="text-sm text-muted-foreground">POST ENTRY</span>
                            </div>

                            {/* Review list placeholder */}
                            {//TODO replace with actual review list
                            }
                            <div className="flex flex-col gap-6">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <div className="flex flex-col gap-1">
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* ── Right column (rating + meta + CTAs + cast) ── */}
                    <div className="flex flex-col gap-6">

                        {/* Global rating */}
                        <div className="rounded-xl border border-border bg-card p-5">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Our Rating
                            </p>
                            {isLoading
                                ? <Skeleton className="mt-2 h-12 w-28" />
                                : <div className="mt-1 flex items-baseline gap-1">
                                    <span className="text-5xl font-black">{movie?.tmdbRating}</span>
                                    <span className="text-lg text-muted-foreground">/10</span>
                                </div>
                            }
                            {/* Star row placeholder */}
                            <div className="mt-2 flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-4 w-4 rounded-sm bg-muted" />
                                ))}
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
                            <button className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90">
                                Add to Watchlist
                            </button>
                        </div>

                      <div className="flex flex-col gap-2">
                        <button className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90">
                          Review
                        </button>
                      </div>

                        {/* Cast hierarchy */}
                        <section className="flex flex-col gap-3">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Cast Hierarchy
                            </h3>
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="h-3 w-28" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Metadata detail block */}
                        <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Metadata
                            </h3>
                            <div className="flex flex-col gap-1.5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-3 w-full" />
                                ))}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    )
}
