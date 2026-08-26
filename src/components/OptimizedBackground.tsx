import React, { useEffect, useRef } from 'react';

interface GoldenDustParticle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  twinkleDepth: number;
  color: string;
  glowColor: string;
  isBokeh: boolean;
  driftVx: number;
  driftVy: number;
  swayAngle: number;
  swaySpeed: number;
  swayRadius: number;
}

export const OptimizedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
      initDust();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Warm, delicate golden dust & champagne stardust palette (soft round glowing particles)
    const dustColors = [
      { main: '#FFE6A0', glow: 'rgba(255, 230, 160, 0.7)' },
      { main: '#F5D77F', glow: 'rgba(245, 215, 127, 0.65)' },
      { main: '#D4AF37', glow: 'rgba(212, 175, 55, 0.6)' },
      { main: '#FFF9E6', glow: 'rgba(255, 249, 230, 0.75)' },
      { main: '#E8C582', glow: 'rgba(232, 197, 130, 0.65)' },
    ];

    let dustParticles: GoldenDustParticle[] = [];

    const initDust = () => {
      const area = width * height;
      // Gentle density: fine shimmering golden dust specks
      const count = Math.min(95, Math.max(50, Math.floor(area / 14000)));
      dustParticles = [];

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        const isBokeh = rand < 0.25; // 25% soft floating warm bokeh orbs
        const size = isBokeh ? 2.2 + Math.random() * 2.8 : 0.6 + Math.random() * 1.2;
        const colorObj = dustColors[Math.floor(Math.random() * dustColors.length)];

        // Gentle floating speed (poetic, soft upward drifting stardust)
        const driftSpeed = 0.05 + Math.random() * 0.08;
        const driftAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;

        dustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseAlpha: isBokeh ? 0.15 + Math.random() * 0.25 : 0.35 + Math.random() * 0.45,
          alpha: 0.5,
          twinkleSpeed: 0.008 + Math.random() * 0.018,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleDepth: isBokeh ? 0.15 + Math.random() * 0.2 : 0.25 + Math.random() * 0.35,
          color: colorObj.main,
          glowColor: colorObj.glow,
          isBokeh,
          driftVx: Math.cos(driftAngle) * driftSpeed,
          driftVy: Math.sin(driftAngle) * driftSpeed,
          swayAngle: Math.random() * Math.PI * 2,
          swaySpeed: 0.005 + Math.random() * 0.01,
          swayRadius: 4 + Math.random() * 8,
        });
      }
    };

    initDust();

    let lastFrameTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastFrameTime) / 1000, 0.1);
      lastFrameTime = time;

      // Soft mouse easing for gentle depth parallax
      mouseX += (targetMouseX - mouseX) * 0.02;
      mouseY += (targetMouseY - mouseY) * 0.02;
      const offsetX = (mouseX / width - 0.5) * 12;
      const offsetY = (mouseY / height - 0.5) * 12;

      ctx.clearRect(0, 0, width, height);

      // Render gentle glowing golden dust & bokeh
      for (let i = 0; i < dustParticles.length; i++) {
        const p = dustParticles[i];

        // Soft breathing twinkle
        p.twinklePhase += p.twinkleSpeed;
        const sineWave = Math.sin(p.twinklePhase);
        p.alpha = p.baseAlpha + sineWave * p.twinkleDepth;
        p.alpha = Math.max(0.05, Math.min(0.95, p.alpha));

        // Gentle organic sway
        p.swayAngle += p.swaySpeed;
        const swayX = Math.cos(p.swayAngle) * p.swayRadius;
        const swayY = Math.sin(p.swayAngle) * (p.swayRadius * 0.5);

        p.x += p.driftVx * (dt * 60);
        p.y += p.driftVy * (dt * 60);

        // Seamless boundary wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const renderX = p.x + swayX + offsetX * (p.isBokeh ? 0.3 : 0.15);
        const renderY = p.y + swayY + offsetY * (p.isBokeh ? 0.3 : 0.15);

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.isBokeh) {
          // Soft out-of-focus golden bokeh orb (pure round glowing circle)
          const grad = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, p.size * 2);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.5, p.glowColor);
          grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Tiny round stardust point with subtle warm aura
          ctx.shadowBlur = p.size * 3.5;
          ctx.shadowColor = p.glowColor;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#060608]"
    >
      {/* 1. Crystal-Clear Ultra-HD Luxury Silk & Gold Jewelry Wallpaper */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(max-width: 768px)" srcSet={`${import.meta.env.BASE_URL}luxury_background_mobile.jpg`} />
        <img
          src={`${import.meta.env.BASE_URL}luxury_background.jpg`}
          alt=""
          className="w-full h-full object-cover object-[75%_25%] select-none pointer-events-none transition-opacity duration-700 contrast-[1.08] brightness-[1.05]"
          style={{
            opacity: 0.96,
          }}
        />
      </picture>

      {/* 2. Delicate Cinematic Vignette (Preserves brilliant jewelry on edges with ultra clarity) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(6, 6, 8, 0.12) 0%, rgba(6, 6, 8, 0.38) 65%, rgba(6, 6, 8, 0.68) 100%)',
        }}
      />

      {/* 3. Subtle Warm Golden Ambient Glows */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, #D4AF37 0%, rgba(212,175,55,0.12) 50%, rgba(0,0,0,0) 75%)',
          filter: 'blur(75px)',
        }}
      />

      {/* 4. Fine Golden Stardust & Bokeh Floating Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
