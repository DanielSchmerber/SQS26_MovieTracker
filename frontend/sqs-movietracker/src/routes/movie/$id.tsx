import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "#/features/movies/movie.queries.ts";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { toast } from "sonner"
import { ErrorDisplay } from '#/components/ErrorDisplay.tsx'

export const Route = createFileRoute('/movie/$id')({
    component: MoviePage,
})

function MoviePage() {
    const { id } = Route.useParams()

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ['movie', id],
        queryFn: () => fetchMovie(id),
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
                            </div>

                            {/* Review list placeholder */}
                            {// TODO replace with actual review list
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
                    <div className="flex flex-col gap-6 order-1 md:order-2">

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
                            <button className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90" onClick={
                              () => {
                                toast.promise<{ name: string }>(
                                  () =>
                                    new Promise((resolve) =>
                                      setTimeout(() => resolve({ name: movie?.title || "" }), 2000)
                                    ),
                                  {
                                    loading: "Adding to Watchlist...",
                                    success: (data) => `${data.name} has been added to your Watchlist!`,
                                    error: "Error",
                                  },
                                )
                              }}>
                                Add to Watchlist
                            </button>
                        </div>

                      <div className="flex flex-col gap-2">
                        <button className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90">
                          Review
                        </button>
                      </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
