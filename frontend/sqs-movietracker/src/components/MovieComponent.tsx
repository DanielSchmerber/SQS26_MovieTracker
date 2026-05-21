import type { Movie } from "#/features/movies/movie.model.ts";
import * as React from 'react'
import { Skeleton } from "#/components/ui/skeleton.tsx";
import {useEffect} from "react";

interface MovieComponentProps {
  movie: Movie;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function MovieComponent({ movie, onClick, children }: MovieComponentProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:bg-muted/60 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-300 group-hover:brightness-110"
          style={{ viewTransitionName: `movie-poster-${movie.id}` }}
        />
        <div className="absolute inset-0 rounded-lg opacity-0 ring-2 ring-white/40 transition duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-bold leading-snug">{movie.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{movie.description}</p>
        {children && <div className="mt-auto pt-2">{children}</div>}
      </div>
    </button>
  );
}

export function MovieComponentSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-24 w-16 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
