import React, { useEffect, useRef } from 'react';
import { DancerData } from '../types';
import { Dancer } from './Dancer';

interface DancerCircleProps {
  dancers: DancerData[];
  dancerCount: number;
  danceSpeed: number; // 0.5 to 2.0
  energy: number; // 0.0 to 1.0
  isPlaying: boolean;
  bpm: number;
  isBeatActive: boolean;
  onDancerClick: (dancer: DancerData) => void;
}

export const DancerCircle: React.FC<DancerCircleProps> = ({
  dancers,
  dancerCount,
  danceSpeed,
  energy,
  isPlaying,
  bpm,
  isBeatActive,
  onDancerClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dancerNodesRef = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Dynamic dance tempo computation (seconds per 2-step loop)
  const currentBpm = bpm > 60 && bpm < 200 ? bpm : 124;
  const stepDurationSec = Math.max(0.7, Math.min(2.2, (60 / currentBpm) * 2 / danceSpeed));

  // Direct RAF animation loop without calling setState (100% zero React re-render overhead!)
  useEffect(() => {
    let animId: number;
    let groupAngle = 0;
    let lastTime = performance.now();

    const updatePositions = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!containerRef.current) {
        animId = requestAnimationFrame(updatePositions);
        return;
      }

      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const cx = w / 2;
      const cy = h / 2;

      // Mobile responsive radii
      const isMobile = w < 640;
      const isTablet = w >= 640 && w < 1024;

      const rx = isMobile ? Math.min(cx * 0.78, 160) : isTablet ? Math.min(cx * 0.72, 230) : Math.min(cx * 0.72, 280);
      const ry = isMobile ? Math.min(cy * 0.52, 105) : isTablet ? Math.min(cy * 0.52, 145) : Math.min(cy * 0.55, 175);

      // Rotate Garba circle progression
      const rotationSpeed = (isPlaying ? 7.5 : 2.5) * danceSpeed * (0.8 + energy * 0.4);
      groupAngle = (groupAngle + delta * rotationSpeed) % 360;

      // Position each active dancer directly on DOM
      const activeSubset = dancers.slice(0, dancerCount);
      for (let i = 0; i < activeSubset.length; i++) {
        const d = activeSubset[i];
        const el = dancerNodesRef.current[d.id];
        if (!el) continue;

        const baseAngle = (i * 360) / activeSubset.length;
        const currentAngle = (baseAngle + groupAngle) % 360;
        const rad = (currentAngle * Math.PI) / 180;

        const x = cx + Math.cos(rad) * rx;
        const y = cy + Math.sin(rad) * ry;

        // 2.5D Depth perspective:
        // top/back (sin = -1) -> depthScale ~ 0.78; bottom/front (sin = +1) -> depthScale ~ 1.15
        const normalizedY = Math.sin(rad);
        const depthScale = isMobile
          ? 0.68 + (normalizedY + 1) * 0.16
          : 0.84 + (normalizedY + 1) * 0.18;

        const scale = d.scale * depthScale;
        const zIndex = Math.round(y + 100);

        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -85%) scale(${scale.toFixed(3)})`;
        el.style.zIndex = `${zIndex}`;
      }

      animId = requestAnimationFrame(updatePositions);
    };

    animId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animId);
  }, [dancerCount, danceSpeed, energy, isPlaying, dancers]);

  // Set CSS custom property for dance tempo on container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--dance-tempo', `${stepDurationSec.toFixed(2)}s`);
    }
  }, [stepDurationSec]);

  const activeDancers = dancers.slice(0, dancerCount);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        ['--dance-tempo' as string]: `${stepDurationSec.toFixed(2)}s`,
      }}
    >
      {activeDancers.map(dancer => (
        <div
          key={dancer.id}
          ref={el => {
            dancerNodesRef.current[dancer.id] = el;
          }}
          className="dancer-wrapper pointer-events-auto"
        >
          <Dancer
            dancer={dancer}
            onDancerClick={onDancerClick}
            isBeatActive={isBeatActive}
          />
        </div>
      ))}
    </div>
  );
};
