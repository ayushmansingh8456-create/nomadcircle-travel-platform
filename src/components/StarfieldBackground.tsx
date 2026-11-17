import { useEffect, useRef } from 'react';

const TOP_COLOR = '#090b10';
const BOTTOM_COLOR = '#020305';
const GLOW_RGB = '6, 182, 212';
const MAX_DPR = 2;
const PIXELS_PER_STAR = 2600;
const MIN_STARS = 120;
const MAX_STARS = 600;
const GLOW_SIZE = 64;

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
  twinkleSpeed: number;
  alpha: number;
}

function createStar(width: number, height: number): Star {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.4 + Math.random() * 1.2,
    speed: 4 + Math.random() * 16,
    drift: (Math.random() - 0.5) * 4,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.8 + Math.random() * 2.2,
    alpha: 0.4 + Math.random() * 0.6,
  };
}

function createGlowSprite(): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = GLOW_SIZE;
  sprite.height = GLOW_SIZE;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;
  const center = GLOW_SIZE / 2;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, `rgba(${GLOW_RGB}, 1)`);
  gradient.addColorStop(0.25, `rgba(${GLOW_RGB}, 0.5)`);
  gradient.addColorStop(1, `rgba(${GLOW_RGB}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GLOW_SIZE, GLOW_SIZE);
  return sprite;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const glow = createGlowSprite();
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let background: CanvasGradient | null = null;
    let frameId = 0;
    let lastTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      background = ctx.createLinearGradient(0, 0, 0, height);
      background.addColorStop(0, TOP_COLOR);
      background.addColorStop(1, BOTTOM_COLOR);

      const count = Math.min(MAX_STARS, Math.max(MIN_STARS, Math.round((width * height) / PIXELS_PER_STAR)));
      stars = Array.from({ length: count }, () => createStar(width, height));
    };

    const draw = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;

      ctx.fillStyle = background ?? BOTTOM_COLOR;
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        star.y -= star.speed * dt;
        star.x += star.drift * dt;
        if (star.y < -4) {
          star.y = height + 4;
          star.x = Math.random() * width;
        }
        if (star.x < -4) star.x = width + 4;
        else if (star.x > width + 4) star.x = -4;

        const twinkle = 0.55 + 0.45 * Math.sin((time / 1000) * star.twinkleSpeed + star.phase);
        const glowSize = star.radius * 8;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.drawImage(glow, star.x - glowSize / 2, star.y - glowSize / 2, glowSize, glowSize);

        ctx.fillStyle = '#d9fbff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
}
