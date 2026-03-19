"use client";

export interface ShareCardProps {
  routineName: string;
  exerciseName: string;
  reps: number;
}

export function ShareCard({ routineName, exerciseName, reps }: ShareCardProps) {
  const safeReps = Number.isFinite(reps) ? Math.max(0, Math.floor(reps)) : 0;
  const focus = (routineName || "Daily Stack").toUpperCase();
  const headline = `CRUSHED ${safeReps} REPS OF ${exerciseName}`.toUpperCase();

  return (
    <div className="relative h-[1080px] w-[1080px] overflow-hidden rounded-[64px] bg-[#0f172a] text-slate-100">
      {/* High-res image (add your own file at /public/share/walking-lunges.jpg) */}
      <div className="absolute inset-0">
        <img
          src="/share/walking-lunges.jpg"
          alt="Fitness model performing walking lunges"
          className="h-full w-full object-cover object-[60%_25%]"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.68) 42%, rgba(15,23,42,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 86% 10%, rgba(6,182,212,0.22), rgba(6,182,212,0) 52%)",
          }}
        />
      </div>

      {/* Cyan glow corner */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-cyan-500/25 blur-[120px]" />

      {/* Content */}
      <div className="relative flex h-full flex-col px-16 py-16">
        <div>
          <p className="text-[22px] font-semibold tracking-[0.18em] text-slate-300">
            TODAY&apos;S FOCUS:
          </p>
          <p className="mt-3 text-[54px] font-black leading-[1.02] tracking-tight text-white">
            {focus}
          </p>
        </div>

        <div className="mt-24">
          <p className="text-[96px] font-black leading-[0.95] tracking-tight text-white">
            {headline}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <p className="text-[18px] font-semibold tracking-[0.18em] text-slate-400">
            BUILT FOR AT‑HOME, NO‑EQUIPMENT TRAINING
          </p>
          <p className="text-[56px] font-black tracking-[0.18em] text-white">
            GRAVITY
          </p>
        </div>
      </div>

      {/* Sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[64px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(255,255,255,0) 32%, rgba(6,182,212,0.10) 68%, rgba(255,255,255,0))",
          mixBlendMode: "screen",
          opacity: 0.65,
        }}
      />
    </div>
  );
}