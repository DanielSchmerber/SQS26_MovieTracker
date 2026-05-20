import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchMovies } from "#/features/movies/movie.queries.ts";
import { ErrorDisplay } from '#/components/ErrorDisplay.tsx'
import { useState } from 'react'
import { MovieComponent } from '#/components/MovieComponent.tsx'
import {PaginationBar} from "#/components/Paginationbar.tsx";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { title?: string } => ({
    ...(typeof search.title === "string" && search.title ? { title: search.title } : {}),
  }),
  component: SearchPage,
});

function SearchPage() {
  const { title } = Route.useSearch();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", "search", title, page],
    queryFn: () => searchMovies(title!, page),
    enabled: !!title,
  });

  if (!title) return null;

  if (isLoading || isFetching) return <p>Loading...</p>;
  if (isError) return <ErrorDisplay/>;

  return (
    <div className="mx-auto flex w-[70%] flex-col gap-3 py-6">
      Page : {page} / {data?.pages}

      {data?.results.map((movie) => (
        <MovieComponent
          key={movie.id}
          movie={movie}
          onClick={() => {
            queryClient.setQueryData(['movie', movie.id], movie);
            navigate({ to: "/movie/$id", params: { id: movie.id }, viewTransition: true });
          }}
        />
      ))}

      <PaginationBar currentPage={page} totalPages={data?.pages ?? 1} setPage={setPage} pageRange={3} />
    </div>
  );
}