import React from 'react';

interface FestivalDecorationsProps {
  energy: number;
  showLights: boolean;
}

export const FestivalDecorations: React.FC<FestivalDecorationsProps> = ({ energy, showLights }) => {
  if (!showLights) return null;

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-10 overflow-hidden">
      {/* Overhead Traditional Gujarati Marigold & Mango Leaf Toran */}
      <div className="w-full h-20 md:h-28 relative">
        <svg viewBox="0 0 1200 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id="toranRope" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffb300" />
              <stop offset="50%" stopColor="#ff6f00" />
              <stop offset="100%" stopColor="#ffd54f" />
            </linearGradient>
          </defs>

          {/* Draped Rope Swags */}
          <path
            d="M0,15 Q150,55 300,15 Q450,55 600,15 Q750,55 900,15 Q1050,55 1200,15"
            stroke="url(#toranRope)"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M0,22 Q150,62 300,22 Q450,62 600,22 Q750,62 900,22 Q1050,62 1200,22"
            stroke="#2e7d32"
            strokeWidth="2"
            fill="none"
          />

          {/* Hanging Marigold Flowers & Mango Leaves along the curve */}
          {Array.from({ length: 48 }).map((_, i) => {
            const x = (i * 1200) / 48 + 12;
            // Approximate y on catenary curve
            const swagIndex = Math.floor(x / 300);
            const localX = (x % 300) - 150;
            const y = 15 + (1 - (localX * localX) / 22500) * 40;

            const isMarigoldYellow = i % 2 === 0;
            return (
              <g key={i} className="lantern-sway" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${(i % 7) * 0.3}s` }}>
                {/* Mango Leaf Behind */}
                <path
                  d={`M${x},${y} Q${x - 6},${y + 18} ${x},${y + 26} Q${x + 6},${y + 18} ${x},${y}`}
                  fill="#2e7d32"
                  stroke="#1b5e20"
                  strokeWidth="0.8"
                />
                {/* Marigold Flower */}
                <circle cx={x} cy={y + 8} r="6.5" fill={isMarigoldYellow ? '#ffd600' : '#ff6d00'} />
                <circle cx={x} cy={y + 8} r="3.5" fill={isMarigoldYellow ? '#ffab00' : '#d50000'} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hanging Gujarati Akashdeep / Paper Lanterns (Kandils) */}
      <div className="absolute top-2 inset-x-0 flex justify-around px-4 md:px-16 pointer-events-none">
        {[
          { xOffset: 'left-6', color: '#ff2a7a', gold: '#ffd700', dur: '4.2s', delay: '0s' },
          { xOffset: 'left-1/4', color: '#ff9100', gold: '#fff176', dur: '3.6s', delay: '0.8s' },
          { xOffset: 'right-1/4', color: '#00e5ff', gold: '#ffd700', dur: '4.0s', delay: '0.4s' },
          { xOffset: 'right-6', color: '#7c4dff', gold: '#ffe082', dur: '3.8s', delay: '1.2s' },
        ].map((lantern, idx) => (
          <div
            key={idx}
            className="lantern-sway flex flex-col items-center"
            style={{
              animationDuration: lantern.dur,
              animationDelay: lantern.delay,
            }}
          >
            {/* Suspension String */}
            <div className="w-[1.5px] h-6 md:h-12 bg-amber-300/60" />

            {/* Glowing Lantern Diamond Body */}
            <div className="relative w-8 h-10 md:w-11 md:h-14">
              {/* Glow Aura */}
              <div
                className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"
                style={{
                  background: lantern.color,
                  opacity: 0.5 + energy * 0.45,
                }}
              />
              <svg viewBox="0 0 40 50" className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {/* Diamond Lantern Body */}
                <polygon
                  points="20,2 38,20 20,38 2,20"
                  fill={lantern.color}
                  stroke={lantern.gold}
                  strokeWidth="1.8"
                />
                {/* Central Star Cutout */}
                <polygon
                  points="20,12 23,18 29,20 23,22 20,28 17,22 11,20 17,18"
                  fill="#ffffff"
                  filter="drop-shadow(0 0 3px #ffffff)"
                />
                {/* Golden Cap Top & Bottom */}
                <polygon points="16,2 24,2 20,6" fill={lantern.gold} />
                <polygon points="16,38 24,38 20,34" fill={lantern.gold} />
              </svg>

              {/* Trailing Silk Ribbons / Tassels */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-6 h-8 flex justify-around">
                <div className="w-0.5 h-6 bg-pink-400 opacity-90 transform -rotate-6" />
                <div className="w-0.5 h-8 bg-yellow-300 opacity-90" />
                <div className="w-0.5 h-6 bg-cyan-400 opacity-90 transform rotate-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overhead Fairy Lights String */}
      <div className="absolute top-1 inset-x-0 h-8 flex justify-between px-2 opacity-85">
        {Array.from({ length: 28 }).map((_, i) => {
          const colors = ['#ff1744', '#ffea00', '#00e676', '#00e5ff', '#e040fb', '#ff9100'];
          const bulbColor = colors[i % colors.length];
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-[1px] h-2 bg-neutral-600" />
              <div
                className="w-2 h-2.5 rounded-full transition-transform duration-200"
                style={{
                  backgroundColor: bulbColor,
                  boxShadow: `0 0 ${4 + energy * 8}px ${bulbColor}`,
                  transform: `scale(${0.9 + (i % 2 === 0 ? energy * 0.4 : 0)})`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
