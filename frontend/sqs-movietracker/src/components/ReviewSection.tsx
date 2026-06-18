import { useState } from "react";
import type { ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "#/features/auth/auth.context.tsx";
import { fetchReviews, addReview } from "#/features/reviews/review.queries.ts";
import { reviewSchema } from "#/features/reviews/review.schema.ts";
import type { ReviewFormValues } from "#/features/reviews/review.schema.ts";
import { ReviewCard, ReviewCardSkeleton } from "#/components/ReviewCard.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "#/components/ui/dialog.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Label } from "#/components/ui/label.tsx";
import { isInWatchlist } from '#/features/watchlist/watchlist.queries.ts'

const FLAVOR: Record<number, string> = {
    1:  "Unwatchable",
    2:  "Terrible",
    3:  "Bad",
    4:  "Poor",
    5:  "Mediocre",
    6:  "Decent",
    7:  "Good",
    8:  "Great",
    9:  "Excellent",
    10: "Masterpiece",
};

const REVIEW_SKELETON_KEYS = ["review-skeleton-1", "review-skeleton-2", "review-skeleton-3"];

function selectedButtonClass(n: number, selected: boolean): string {
    if (!selected) return "bg-muted text-muted-foreground hover:bg-foreground/20";
    if (n <= 2) return "bg-red-600 text-white";
    if (n <= 4) return "bg-orange-500 text-white";
    if (n <= 6) return "bg-yellow-500 text-black";
    if (n <= 8) return "bg-green-600 text-white";
    return "bg-amber-400 text-black";
}

function flavorClass(n: number): string {
    if (n === 1)  return "text-red-500 font-bold animate-pulse";
    if (n === 10) return "text-amber-500 font-bold animate-bounce";
    if (n <= 3)   return "text-red-400 font-semibold";
    if (n >= 8)   return "text-green-500 font-semibold";
    return "text-muted-foreground";
}

interface ReviewSectionProps {
    movieId: number;
}

export function ReviewSection({ movieId }: Readonly<ReviewSectionProps>) {
    const { user } = useAuth();

    const { data: watched } = useQuery({
      queryKey: ["watchlist", movieId],
      queryFn: () => isInWatchlist(movieId),
      enabled: !!user,
    });

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { data: reviews, isLoading } = useQuery({
        queryKey: ["reviews", movieId],
        queryFn: () => fetchReviews(movieId),
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
        setError,
    } = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { movie_id: movieId },
    });

    const selectedRating = watch("rating");
    let selectedRatingIcon = "";

    if (selectedRating === 1) {
        selectedRatingIcon = "💀 ";
    } else if (selectedRating === 10) {
        selectedRatingIcon = "✨ ";
    }

    const mutation = useMutation({
        mutationFn: (data: ReviewFormValues) => addReview(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
            queryClient.invalidateQueries({ queryKey: ["rating", movieId] });
            toast.success("Review added!");
            reset({ movie_id: movieId });
            setOpen(false);
        },
        onError: (err) => {
            setError("root", { message: err instanceof Error ? err.message : "Failed to submit review" });
        },
    });

    async function onSubmit(values: ReviewFormValues) {
        await mutation.mutateAsync({
            ...values,
            comment: values.comment === "" ? undefined : values.comment,
        });
    }

    const withComments = reviews?.filter((r) => r.comment);
    let reviewsContent: ReactNode = withComments?.map((r) => <ReviewCard key={r.id} review={r} />);

    if (isLoading) {
        reviewsContent = REVIEW_SKELETON_KEYS.map((key) => <ReviewCardSkeleton key={key} />);
    } else if (withComments?.length === 0) {
        reviewsContent = <p className="text-sm text-muted-foreground">No reviews yet.</p>;
    }


    return (
        <section className="flex flex-col gap-4 pt-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-lg font-bold">Reviews</h2>
                {user && (
                    !watched ? <Button size="sm" variant="outline" disabled={true}>Add to watchlist to review</Button>:
                    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset({ movie_id: movieId }); }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">Write a review</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Rate this movie</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <Label>Rating</Label>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setValue("rating", n, { shouldValidate: true })}
                                                className={`h-8 w-8 rounded text-sm font-semibold transition ${selectedButtonClass(n, selectedRating === n)}`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedRating >= 1 && (
                                        <p className={`text-sm ${flavorClass(selectedRating)}`}>
                                            {selectedRatingIcon}
                                            {FLAVOR[selectedRating]}
                                        </p>
                                    )}
                                    {errors.rating && (
                                        <p className="text-sm text-destructive">{errors.rating.message}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="comment">
                                        Comment{" "}
                                        <span className="text-muted-foreground font-normal">(optional)</span>
                                    </Label>
                                    <textarea
                                        id="comment"
                                        rows={4}
                                        placeholder="What did you think?"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                        {...register("comment")}
                                    />
                                    {errors.comment && (
                                        <p className="text-sm text-destructive">{errors.comment.message}</p>
                                    )}
                                </div>

                                {errors.root && (
                                    <p className="text-sm text-destructive">{errors.root.message}</p>
                                )}

                                <DialogFooter showCloseButton>
                                    <Button type="submit" disabled={mutation.isPending}>
                                        {mutation.isPending ? "Submitting…" : "Submit"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="flex flex-col gap-6">
                {reviewsContent}
            </div>
        </section>
    );
}
