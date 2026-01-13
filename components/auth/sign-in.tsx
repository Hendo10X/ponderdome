"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Adjusting schema to use email for now as per Better Auth default
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignInValues = z.infer<typeof formSchema>;

import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInValues) {
    setError(null);
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/dashboard");
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
          Back for more
          <br />
          3:00 AM wisdom?
        </h1>
        <p className="text-gray-500 font-medium text-sm">
          The world's most uselessly genius
          <br />
          thoughts are waiting for your approval.
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
          {isSubmitting ? "LOGGING IN..." : "LOGIN"}
        </button>

        <div className="text-center">
          <a href="#" className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
}
