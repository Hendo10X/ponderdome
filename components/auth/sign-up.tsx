"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignUpValues) {
    setError(null);
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.username, // Using username as name since name field is removed
        username: data.username,
      } as any,
      {
        onSuccess: () => {
          toast.success("Account created successfully! Please sign in.");
          router.push("/sign-in");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setError(ctx.error.message);
        },
      }
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Join the
          <br />
          3:00 AM Club
        </h1>
        <p className="text-gray-500 font-medium text-sm">
          Where your most uselessly genius thoughts
          <br />
          find their forever home.
        </p>
      </div>
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              id="username"
              {...register("username")}
              className="w-full px-4 py-3 bg-gray-200 border-none rounded-2xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-sm text-red-500 text-center">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 bg-gray-200 border-none rounded-2xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 text-center">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-4 py-3 bg-gray-200 border-none rounded-2xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all pr-12"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 text-center">{errors.password.message}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-white bg-indigo-500 rounded-full font-bold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "JOINING..." : "SIGN UP"}
        </button>

        <div className="text-center">
            <a href="/sign-in" className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
            Already have an account?
            </a>
        </div>
      </form>
    </div>
  );
}
