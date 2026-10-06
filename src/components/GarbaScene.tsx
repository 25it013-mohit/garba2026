import React, { useState } from 'react';
import { DancerData, GroundRipple } from '../types';
import { Background } from './Background';
import { GarbaGround } from './GarbaGround';
import { CentralGarbo } from './CentralGarbo';
import { DancerCircle } from './DancerCircle';
import { FestivalDecorations } from './FestivalDecorations';
import { LightingEffects } from './LightingEffects';
import { Particles } from './Particles';
import { audioEngine } from '../utils/audioEngine';

interface GarbaSceneProps {
  dancers: DancerData[];
  dancerCount: number;
  danceSpeed: number;
  energy: number;
  isPlaying: boolean;
  bpm: number;
  isBeatActive: boolean;
  showLights: boolean;
  showParticles: boolean;
  burstTrigger: { x: number; y: number; count?: number; color?: string } | null;
  onTriggerBurst: (burst: { x: number; y: number; count?: number; color?: string }) => void;
}

export const GarbaScene: React.FC<GarbaSceneProps> = ({
  dancers,
  dancerCount,
  danceSpeed,
  energy,
  isPlaying,
  bpm,
  isBeatActive,
  showLights,
  showParticles,
  burstTrigger,
  onTriggerBurst,
}) => {
  const [ripples, setRipples] = useState<GroundRipple[]>([]);

  // Ground Click Ripple Interaction
  const handleGroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rippleColors = ['#ffd700', '#ff4081', '#00e5ff', '#ff9100'];
    const newRipple: GroundRipple = {
      id: `ripple-${Date.now()}-${Math.random()}`,
      x,
      y,
      radius: 5,
      maxRadius: 65,
      color: rippleColors[Math.floor(Math.random() * rippleColors.length)],
      alpha: 0.85,
    };

    setRipples(prev => [...prev.slice(-4), newRipple]);

    let curR = 5;
    const interval = setInterval(() => {
      curR += 5;
      if (curR >= 65) {
        clearInterval(interval);
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      } else {
        setRipples(prev =>
          prev.map(r => (r.id === newRipple.id ? { ...r, radius: curR, alpha: 0.85 * (1 - curR / 65) } : r))
        );
      }
    }, 28);

    audioEngine.playDandiyaFX();

    onTriggerBurst({
      x: e.clientX,
      y: e.clientY,
      count: 12,
      color: newRipple.color,
    });
  };

  // Garbo Interaction: Aarti Blessing
  const handleGarboClick = () => {
    audioEngine.playBellFX();

    onTriggerBurst({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 20,
      count: 45,
      color: '#ffd700',
    });
  };

  // Dancer Click Interaction
  const handleDancerClick = (dancer: DancerData) => {
    if (dancer.role === 'dandiya') {
      audioEngine.playDandiyaFX();
    } else {
      audioEngine.playClapFX();
    }

    onTriggerBurst({
      x: window.innerWidth / 2 + Math.cos((dancer.baseAngle * Math.PI) / 180) * 140,
      y: window.innerHeight / 2 + Math.sin((dancer.baseAngle * Math.PI) / 180) * 95,
      count: 18,
      color: dancer.primaryColor,
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 1. Night Sky & Festival Skyline */}
      <Background energy={energy} />

      {/* 2. Hanging Torans & Akashdeep Lanterns */}
      <FestivalDecorations energy={energy} showLights={showLights} />

      {/* 3. Garba Circular Dancing Ground & Floor Diyas */}
      <GarbaGround
        energy={energy}
        ripples={ripples}
        onGroundClick={handleGroundClick}
        showDiyas={showLights}
      />

      {/* 4. Central Sacred Garbo / Garbi */}
      <CentralGarbo
        energy={energy}
        onGarboClick={handleGarboClick}
        isBeatActive={isBeatActive}
      />

      {/* 5. Circular Formation of Gujarati Dancers (Zero React render overhead) */}
      <DancerCircle
        dancers={dancers}
        dancerCount={dancerCount}
        danceSpeed={danceSpeed}
        energy={energy}
        isPlaying={isPlaying}
        bpm={bpm}
        isBeatActive={isBeatActive}
        onDancerClick={handleDancerClick}
      />

      {/* 6. Dynamic Stage Lighting & Beat Pulses */}
      <LightingEffects energy={energy} isPlaying={isPlaying} />

      {/* 7. Canvas Floating Particles */}
      <Particles energy={energy} enabled={showParticles} burstTrigger={burstTrigger} />
    </div>
  );
};
