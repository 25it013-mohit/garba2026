import React, { useEffect, useRef } from 'react';
import { ParticleItem } from '../types';

interface ParticlesProps {
  energy: number;
  enabled: boolean;
  burstTrigger?: { x: number; y: number; count?: number; color?: string } | null;
}

export const Particles: React.FC<ParticlesProps> = ({ energy, enabled, burstTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleItem[]>([]);
  const prevBurstRef = useRef<typeof burstTrigger>(null);

  // Trigger burst if burstTrigger changed
  useEffect(() => {
    if (burstTrigger && burstTrigger !== prevBurstRef.current) {
      prevBurstRef.current = burstTrigger;
      const count = Math.min(32, burstTrigger.count || 20);
      const baseColor = burstTrigger.color;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4.5;
        const colors = baseColor
          ? [baseColor, '#ffd700', '#ffffff', '#ff6d00']
          : ['#ffd700', '#ff2a7a', '#00e5ff', '#ff9100', '#76ff03', '#ffffff'];

        particlesRef.current.push({
          x: burstTrigger.x,
          y: burstTrigger.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: 2.5 + Math.random() * 3.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: Math.random() > 0.5 ? 'petal' : 'spark',
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.12,
          life: 0,
          maxLife: 35 + Math.random() * 30,
        });
      }
    }
  }, [burstTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 640;
    const maxParticles = isMobile ? 35 : 55;

    // Initial ambient pool
    particlesRef.current = Array.from({ length: isMobile ? 20 : 35 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.3 - Math.random() * 0.6,
      size: 2 + Math.random() * 3,
      alpha: 0.3 + Math.random() * 0.5,
      color: ['#ffd700', '#ffa000', '#ff5722', '#ff80ab'][Math.floor(Math.random() * 4)],
      shape: Math.random() > 0.6 ? 'petal' : 'circle',
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.04,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 60,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (enabled && !document.hidden) {
        // Controlled spawn rate
        if (Math.random() < 0.2 + energy * 0.3 && particlesRef.current.length < maxParticles) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            vx: (Math.random() - 0.5) * 1,
            vy: -0.6 - Math.random() * (1 + energy),
            size: 2 + Math.random() * 3,
            alpha: 0.75,
            color: ['#ffd700', '#ffa000', '#ff4081', '#00e5ff'][Math.floor(Math.random() * 4)],
            shape: Math.random() > 0.5 ? 'petal' : 'spark',
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.06,
            life: 0,
            maxLife: 80 + Math.random() * 50,
          });
        }

        // Draw and update
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.life++;

          if (p.shape === 'petal') {
            p.x += Math.sin(p.rotation) * 0.4;
          }

          const progress = p.life / p.maxLife;
          const currentAlpha = p.alpha * (1 - progress);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, currentAlpha);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'petal') {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'spark') {
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.3);
            ctx.lineTo(p.size * 0.4, 0);
            ctx.lineTo(0, p.size * 1.3);
            ctx.lineTo(-p.size * 0.4, 0);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();

          if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
            particlesRef.current.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, energy]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />;
};
