"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTodayWorkout } from "@/lib/algorithm";

const TIMER_SIZE = 200;
const TIMER_STROKE = 8;
const TIMER_R = (TIMER_SIZE - TIMER_STROKE) / 2;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_R;

export interface ActiveWorkoutCardProps {
  baselineTargetReps?: number;
}

export function ActiveWorkoutCard({
  baselineTargetReps = 10,
}: ActiveWorkoutCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("Loading…");
  const [targetReps, setTargetReps] = useState<number>(baselineTargetReps);
  const [repsCompleted, setRepsCompleted] = useState<number>(baselineTargetReps);
  const [hasEditedReps, setHasEditedReps] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [exerciseLoaded, setExerciseLoaded] = useState(false);
  const [saving, setSaving] = useState<null | "perfect" | "too_easy" | "too_hard">(
    null,
  );
  const [saved, setSaved] = useState<null | "perfect" | "too_easy" | "too_hard">(
    null,
  );
  const savedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setTargetReps(baselineTargetReps);
    setRepsCompleted(baselineTargetReps);
    setHasEditedReps(false);
  }, [baselineTargetReps]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setError(null);

      const [{ data: userData, error: userErr }, { data: exData, error: exErr }] =
        await Promise.all([
          supabase.auth.getUser(),
          supabase.from("exercises").select("*").order("id", { ascending: true }).limit(1),
        ]);

      if (!isMounted) return;

      if (userErr) {
        setError(userErr.message);
      } else {
        const uid = userData.user?.id ?? null;
        setUserId(uid);
      }
      setAuthLoaded(true);

      if (exErr) {
        setError(exErr.message);
      } else {
        const first = exData?.[0] as
          | { id?: string; exercise_id?: string; name?: string; exercise_name?: string }
          | undefined;

        const exId = first?.id ?? first?.exercise_id ?? null;
        const exName = first?.name ?? first?.exercise_name ?? null;

        if (!exId || !exName) {
          setError("No exercises found. Add at least one row to the exercises table.");
        } else {
          setExerciseId(exId);
          setExerciseName(exName);

          // Once we have both a user and an exercise, compute today's target.
          const uid = userData.user?.id ?? null;
          if (uid) {
            try {
              const nextTarget = await (getTodayWorkout as any)(uid, exId, supabase);
              if (!isMounted) return;
              setTargetReps(nextTarget);
              if (!hasEditedReps) setRepsCompleted(nextTarget);
            } catch (e) {
              if (!isMounted) return;
              setError(
                e instanceof Error ? e.message : "Could not compute today’s workout.",
              );
              setTargetReps(baselineTargetReps);
              if (!hasEditedReps) setRepsCompleted(baselineTargetReps);
            }
          } else {
            setTargetReps(baselineTargetReps);
            if (!hasEditedReps) setRepsCompleted(baselineTargetReps);
          }
        }
      }
      setExerciseLoaded(true);
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const toggleTimer = useCallback(() => setIsRunning((r) => !r), []);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeLabel = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Optional: show progress as a lap (e.g. 90s = one full ring). Using 90s per "lap" for demo.
  const lapSeconds = 90;
  const progress = Math.min(1, (elapsedSeconds % lapSeconds) / lapSeconds);
  const strokeDashoffset = TIMER_CIRCUMFERENCE * (1 - progress);

  const isLoading = !authLoaded || !exerciseLoaded;

  const canSave = useMemo(
    () => !isLoading && Boolean(userId && exerciseId && repsCompleted >= 0 && !saving),
    [exerciseId, isLoading, repsCompleted, saving, userId],
  );

  const clearSavedLater = useCallback(() => {
    if (savedTimeoutRef.current) window.clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = window.setTimeout(() => setSaved(null), 1200);
  }, []);

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) window.clearTimeout(savedTimeoutRef.current);
    };
  }, []);

  async function logWorkout(difficulty: "perfect" | "too_easy" | "too_hard") {
    setError(null);
    setSaved(null);

    if (isLoading) return;
    if (!userId) {
      setError("You’re not signed in. Please log in and try again.");
      return;
    }
    if (!exerciseId) {
      setError("No exercise loaded yet. Please try again in a moment.");
      return;
    }

    setSaving(difficulty);
    try {
      const { error: insertError } = await supabase.from("workout_logs").insert({
        user_id: userId,
        exercise_id: exerciseId,
        reps_completed: repsCompleted,
        difficulty,
      });
      if (insertError) throw insertError;

      // Recompute today's target based on the newly logged set.
      try {
        const nextTarget = await (getTodayWorkout as any)(
          userId,
          exerciseId,
          supabase,
        );
        setTargetReps(nextTarget);
        if (!hasEditedReps) setRepsCompleted(nextTarget);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not update today’s target reps.",
        );
      }

      setSaved(difficulty);
      clearSavedLater();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Try again.");
    } finally {
      setSaving(null);
    }
  }

  if (isLoading) {
    return (
      <article className="w-full max-w-md mx-auto rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-xl sm:p-8">
        <p className="text-center text-sm font-medium text-slate-300">
          Loading workout...
        </p>
      </article>
    );
  }

  return (
    <article className="w-full max-w-md mx-auto rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-xl sm:p-8">
      {/* Exercise info */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          {exerciseName}
        </h2>
        <p className="mt-1 text-slate-400">
          Target:{" "}
          <span className="font-medium text-cyan-400">{targetReps} reps</span>
        </p>
      </div>

      {/* Circular timer */}
      <button
        type="button"
        onClick={toggleTimer}
        className="mx-auto mt-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-full"
        aria-label={isRunning ? "Pause timer" : "Start timer"}
      >
        <div className="relative" style={{ width: TIMER_SIZE, height: TIMER_SIZE }}>
          <svg
            className="-rotate-90"
            width={TIMER_SIZE}
            height={TIMER_SIZE}
            aria-hidden
          >
            <circle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={TIMER_R}
              fill="none"
              stroke="currentColor"
              strokeWidth={TIMER_STROKE}
              className="text-slate-700"
            />
            <circle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={TIMER_R}
              fill="none"
              stroke="currentColor"
              strokeWidth={TIMER_STROKE}
              strokeDasharray={TIMER_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-cyan-400 transition-[stroke-dashoffset] duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
              {timeLabel}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
              {isRunning ? "Tap to pause" : "Tap to start"}
            </span>
          </div>
        </div>
      </button>

      {/* Reps counter */}
      <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => {
            setHasEditedReps(true);
            setRepsCompleted((r) => Math.max(0, r - 1));
          }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 text-2xl font-semibold text-slate-100 transition active:scale-[0.98] hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Decrease reps"
        >
          −
        </button>
        <div className="min-w-[9rem] text-center">
          <div className="text-4xl font-bold tabular-nums text-white sm:text-5xl">
            {repsCompleted}
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            reps completed
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setHasEditedReps(true);
            setRepsCompleted((r) => r + 1);
          }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 text-2xl font-semibold text-slate-100 transition active:scale-[0.98] hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Increase reps"
        >
          +
        </button>
      </div>

      {error && (
        <p className="mt-5 text-center text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Action buttons — large touch targets for use while sweating */}
      <div className="mt-10 flex flex-col gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => logWorkout("perfect")}
          disabled={!canSave}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-cyan-500 font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition active:scale-[0.98] hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed sm:h-16 sm:text-lg"
        >
          {saving === "perfect"
            ? "Saving…"
            : saved === "perfect"
              ? "Saved!"
              : "Log Sets"}
        </button>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => logWorkout("too_easy")}
            disabled={!canSave}
            className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-emerald-500/60 bg-emerald-500/20 font-semibold text-emerald-400 transition active:scale-[0.98] hover:bg-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed sm:h-16 sm:text-base"
          >
            {saving === "too_easy"
              ? "Saving…"
              : saved === "too_easy"
                ? "Saved!"
                : "Too Easy"}
          </button>
          <button
            type="button"
            onClick={() => logWorkout("too_hard")}
            disabled={!canSave}
            className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-amber-500/60 bg-amber-500/20 font-semibold text-amber-400 transition active:scale-[0.98] hover:bg-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed sm:h-16 sm:text-base"
          >
            {saving === "too_hard"
              ? "Saving…"
              : saved === "too_hard"
                ? "Saved!"
                : "Too Hard"}
          </button>
        </div>
      </div>
    </article>
  );
}
