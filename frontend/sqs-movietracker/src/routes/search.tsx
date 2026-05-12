import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { title?: string } => ({
    ...(typeof search.title === "string" && search.title ? { title: search.title } : {}),
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();


  return (
    <>
      {search.title && <p>Searching for: {search.title}</p>}
    </>
  );
}