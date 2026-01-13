import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username must be alphanumeric and can contain underscores" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const signInSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }), // Using username for sign in
  password: z.string().min(1, { message: "Password is required" }),
});
