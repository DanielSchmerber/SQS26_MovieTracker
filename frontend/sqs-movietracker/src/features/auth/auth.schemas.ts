import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(20, "Username must be less than 20 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters").max(20, "Username must be less than 20 characters"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
