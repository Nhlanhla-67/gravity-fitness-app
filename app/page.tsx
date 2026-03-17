import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-28 md:px-8 lg:px-12 lg:pt-28 lg:pb-36">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950" aria-hidden />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Your body.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              Zero equipment.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400 sm:mt-6 sm:text-xl md:max-w-2xl md:text-2xl">
            Adaptive, no-equipment workouts that fit your level and your space. Get a daily plan, track progress, and build strength at home.
          </p>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_24px_var(--accent-glow)] transition hover:bg-cyan-300 hover:shadow-[0_0_32px_var(--accent-glow)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:px-10 sm:py-4 sm:text-lg"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-slate-800 bg-slate-900/50 px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-slate-400 sm:text-lg">
            Three steps to a routine that adapts to you.
          </p>

          <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 text-center sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-lg font-bold text-cyan-400 sm:h-14 sm:w-14 sm:text-xl">
                1
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white sm:text-xl">
                Input max reps
              </h3>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Tell us your current max for key movements. We use this to calibrate every workout to your level.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 text-center sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-lg font-bold text-cyan-400 sm:h-14 sm:w-14 sm:text-xl">
                2
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white sm:text-xl">
                Get daily plan
              </h3>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Each day you get a personalized, no-equipment routine that progresses as you get stronger.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 text-center sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-lg font-bold text-cyan-400 sm:h-14 sm:w-14 sm:text-xl">
                3
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white sm:text-xl">
                Track progress
              </h3>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Log your sets and reps. Gravity adjusts your next workouts so you keep improving.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center sm:mt-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:px-8 sm:py-3 sm:text-base"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500">Gravity — adaptive fitness, no equipment.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="transition hover:text-slate-300">Privacy</a>
            <a href="#" className="transition hover:text-slate-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
