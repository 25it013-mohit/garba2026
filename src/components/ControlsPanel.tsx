import React, { useState } from 'react';
import { Settings, Sliders, Moon, Flame, Zap, Sparkles, Bell, Volume2, EyeOff, X } from 'lucide-react';
import { EnergyMode } from '../types';

interface ControlsPanelProps {
  energyMode: EnergyMode;
  onSetEnergyMode: (mode: EnergyMode) => void;
  danceSpeed: number;
  onSetDanceSpeed: (speed: number) => void;
  dancerCount: number;
  onSetDancerCount: (count: number) => void;
  showLights: boolean;
  onToggleLights: () => void;
  showParticles: boolean;
  onToggleParticles: () => void;
  soundFxEnabled: boolean;
  onToggleSoundFx: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  energyMode,
  onSetEnergyMode,
  danceSpeed,
  onSetDanceSpeed,
  dancerCount,
  onSetDancerCount,
  showLights,
  onToggleLights,
  showParticles,
  onToggleParticles,
  soundFxEnabled,
  onToggleSoundFx,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-40">
      {/* Toggle Open Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-panel p-2.5 rounded-full text-white shadow-xl transition-all duration-200 flex items-center gap-2 ${
          isOpen ? 'bg-amber-400 text-black border-amber-300' : 'hover:border-amber-400/80 hover:scale-105'
        }`}
        title="Festival Ground Controls"
        aria-label="Open settings panel"
      >
        <Sliders size={18} className={isOpen ? 'text-black' : 'text-amber-400'} />
        <span className="hidden sm:inline text-xs font-semibold pr-1">Festival Controls</span>
      </button>

      {/* Settings Modal / Popover */}
      {isOpen && (
        <div className="mt-3 w-80 glass-panel rounded-2xl p-4 text-white shadow-2xl border border-amber-400/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
              <Sparkles size={16} />
              Ground Energy & Settings
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-white"
              aria-label="Close settings"
            >
              <X size={16} />
            </button>
          </div>

          {/* Festival Mode Presets */}
          <div className="my-3.5">
            <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Festival Mood
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => onSetEnergyMode('chill')}
                className={`py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  energyMode === 'chill'
                    ? 'bg-gradient-to-b from-indigo-500 to-purple-600 text-white shadow-md border border-indigo-300'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                }`}
              >
                <Moon size={14} />
                <span>Chill</span>
              </button>

              <button
                onClick={() => onSetEnergyMode('garba')}
                className={`py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  energyMode === 'garba'
                    ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-black font-semibold shadow-md border border-amber-300'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                }`}
              >
                <Flame size={14} className={energyMode === 'garba' ? 'text-black' : 'text-amber-400'} />
                <span>Garba</span>
              </button>

              <button
                onClick={() => onSetEnergyMode('dhoom')}
                className={`py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  energyMode === 'dhoom'
                    ? 'bg-gradient-to-b from-rose-500 to-amber-500 text-white font-bold shadow-md border border-rose-300'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                }`}
              >
                <Zap size={14} className="text-yellow-300" />
                <span>Dhoom!</span>
              </button>
            </div>
          </div>

          {/* Dance Speed Slider */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
              <span>Dance Rhythm Speed</span>
              <span className="font-mono text-amber-400">{danceSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={danceSpeed}
              onChange={e => onSetDanceSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Dancers in Circle Slider */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
              <span>Dancers in Circle</span>
              <span className="font-mono text-amber-400">{dancerCount} khelaiyas</span>
            </div>
            <input
              type="range"
              min="8"
              max="16"
              step="2"
              value={dancerCount}
              onChange={e => onSetDancerCount(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>

          {/* Quick Toggles */}
          <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
            <label className="flex items-center justify-between cursor-pointer text-neutral-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Flame size={14} className="text-amber-400" />
                Diyas & Fairy Lights
              </span>
              <input
                type="checkbox"
                checked={showLights}
                onChange={onToggleLights}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-neutral-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-pink-400" />
                Golden Spark Particles
              </span>
              <input
                type="checkbox"
                checked={showParticles}
                onChange={onToggleParticles}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-neutral-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Bell size={14} className="text-yellow-400" />
                Taali & Aarti Sound FX
              </span>
              <input
                type="checkbox"
                checked={soundFxEnabled}
                onChange={onToggleSoundFx}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-neutral-300 hover:text-white">
              <span className="flex items-center gap-2">
                <EyeOff size={14} className="text-blue-300" />
                Reduced Motion
              </span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={onToggleReducedMotion}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
