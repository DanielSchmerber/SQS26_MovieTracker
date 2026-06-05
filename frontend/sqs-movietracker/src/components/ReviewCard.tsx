import { Skeleton } from "#/components/ui/skeleton.tsx";
import type { ReviewEntry } from "#/features/reviews/review.model.ts";

export function ReviewCardSkeleton() {
    return (
        <div className="flex flex-col gap-2">
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
    );
}

export function ReviewCard({ review }: { review: ReviewEntry }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase">
                    {review.username[0]}
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{review.username}</span>
                    <span className="text-xs text-muted-foreground">{review.rating}/10</span>
                </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
        </div>
    );
}
