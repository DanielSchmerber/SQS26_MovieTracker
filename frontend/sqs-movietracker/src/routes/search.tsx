import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchMovies } from "#/features/movies/movie.queries.ts";
import { ErrorDisplay } from '#/components/ErrorDisplay.tsx'
import { useState } from 'react'
import { MovieComponent, MovieComponentSkeleton } from '#/components/MovieComponent.tsx'
import {PaginationBar} from "#/components/Paginationbar.tsx";
import {SearchBar} from "#/components/SearchBar.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";

function buildMovieSkeletonKeys(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `movie-skeleton-${index + 1}`);
}

export const Route = createFileRoute("/search")({
  validateSearch: (search): { title?: string } => ({
    ...(typeof search.title === "string" && search.title ? { title: search.title } : {}),
  }),
  component: SearchPage,
});

function SearchPage() {
  const { title } = Route.useSearch();

  return <>
  <div className="mx-auto flex w-[70%] flex-col gap-3 py-6 center">
    <SearchBar />
  </div>
    {title ? <SearchResults title={title} /> : <div  className="mx-auto flex w-[70%] flex-col gap-3 py-6 center">No Search results yet. Start searching for Movies</div>}
  </>;
}

function SearchResults({ title }: Readonly<{ title: string }>) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", "search", title, page],
    queryFn: () => searchMovies(title, page),
  });

  if (isLoading || isFetching) return <SearchResultsSkeleton />;
  if (isError) return <ErrorDisplay/>;

  return (
    <div className="mx-auto flex w-[70%] flex-col gap-3 py-6">
      Page : {page} / {data?.pages}

      {data?.results.map((movie) => (
        <MovieComponent
          key={movie.id}
          movie={movie}
          onClick={() => {
            queryClient.setQueryData(['movie', String(movie.id)], movie);
            navigate({ to: "/movie/$id", params: { id: movie.id }, viewTransition: true });
          }}
        />
      ))}

      <PaginationBar currentPage={page} totalPages={data?.pages ?? 1} setPage={setPage} pageRange={3} />
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="mx-auto flex w-[70%] flex-col gap-3 py-6">
      <Skeleton className="h-5 w-32" />
      {buildMovieSkeletonKeys(6).map((key) => (
        <MovieComponentSkeleton key={key} />
      ))}
    </div>
  );
}
