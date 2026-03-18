"use client";

export interface ShareCardProps {
  routineName: string;
  exerciseName: string;
  reps: number;
}

export function ShareCard({ routineName, exerciseName, reps }: ShareCardProps) {
  const safeReps = Number.isFinite(reps) ? Math.max(0, Math.floor(reps)) : 0;
  const headline = `CRUSHED ${safeReps} REPS OF ${exerciseName}`.toUpperCase();

  return (
    <div
      className="relative h-[1080px] w-[1080px] overflow-hidden rounded-[64px] bg-[#0f172a] text-slate-100"
      style={{
        boxShadow:
          "0 0 0 1px rgba(51,65,85,0.6), 0 40px 140px rgba(2,6,23,0.75)",
      }}
    >
      {/* glow accents */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(6,182,212,0.55), rgba(6,182,212,0.0) 62%)",
          filter: "blur(2px)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-32 -bottom-32 h-[560px] w-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, rgba(34,211,238,0.22), rgba(34,211,238,0.0) 65%)",
        }}
      />

      {/* subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")",
        }}
      />

      {/* hero image slot (add your own high-res photo at /public/share/walking-lunges.jpg) */}
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

      <div className="relative flex h-full flex-col px-16 py-16">
        <div>
          <p className="text-[22px] font-semibold tracking-[0.18em] text-slate-300">
            TODAY&apos;S FOCUS:
          </p>
          <p className="mt-3 text-[54px] font-black leading-[1.02] tracking-tight text-white">
            {routineName.toUpperCase()}
          </p>
        </div>

        <div className="mt-24">
          <p className="text-[96px] font-black leading-[0.95] tracking-tight text-white">
            {headline}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-[18px] font-semibold tracking-[0.18em] text-slate-400">
              BUILT FOR AT‑HOME, NO‑EQUIPMENT TRAINING
            </p>
          </div>

          <div className="text-right">
            <p className="mt-2 text-[56px] font-black tracking-[0.18em] text-white">
              GRAVITY
            </p>
          </div>
        </div>
      </div>

      {/* border sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[64px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,238,0.22), rgba(255,255,255,0) 32%, rgba(6,182,212,0.10) 68%, rgba(255,255,255,0))",
          mixBlendMode: "screen",
          opacity: 0.65,
        }}
      />
    </div>
  );
}

