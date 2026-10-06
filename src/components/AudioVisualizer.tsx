import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, barCount = 8 }) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let animId: number;
    const dataArray = new Uint8Array(32);

    const update = () => {
      if (isPlaying) {
        audioEngine.getFrequencyData(dataArray);
        const step = Math.max(1, Math.floor(dataArray.length / barCount));

        for (let i = 0; i < barCount; i++) {
          const barEl = barsRef.current[i];
          if (!barEl) continue;

          const val = dataArray[i * step] || 0;
          const heightPct = Math.max(14, Math.min(100, Math.round((val / 255) * 100)));
          barEl.style.height = `${heightPct}%`;
          barEl.style.opacity = '0.95';
        }
      } else {
        const now = Date.now() / 320;
        for (let i = 0; i < barCount; i++) {
          const barEl = barsRef.current[i];
          if (!barEl) continue;

          const idleHeight = 14 + Math.sin(now + i * 0.8) * 6;
          barEl.style.height = `${idleHeight}%`;
          barEl.style.opacity = '0.45';
        }
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-end justify-center gap-1 h-6 px-1 py-0.5">
      {Array.from({ length: barCount }).map((_, i) => {
        const isCenter = Math.abs(i - barCount / 2) < 1.5;
        const barColor = isCenter
          ? 'linear-gradient(to top, #ff6d00, #ffea00)'
          : i % 2 === 0
          ? 'linear-gradient(to top, #10b981, #34d399)'
          : 'linear-gradient(to top, #06b6d4, #22d3ee)';

        return (
          <div
            key={i}
            ref={el => {
              barsRef.current[i] = el;
            }}
            className="w-1 rounded-t-sm visualizer-bar"
            style={{
              height: '14%',
              background: barColor,
              opacity: isPlaying ? 0.95 : 0.45,
            }}
          />
        );
      })}
    </div>
  );
};


