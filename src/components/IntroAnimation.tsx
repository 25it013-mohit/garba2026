import React, { useEffect, useState } from 'react';
import { Sparkles, Play } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 0: Initial dark screen
    // 1: Center Diya ignites (700ms)
    // 2: Sacred Garbo illuminates & ground expands (1500ms)
    // 3: Dancers & lights awaken (2400ms)
    // 4: Complete transition (3200ms)
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 2200);
    const t4 = setTimeout(() => {
      setStep(4);
      setTimeout(onComplete, 500);
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 bg-[#070312] ${
        step === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Star Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {step >= 1 && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
            style={{
              width: step >= 2 ? '800px' : '200px',
              height: step >= 2 ? '800px' : '200px',
              background: 'radial-gradient(circle, rgba(255, 179, 0, 0.35) 0%, rgba(233, 30, 99, 0.15) 45%, transparent 75%)',
              filter: 'blur(35px)',
            }}
          />
        )}
      </div>

      {/* Center Sacred Diya Flare */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Diya Icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 transition-all duration-700 ${
            step >= 1
              ? 'scale-100 opacity-100 shadow-[0_0_50px_rgba(255,179,0,0.9)] bg-amber-500/20 border border-amber-400'
              : 'scale-50 opacity-0'
          }`}
        >
          🪔
        </div>

        {/* Traditional Welcome Typography */}
        <div
          className={`transition-all duration-700 transform ${
            step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="text-amber-400 font-bold text-sm tracking-widest uppercase mb-1">
            આવો પધારો • Welcome to
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 mb-2"
            style={{ fontFamily: 'var(--font-festive)' }}
          >
            GARBA RAAT
          </h1>
          <p className="text-xs md:text-sm text-neutral-300 tracking-wider">
            {step === 1 && 'Lighting the sacred Akhand Diya...'}
            {step === 2 && 'Decorating the holy Garbo ground...'}
            {step >= 3 && 'Khelaiyas taking their Garba circle!'}
          </p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex gap-2 mt-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step >= i ? 'bg-amber-400 scale-125 shadow-[0_0_8px_#ffca28]' : 'bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5"
      >
        <span>Skip Intro & Enter Ground</span>
        <Sparkles size={13} className="text-amber-400" />
      </button>
    </div>
  );
};
