import React, { useState } from 'react';

interface CentralGarboProps {
  energy: number;
  onGarboClick: () => void;
  isBeatActive?: boolean;
}

export const CentralGarbo: React.FC<CentralGarboProps> = ({
  energy,
  onGarboClick,
  isBeatActive = false,
}) => {
  const [clickedEffect, setClickedEffect] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickedEffect(true);
    onGarboClick();
    setTimeout(() => setClickedEffect(false), 900);
  };

  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center clickable-garbo pb-16 sm:pb-0 ${
        isBeatActive ? 'scale-105 transition-transform duration-100' : ''
      }`}
      onClick={handleClick}
      title="Click the Sacred Garbo for Aarti Blessing!"
    >
      {/* Divine Sacred Radial Light Halo */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-300 garbo-glow-ring"
        style={{
          width: `${140 + energy * 80 + (clickedEffect ? 60 : 0)}px`,
          height: `${140 + energy * 80 + (clickedEffect ? 60 : 0)}px`,
          background: clickedEffect
            ? 'radial-gradient(circle, rgba(255, 235, 59, 0.9) 0%, rgba(255, 152, 0, 0.6) 40%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255, 193, 7, 0.65) 0%, rgba(255, 111, 0, 0.35) 45%, transparent 80%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Floating Aarti Blessing Badge */}
      {clickedEffect && (
        <div className="absolute -top-14 z-50 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 text-white font-bold text-[11px] tracking-wider shadow-lg animate-bounce border border-yellow-200">
          ✨ જય મા અંબે • AARTI BLESSING! ✨
        </div>
      )}

      {/* Main Garbo Structure Container */}
      <div
        className="relative w-30 h-40 sm:w-38 sm:h-50 md:w-42 md:h-54 flex flex-col items-center justify-end transition-transform duration-300"
        style={{
          transform: clickedEffect ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* Akhand Jyot Flame (Top Center) */}
        <div className="absolute -top-6 sm:-top-8 z-30 flex flex-col items-center">
          <div
            className="absolute -inset-2.5 rounded-full blur-sm"
            style={{
              background: 'radial-gradient(circle, #fff740 0%, #ff6d00 60%, transparent 80%)',
              opacity: 0.85 + energy * 0.2,
            }}
          />
          <div className="w-7 h-10 sm:w-9 sm:h-12 flame-animated">
            <svg viewBox="0 0 24 36" className="w-full h-full drop-shadow-[0_0_8px_#ffea00]">
              <path
                d="M12,0 C17,10 24,16 24,25 C24,31 18.6,36 12,36 C5.4,36 0,31 0,25 C0,16 7,10 12,0 Z"
                fill="url(#garboFlameGrad)"
              />
              <path
                d="M12,7 C15,14 19,18 19,25 C19,29.5 15.8,33 12,33 C8.2,33 5,29.5 5,25 C5,18 9,14 12,7 Z"
                fill="#ffea00"
              />
              <ellipse cx="12" cy="27" rx="3" ry="5" fill="#ffffff" />
              <ellipse cx="12" cy="33" rx="3.5" ry="1.5" fill="#29b6f6" opacity="0.8" />
              <defs>
                <linearGradient id="garboFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffea00" />
                  <stop offset="35%" stopColor="#ff9100" />
                  <stop offset="75%" stopColor="#ff3d00" />
                  <stop offset="100%" stopColor="#d50000" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Kalash Top: Coconut Shreefal + Mango Leaves */}
        <div className="absolute top-2 z-20 w-14 h-12 sm:w-18 sm:h-15 flex items-center justify-center">
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <path d="M40,25 Q20,10 10,18 Q25,28 40,28" fill="#2e7d32" stroke="#1b5e20" strokeWidth="0.8" />
            <path d="M40,25 Q60,10 70,18 Q55,28 40,28" fill="#2e7d32" stroke="#1b5e20" strokeWidth="0.8" />
            <path d="M40,22 Q30,0 22,6 Q32,18 40,22" fill="#388e3c" stroke="#1b5e20" strokeWidth="0.8" />
            <path d="M40,22 Q50,0 58,6 Q48,18 40,22" fill="#388e3c" stroke="#1b5e20" strokeWidth="0.8" />
            <path d="M40,18 Q40,-2 40,-4 Q43,8 40,18" fill="#4caf50" stroke="#1b5e20" strokeWidth="0.8" />

            <ellipse cx="40" cy="20" rx="13" ry="15" fill="#6d4c41" stroke="#4e342e" strokeWidth="1" />
            <path d="M28,16 Q40,22 52,16" stroke="#d50000" strokeWidth="2.2" fill="none" />
            <path d="M28,21 Q40,27 52,21" stroke="#ffd700" strokeWidth="1.8" fill="none" />
            <circle cx="40" cy="12" r="2.2" fill="#d50000" />
            <circle cx="40" cy="12" r="0.8" fill="#fff" />
          </svg>
        </div>

        {/* Earthen Decorated Garbo Pot with Perforations */}
        <div className="relative z-10 w-28 h-30 sm:w-36 sm:h-38">
          <svg viewBox="0 0 160 170" className="w-full h-full drop-shadow-xl">
            <defs>
              <radialGradient id="clayGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#e26d38" />
                <stop offset="60%" stopColor="#b24119" />
                <stop offset="100%" stopColor="#672007" />
              </radialGradient>
              <radialGradient id="innerLampGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#fff176" />
                <stop offset="80%" stopColor="#ff9800" />
                <stop offset="100%" stopColor="#ff5722" />
              </radialGradient>
              <linearGradient id="potGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffe082" />
                <stop offset="50%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#ff8f00" />
              </linearGradient>
            </defs>

            {/* Neck of Pot */}
            <path
              d="M52,38 Q80,44 108,38 L104,50 Q80,56 56,50 Z"
              fill="url(#potGold)"
              stroke="#ffd54f"
              strokeWidth="1.5"
            />

            {/* Main Rounded Pot Body */}
            <path
              d="M54,48 C28,68 18,105 32,136 C42,154 62,165 80,165 C98,165 118,154 128,136 C142,105 132,68 106,48 Z"
              fill="url(#clayGrad)"
              stroke="#ffd700"
              strokeWidth="1.8"
            />

            {/* Traditional Patterns */}
            <path d="M40,70 Q80,84 120,70" stroke="url(#potGold)" strokeWidth="2.5" fill="none" />
            <path d="M34,88 Q80,105 126,88" stroke="#ff4081" strokeWidth="1.8" fill="none" strokeDasharray="3 3" />

            {/* Perforations Emitting Golden Light */}
            <g fill="url(#innerLampGlow)">
              <polygon points="80,95 87,105 80,115 73,105" />
              <polygon points="62,98 67,106 62,114 57,106" />
              <polygon points="98,98 103,106 98,114 93,106" />
              <circle cx="80" cy="85" r="4" />
              <circle cx="80" cy="125" r="4" />
              <circle cx="50" cy="112" r="3" />
              <circle cx="110" cy="112" r="3" />
              <circle cx="68" cy="125" r="3" />
              <circle cx="92" cy="125" r="3" />

              <path d="M76,140 Q80,132 84,140 Q80,146 76,140 Z" />
              <path d="M58,136 Q62,129 66,136 Q62,142 58,136 Z" />
              <path d="M94,136 Q98,129 102,136 Q98,142 94,136 Z" />
            </g>

            {/* Mirror Silver Dots */}
            {[
              { cx: 48, cy: 78 },
              { cx: 64, cy: 82 },
              { cx: 80, cy: 83 },
              { cx: 96, cy: 82 },
              { cx: 112, cy: 78 },
            ].map((dot, i) => (
              <circle key={i} cx={dot.cx} cy={dot.cy} r="2.5" fill="#ffffff" stroke="#ffd700" strokeWidth="0.8" />
            ))}
          </svg>
        </div>

        {/* Marigold Flower Garland Base */}
        <div className="absolute -bottom-2.5 z-20 w-36 sm:w-46 h-8 flex items-center justify-center">
          <svg viewBox="0 0 200 40" className="w-full h-full drop-shadow-md">
            {Array.from({ length: 12 }).map((_, i) => {
              const cx = 22 + i * 14;
              const cy = 20 + Math.sin(i * 0.5) * 3;
              const isYellow = i % 2 === 0;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="7" fill={isYellow ? '#ffd600' : '#ff6d00'} />
                  <circle cx={cx} cy={cy} r="4.5" fill={isYellow ? '#ffab00' : '#d50000'} />
                  <circle cx={cx} cy={cy} r="2" fill="#fff" opacity="0.6" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

