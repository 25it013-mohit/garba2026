import React from 'react';

interface BackgroundProps {
  energy: number;
}

export const Background: React.FC<BackgroundProps> = ({ energy }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Night Sky Gradient with Deep Space Shimmer */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, rgba(58, 22, 110, ${0.4 + energy * 0.2}) 0%, rgba(19, 7, 43, 0.85) 60%, rgba(7, 3, 18, 0.98) 100%)`
        }}
      />

      {/* Twinkling Stars */}
      <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#ffe57f" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Fixed decorative stars */}
        {[
          { cx: '8%', cy: '12%', r: 1.5, dur: '3.2s' },
          { cx: '15%', cy: '8%', r: 2.2, dur: '2.5s' },
          { cx: '24%', cy: '18%', r: 1.2, dur: '4.1s' },
          { cx: '35%', cy: '10%', r: 1.8, dur: '3.5s' },
          { cx: '48%', cy: '15%', r: 2.5, dur: '2.8s' },
          { cx: '62%', cy: '7%', r: 1.4, dur: '4.5s' },
          { cx: '75%', cy: '14%', r: 2.0, dur: '3.0s' },
          { cx: '88%', cy: '9%', r: 1.6, dur: '2.4s' },
          { cx: '92%', cy: '22%', r: 2.2, dur: '3.8s' },
          { cx: '12%', cy: '28%', r: 1.2, dur: '3.1s' },
          { cx: '82%', cy: '30%', r: 1.5, dur: '4.2s' },
          { cx: '4%', cy: '40%', r: 1.8, dur: '2.9s' },
          { cx: '96%', cy: '42%', r: 1.4, dur: '3.6s' },
        ].map((star, i) => (
          <circle
            key={i}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="url(#starGlow)"
          >
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur={star.dur}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Radiant Crescent Moon with Navratri Divine Aura */}
      <div 
        className="absolute top-6 right-12 md:right-24 w-20 h-20 md:w-28 md:h-28 transition-transform duration-1000"
        style={{
          transform: `scale(${1 + energy * 0.08})`
        }}
      >
        {/* Soft Moon Halo */}
        <div 
          className="absolute inset-0 rounded-full blur-xl transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(255, 235, 150, 0.4) 0%, rgba(255, 179, 0, 0.15) 50%, transparent 70%)',
            transform: `scale(${1.6 + energy * 0.4})`
          }}
        />
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,235,150,0.8)]">
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffde7" />
              <stop offset="60%" stopColor="#ffe082" />
              <stop offset="100%" stopColor="#ffb300" />
            </linearGradient>
            <mask id="crescentMask">
              <rect width="100" height="100" fill="white" />
              <circle cx="56" cy="40" r="36" fill="black" />
            </mask>
          </defs>
          <circle cx="48" cy="50" r="38" fill="url(#moonGrad)" mask="url(#crescentMask)" />
        </svg>
      </div>

      {/* Distant Pandal/Festival Shamiana Silhouettes at Horizon */}
      <div className="absolute bottom-0 inset-x-0 h-44 opacity-25 flex items-end justify-between px-2">
        <svg viewBox="0 0 1200 140" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path
            d="M0,140 L0,95 Q100,50 200,95 Q300,45 400,95 Q500,60 600,95 Q700,40 800,95 Q900,55 1000,95 Q1100,45 1200,95 L1200,140 Z"
            fill="#090417"
          />
          {/* Decorative temple shikhar / pandal peaks */}
          <polygon points="120,95 130,40 140,95" fill="#13092b" />
          <polygon points="350,95 365,25 380,95" fill="#13092b" />
          <polygon points="680,95 695,30 710,95" fill="#13092b" />
          <polygon points="920,95 935,35 950,95" fill="#13092b" />
          <polygon points="1110,95 1120,45 1130,95" fill="#13092b" />
          {/* Flags on peaks */}
          <path d="M130,40 L145,46 L130,52 Z" fill="#ff6d00" />
          <path d="M365,25 L385,32 L365,40 Z" fill="#e91e63" />
          <path d="M695,30 L715,38 L695,46 Z" fill="#ffb300" />
          <path d="M935,35 L955,42 L935,50 Z" fill="#00e5ff" />
        </svg>
      </div>

      {/* Ambient Moving Colored Spotlights */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-[800px] pointer-events-none sweeping-beam blur-2xl opacity-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(255, 64, 129, 0.4) 0%, rgba(255, 179, 0, 0.1) 60%, transparent 95%)',
          animationDuration: '10s'
        }}
      />
      <div 
        className="absolute top-0 right-1/4 w-96 h-[800px] pointer-events-none sweeping-beam blur-2xl opacity-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 229, 255, 0.35) 0%, rgba(124, 77, 255, 0.15) 60%, transparent 95%)',
          animationDuration: '12s',
          animationDirection: 'reverse'
        }}
      />
    </div>
  );
};
