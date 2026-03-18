"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { ActiveWorkoutCard } from "@/components/workout/ActiveWorkoutCard";
import ProgressChart from "@/components/workout/ProgressChart";
import { getDailyRoutine } from "@/lib/algorithm";
import { ShareButton } from "@/components/workout/ShareButton";
import { ShareCard } from "@/components/workout/ShareCard";

type ExerciseRow = {
  id?: string;
  exercise_id?: string;
  name?: string;
  exercise_name?: string;
  body_part?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [routineName, setRoutineName] = useState<string | null>(null);
  const [dailyStack, setDailyStack] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [routineLoading, setRoutineLoading] = useState(false);
  const [routineError, setRoutineError] = useState<string | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [activeExerciseName, setActiveExerciseName] = useState<string | null>(null);
  const [shareReps, setShareReps] = useState<number>(10);

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

  useEffect(() => {
    let isMounted = true;

    async function loadRoutine() {
      if (!user) return;

      setRoutineLoading(true);
      setRoutineError(null);

      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("id", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setRoutineError(error.message);
        setRoutineName(null);
        setDailyStack([]);
        setActiveExerciseId(null);
        setActiveExerciseName(null);
        setRoutineLoading(false);
        return;
      }

      const all = (data as ExerciseRow[] | null) ?? [];
      const routine = getDailyRoutine(all);

      setRoutineName(routine.routineName ?? null);

      const normalizedStack =
        (routine.exercises as ExerciseRow[] | null)?.flatMap((row) => {
          const id = row.id ?? row.exercise_id;
          const name = row.name ?? row.exercise_name;
          if (!id || !name) return [];
          return [{ id, name }];
        }) ?? [];

      setDailyStack(normalizedStack);
      if (normalizedStack.length > 0) {
        // Always default to the first exercise in today's stack.
        setActiveExerciseId(normalizedStack[0]!.id);
        setActiveExerciseName(normalizedStack[0]!.name);
      }
      setRoutineLoading(false);
    }

    void loadRoutine();

    return () => {
      isMounted = false;
    };
  }, [user]);

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
        {/* Off-screen premium share poster */}
        <div id="export-card" className="absolute left-[-9999px] top-0">
          <ShareCard
            routineName={routineName ?? "Daily Stack"}
            exerciseName={activeExerciseName ?? "Walking Lunges"}
            reps={shareReps}
          />
        </div>

        <div>
          <header className="mb-6 sm:mb-8">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Dashboard
            </p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Today’s Focus:{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  {routineName ?? "Loading…"}
                </span>
              </h1>
              <Link
                href="/settings"
                className="shrink-0 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Settings
              </Link>
            </div>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              You’re signed in as{" "}
              <span className="font-medium text-slate-200">{user.email}</span>.
            </p>
          </header>

          {/* AI Coach: today's stack */}
          <section className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-200">
                Today’s Stack
              </h2>
              {routineLoading && (
                <span className="text-xs text-slate-500">Building…</span>
              )}
            </div>

            {routineError && (
              <p className="mt-2 text-sm font-medium text-red-400" role="alert">
                {routineError}
              </p>
            )}

            <div className="mt-3 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {dailyStack.map((ex) => {
                  const active = ex.id === activeExerciseId;
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        setActiveExerciseId(ex.id);
                        setActiveExerciseName(ex.name);
                      }}
                      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                        active
                          ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-[0_0_18px_var(--accent-glow)]"
                          : "border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-900/70"
                      }`}
                    >
                      {ex.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {activeExerciseId && activeExerciseName ? (
            <div className="space-y-4 sm:space-y-6">
              <ActiveWorkoutCard
                exerciseId={activeExerciseId}
                exerciseName={activeExerciseName}
                onRepsForShareChange={setShareReps}
              />
              <ProgressChart userId={user.id} exerciseId={activeExerciseId} />
            </div>
          ) : (
            <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-center text-sm text-slate-400">
                Add an exercise in Supabase to get started.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <ShareButton />
        </div>
      </main>
    </div>
  );
}

