import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-12">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 80% 10%, rgba(6,182,212,0.20), rgba(6,182,212,0) 45%), radial-gradient(circle at 10% 30%, rgba(34,211,238,0.12), rgba(34,211,238,0) 50%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              Gravity • Adaptive Bodyweight Training
            </p>

            <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Master Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                Bodyweight.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              An adaptive, AI-driven training system that scales with your strength.
              No equipment. No excuses.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-[0_0_32px_rgba(6,182,212,0.35)] transition hover:bg-cyan-400 hover:shadow-[0_0_44px_rgba(6,182,212,0.45)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
              >
                Start Training Free
              </Link>
              <a
                href="#how"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/30 px-6 py-4 text-base font-semibold text-slate-200 transition hover:bg-slate-900/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="border-t border-slate-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Built to keep you progressing.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-400 sm:text-lg">
              Daily structure, adaptive targets, and shareable wins — everything you need to stay consistent at home.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                The AI Coach
              </p>
              <h3 className="mt-3 text-xl font-bold text-white">
                Day-specific routines
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Generates a focused daily stack so you always know what to do next.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Adaptive Progression
              </p>
              <h3 className="mt-3 text-xl font-bold text-white">
                Targets that scale with you
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your feedback (too easy/perfect/too hard) adjusts the next target reps automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Viral Analytics
              </p>
              <h3 className="mt-3 text-xl font-bold text-white">
                Share premium stat cards
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Export clean 1080×1080 posters to post your daily wins anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm text-slate-500">
            Built for Gravity. © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
