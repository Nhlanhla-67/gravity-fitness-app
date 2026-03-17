"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Mode = "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "sign-up") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight text-white"
            >
              Gravity
            </Link>
            <p className="mt-2 text-sm text-slate-400">
              Adaptive workouts, no equipment.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-xl sm:p-8">
            {/* Toggle: Sign In / Sign Up */}
            <div className="flex rounded-xl bg-slate-900/80 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("sign-in");
                  setError(null);
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition sm:py-3 sm:text-base ${
                  mode === "sign-in"
                    ? "bg-cyan-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("sign-up");
                  setError(null);
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition sm:py-3 sm:text-base ${
                  mode === "sign-up"
                    ? "bg-cyan-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:py-3.5"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:py-3.5"
                />
              </div>

              {error && (
                <p className="text-sm font-medium text-red-400" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 py-3.5 font-semibold text-slate-950 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 sm:py-4"
              >
                {loading
                  ? "Please wait…"
                  : mode === "sign-in"
                    ? "Sign In"
                    : "Create account"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500">
            <Link href="/" className="font-medium text-slate-400 hover:text-cyan-400">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
