"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { ActiveWorkoutCard } from "@/components/workout/ActiveWorkoutCard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        router.replace("/login");
        return;
      }

      const sessionUser = data.session?.user ?? null;
      if (!sessionUser) {
        router.replace("/login");
        return;
      }

      setUser(sessionUser);
      setChecking(false);
    }

    void checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null;
        if (!nextUser) router.replace("/login");
        setUser(nextUser);
      },
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-700/60" />
          <div className="mt-6 h-[260px] w-full animate-pulse rounded-2xl bg-slate-800/60" />
          <p className="mt-4 text-sm text-slate-400">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Today’s Routine
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            You’re signed in as{" "}
            <span className="font-medium text-slate-200">{user.email}</span>.
          </p>
        </header>

        <ActiveWorkoutCard />
      </main>
    </div>
  );
}

