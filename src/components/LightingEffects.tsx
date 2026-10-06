import React from 'react';

interface LightingEffectsProps {
  energy: number;
  isPlaying: boolean;
}

export const LightingEffects: React.FC<LightingEffectsProps> = ({ energy, isPlaying }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Central Sacred Spotlight on Garbo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
        style={{
          width: `${380 + energy * 180}px`,
          height: `${280 + energy * 140}px`,
          background: `radial-gradient(ellipse at 50% 50%, rgba(255, 193, 7, ${0.15 + energy * 0.15}) 0%, rgba(233, 30, 99, ${0.08 + energy * 0.08}) 50%, transparent 80%)`,
          filter: 'blur(35px)',
        }}
      />

      {/* Rhythmic Ambient Ground Pulse (tasteful, non-jarring) */}
      {isPlaying && (
        <div
          className="absolute inset-0 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255, 179, 0, ${energy * 0.09}) 0%, transparent 65%)`,
            opacity: 0.7 + energy * 0.3,
          }}
        />
      )}

      {/* Stage Corner Festival Floodlights */}
      <div
        className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #ff2a7a 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00e5ff 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
