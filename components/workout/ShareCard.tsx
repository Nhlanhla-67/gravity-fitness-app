export default function ShareCard({ routineName, exerciseName, reps }: { routineName: string, exerciseName: string, reps: number }) {
  return (
    <div className="w-[1080px] h-[1080px] bg-[#0f172a] flex flex-col justify-center items-center text-center relative overflow-hidden">
      {/* Background Glowing Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/40 rounded-full blur-[120px]"></div>
      
      {/* Content */}
      <div className="z-10 flex flex-col items-center px-12">
        <p className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-2xl mb-4">
          Today's Focus
        </p>
        <h1 className="text-white font-extrabold text-7xl tracking-tight mb-16">
          {routineName || "GRAVITY WORKOUT"}
        </h1>
        
        <div className="h-[2px] w-32 bg-cyan-500/50 mb-16"></div>
        
        <p className="text-slate-300 text-3xl font-medium tracking-widest uppercase mb-6">
          Crushed
        </p>
        <h2 className="text-cyan-400 font-black text-9xl mb-6">
          {reps} <span className="text-6xl text-white">REPS</span>
        </h2>
        <h3 className="text-white font-bold text-6xl uppercase tracking-wider">
          {exerciseName}
        </h3>
      </div>

      {/* Footer / Watermark */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center">
        <p className="text-slate-500 text-2xl tracking-[0.4em] font-semibold">
          BUILT FOR <span className="text-white">GRAVITY</span>
        </p>
      </div>
    </div>
  );
}