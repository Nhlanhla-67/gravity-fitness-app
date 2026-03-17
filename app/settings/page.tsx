"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (userErr) {
        setError(userErr.message);
        setLoading(false);
        return;
      }

      const user = userData.user;
      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? null);

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("fitness_level")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (profileErr) {
        setError(profileErr.message);
      } else {
        setFitnessLevel((profile?.fitness_level as string | null) ?? null);
      }

      setLoading(false);
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    setSigningOut(true);
    setError(null);
    try {
      const { error: signOutErr } = await supabase.auth.signOut();
      if (signOutErr) throw signOutErr;
      router.replace("/login");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign out. Try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-400"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Settings
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Account
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Manage your Gravity profile and sign out securely.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl sm:p-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-36 animate-pulse rounded bg-slate-700/60" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-800/60" />
              <div className="h-5 w-44 animate-pulse rounded bg-slate-700/60" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-800/60" />
              <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-slate-800/60" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </p>
                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                  <p className="text-sm font-medium text-slate-100">
                    {email ?? "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Fitness level
                </p>
                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                  <p className="text-sm font-medium text-slate-100">
                    {fitnessLevel ?? "Not set"}
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-red-400" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-800 font-semibold text-slate-100 transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

