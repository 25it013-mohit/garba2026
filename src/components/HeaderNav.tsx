import React from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { EnergyMode } from '../types';

interface HeaderNavProps {
  energy: number;
  energyMode: EnergyMode;
  onCelebrationTrigger: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  energy,
  energyMode,
  onCelebrationTrigger,
}) => {
  return (
    <header className="fixed top-4 left-4 z-40 flex items-center gap-3 pointer-events-auto">
      {/* Title & Cultural Subtitle */}
      <div className="glass-panel py-2 px-3.5 rounded-2xl flex items-center gap-3 shadow-lg border border-amber-400/30">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-400 flex items-center justify-center text-lg shadow-md shrink-0">
          🪔
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 
              className="text-lg md:text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow"
              style={{ fontFamily: "var(--font-festive)" }}
            >
              GARBA RAAT
            </h1>
            <span className="text-[10px] font-bold text-amber-300/90 hidden sm:inline px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30">
              નવરાત્રિ ૨૦૨૬
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 font-medium tracking-wide flex items-center gap-1.5">
            <span>Dance</span> • <span>Music</span> • <span>Navratri</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1 inline-block" />
          </p>
        </div>

        {/* Live Energy Gauge */}
        <div className="hidden lg:flex flex-col items-end pl-2 border-l border-white/10 text-[10px]">
          <span className="text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Flame size={12} className="text-orange-400" /> Ground Energy
          </span>
          <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 transition-all duration-100"
              style={{ width: `${Math.round(energy * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* "Ae Halo!" Group Clap Trigger Button */}
      <button
        onClick={onCelebrationTrigger}
        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 hover:from-yellow-300 hover:to-orange-300 shadow-lg shadow-amber-500/25 border border-yellow-200 active:scale-95 transition-all"
        title="Trigger Group Taali Celebration!"
      >
        <Sparkles size={14} className="text-amber-900" />
        <span>Ae Halo! 👏</span>
      </button>
    </header>
  );
};
