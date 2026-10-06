import React from 'react';
import { GroundRipple } from '../types';

interface GarbaGroundProps {
  energy: number;
  ripples: GroundRipple[];
  onGroundClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  showDiyas: boolean;
}

export const GarbaGround: React.FC<GarbaGroundProps> = ({
  energy,
  ripples,
  onGroundClick,
  showDiyas,
}) => {
  // Generate perimeter Diyas placed using percentages so they scale on any viewport
  const diyaCount = 20;
  const diyaPoints = Array.from({ length: diyaCount }).map((_, i) => {
    const angle = (i * 360) / diyaCount;
    const rad = (angle * Math.PI) / 180;
    // Percentage radius around the elliptical ground
    const rxPct = 45.5; // percent from center
    const ryPct = 43.5;
    return {
      xPct: Math.cos(rad) * rxPct,
      yPct: Math.sin(rad) * ryPct,
      angle,
    };
  });

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-crosshair overflow-hidden pb-16 sm:pb-0"
      onClick={onGroundClick}
    >
      {/* 2.5D Tilted Ground Container */}
      <div
        className="relative w-[760px] h-[480px] max-w-[94vw] max-h-[70vh] rounded-[50%]"
        style={{
          boxShadow: `0 0 ${30 + energy * 30}px rgba(255, 179, 0, 0.25), inset 0 0 ${40 + energy * 30}px rgba(124, 77, 255, 0.2)`,
        }}
      >
        {/* Ground Base Texture */}
        <div
          className="absolute inset-0 rounded-[50%] overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #200e3f 0%, #15082b 55%, #090317 100%)',
            border: '2px solid rgba(255, 193, 7, 0.35)',
          }}
        >
          {/* Concentric Rings & Gujarati Mandala Pattern */}
          <svg className="w-full h-full opacity-75" viewBox="0 0 800 520" preserveAspectRatio="none">
            <defs>
              <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffb300" stopOpacity={0.25 + energy * 0.15} />
                <stop offset="40%" stopColor="#e91e63" stopOpacity={0.12 + energy * 0.08} />
                <stop offset="85%" stopColor="#7c4dff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#070312" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe082" />
                <stop offset="50%" stopColor="#ffb300" />
                <stop offset="100%" stopColor="#ff6f00" />
              </linearGradient>
            </defs>

            {/* Ambient Radial Fill */}
            <ellipse cx="400" cy="260" rx="390" ry="250" fill="url(#groundGlow)" />

            {/* Outer Decorative Ring */}
            <ellipse
              cx="400"
              cy="260"
              rx="360"
              ry="230"
              fill="none"
              stroke="url(#goldStroke)"
              strokeWidth="2.5"
              strokeDasharray="8 8"
            />
            <ellipse
              cx="400"
              cy="260"
              rx="345"
              ry="220"
              fill="none"
              stroke="#e91e63"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Middle Dancer Path Guideway */}
            <ellipse
              cx="400"
              cy="260"
              rx="280"
              ry="175"
              fill="none"
              stroke="url(#goldStroke)"
              strokeWidth={1.5 + energy}
              strokeDasharray="12 10"
              opacity={0.4 + energy * 0.3}
            />

            {/* Inner Rangoli Lotus Mandala */}
            <g opacity={0.5 + energy * 0.3} className="spin-slow" style={{ transformOrigin: '400px 260px' }}>
              <ellipse cx="400" cy="260" rx="180" ry="110" fill="none" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="6 6" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 360) / 12;
                const rad = (angle * Math.PI) / 180;
                const cx = 400 + Math.cos(rad) * 110;
                const cy = 260 + Math.sin(rad) * 68;
                return (
                  <ellipse
                    key={i}
                    cx={cx}
                    cy={cy}
                    rx="26"
                    ry="16"
                    fill="none"
                    stroke="#ff4081"
                    strokeWidth="1.2"
                    transform={`rotate(${angle} ${cx} ${cy})`}
                  />
                );
              })}
            </g>

            {/* Center Sacred Platform Rim */}
            <ellipse
              cx="400"
              cy="260"
              rx="90"
              ry="55"
              fill="#2d134d"
              stroke="url(#goldStroke)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Perimeter Glowing Floor Diyas */}
        {showDiyas && (
          <div className="absolute inset-0 pointer-events-none">
            {diyaPoints.map((pt, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{
                  left: `${50 + pt.xPct}%`,
                  top: `${50 + pt.yPct}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Diya Clay Base */}
                <div className="relative w-5 h-3.5 sm:w-7 sm:h-4.5">
                  <div
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full blur-[4px] pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 179, 0, 0.8) 0%, rgba(255, 87, 34, 0.4) 60%, transparent 80%)',
                      opacity: 0.75 + energy * 0.25,
                    }}
                  />
                  <svg viewBox="0 0 32 20" className="w-full h-full drop-shadow-md">
                    <path
                      d="M2,8 Q16,20 30,8 Q24,5 16,5 Q8,5 2,8 Z"
                      fill="#b7410e"
                      stroke="#ffcc80"
                      strokeWidth="0.8"
                    />
                    <path d="M4,7 Q16,13 28,7" stroke="#ffd700" strokeWidth="1" fill="none" />
                  </svg>
                  {/* Flickering Flame */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-4 flame-animated"
                    style={{
                      animationDelay: `${(idx % 4) * 0.12}s`,
                    }}
                  >
                    <svg viewBox="0 0 14 20" className="w-full h-full">
                      <path
                        d="M7,0 C10,6 14,9 14,14 C14,17.5 11,20 7,20 C3,20 0,17.5 0,14 C0,9 4,6 7,0 Z"
                        fill="#ff3d00"
                      />
                      <path
                        d="M7,4 C8.5,8 11,10 11,14 C11,16.5 9,18 7,18 C5,18 3,16.5 3,14 C3,10 5.5,8 7,4 Z"
                        fill="#ffea00"
                      />
                      <circle cx="7" cy="15" r="2" fill="#ffffff" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Ground Ripples on Click */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: `${ripple.radius * 2}px`,
              height: `${ripple.radius * 1.3}px`,
              border: `2px solid ${ripple.color}`,
              boxShadow: `0 0 12px ${ripple.color}`,
              opacity: ripple.alpha,
            }}
          />
        ))}
      </div>
    </div>
  );
};
