import { z } from "zod";

export const reviewSchema = z.object({
    movie_id: z.number().int().positive(),
    rating: z.number().int().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
    comment: z
        .string()
        .min(3, "Comment must be at least 3 characters")
        .max(1000, "Comment must be at most 1000 characters")
        .optional()
        .or(z.literal("")),
});

export const reviewUpdateSchema = z.object({
    rating: z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(10, "Rating must be at most 10")
        .optional(),
    comment: z
        .string()
        .min(3, "Comment must be at least 3 characters")
        .max(1000, "Comment must be at most 1000 characters")
        .optional()
        .or(z.literal("")),
}).refine((d) => d.rating !== undefined || d.comment !== undefined, {
    message: "Provide at least a rating or a comment to update",
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
export type ReviewUpdateFormValues = z.infer<typeof reviewUpdateSchema>;
