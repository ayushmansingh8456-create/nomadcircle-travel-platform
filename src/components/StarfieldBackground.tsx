import { useEffect, useRef } from 'react';
import { PLANETS, SUN, ORBIT_TILT, type Planet } from '@/data/solarSystem';

const TAU = Math.PI * 2;
const MAX_DPR = 2;
const BACKGROUND_STAR_COUNT = 240;
const TOP_COLOR = '#090b10';
const BOTTOM_COLOR = '#020305';
const ORBIT_COLOR = 'rgba(6, 182, 212, 0.14)';
const RING_SQUASH = 0.3;

interface BackgroundStar {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface Body {
  planet: Planet;
  angle: number;
  spin: number;
}

interface Layout {
  cx: number;
  cy: number;
  rmax: number;
  unit: number;
}

function createBackgroundStars(): BackgroundStar[] {
  return Array.from({ length: BACKGROUND_STAR_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: 0.3 + Math.random() * 0.8,
    alpha: 0.2 + Math.random() * 0.5,
  }));
}

function renderBackground(width: number, height: number, dpr: number, stars: BackgroundStar[]): HTMLCanvasElement {
  const layer = document.createElement('canvas');
  layer.width = Math.floor(width * dpr);
  layer.height = Math.floor(height * dpr);
  const ctx = layer.getContext('2d');
  if (!ctx) return layer;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, TOP_COLOR);
  gradient.addColorStop(1, BOTTOM_COLOR);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#d9fbff';
  for (const star of stars) {
    ctx.globalAlpha = star.alpha;
    ctx.beginPath();
    ctx.arc(star.x * width, star.y * height, star.radius, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return layer;
}

function computeLayout(width: number, height: number): Layout {
  const rmax = Math.min(width * 0.46, (height * 0.46) / ORBIT_TILT);
  const unit = Math.min(1.5, Math.max(0.55, rmax / 420));
  return { cx: width / 2, cy: height / 2, rmax, unit };
}

function drawOrbit(ctx: CanvasRenderingContext2D, layout: Layout, orbit: number) {
  const rx = orbit * layout.rmax;
  ctx.beginPath();
  ctx.ellipse(layout.cx, layout.cy, rx, rx * ORBIT_TILT, 0, 0, TAU);
  ctx.strokeStyle = ORBIT_COLOR;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawRing(ctx: CanvasRenderingContext2D, planet: Planet, x: number, y: number, radius: number, part: 'back' | 'front') {
  const ring = planet.ring;
  if (!ring) return;
  const midRadius = radius * (ring.inner + ring.outer) / 2;
  const thickness = radius * (ring.outer - ring.inner);
  const [start, end] = part === 'back' ? [Math.PI, TAU] : [0, Math.PI];
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, RING_SQUASH);
  ctx.strokeStyle = ring.color;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.arc(0, 0, midRadius, start, end);
  ctx.stroke();
  ctx.restore();
}

function drawPlanet(ctx: CanvasRenderingContext2D, planet: Planet, x: number, y: number, radius: number, spin: number) {
  drawRing(ctx, planet, x, y, radius, 'back');

  const gradient = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, radius * 0.1, x, y, radius);
  gradient.addColorStop(0, planet.colors.light);
  gradient.addColorStop(0.55, planet.colors.mid);
  gradient.addColorStop(1, planet.colors.dark);

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.clip();
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

  for (const spot of planet.spots) {
    const lon = spot.lon + spin;
    const facing = Math.cos(lon);
    if (facing <= 0) continue;
    const sx = x + radius * Math.cos(spot.lat) * Math.sin(lon);
    const sy = y + radius * Math.sin(spot.lat);
    ctx.globalAlpha = spot.alpha * facing;
    ctx.fillStyle = spot.color;
    ctx.beginPath();
    ctx.ellipse(sx, sy, radius * spot.size * facing, radius * spot.size * 0.6, 0, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const shade = ctx.createRadialGradient(x + radius * 0.45, y + radius * 0.45, radius * 0.2, x, y, radius * 1.05);
  shade.addColorStop(0, 'rgba(2, 3, 5, 0)');
  shade.addColorStop(1, 'rgba(2, 3, 5, 0.75)');
  ctx.fillStyle = shade;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();

  drawRing(ctx, planet, x, y, radius, 'front');
}

function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  const glow = ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius * 4);
  glow.addColorStop(0, `rgba(${SUN.glowRgb}, 0.35)`);
  glow.addColorStop(1, `rgba(${SUN.glowRgb}, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 4, 0, TAU);
  ctx.fill();

  const core = ctx.createRadialGradient(x - radius * 0.25, y - radius * 0.25, radius * 0.1, x, y, radius);
  core.addColorStop(0, SUN.colors.core);
  core.addColorStop(0.6, SUN.colors.mid);
  core.addColorStop(1, SUN.colors.edge);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const stars = createBackgroundStars();
    const bodies: Body[] = PLANETS.map((planet) => ({ planet, angle: planet.startAngle, spin: 0 }));
    let width = 0;
    let height = 0;
    let dpr = 1;
    let layout = computeLayout(0, 0);
    let background: HTMLCanvasElement | null = null;
    let frameId = 0;
    let lastTime = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout = computeLayout(width, height);
      background = renderBackground(width, height, dpr, stars);
    };

    const draw = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;

      for (const body of bodies) {
        body.angle += body.planet.orbitalSpeed * dt;
        body.spin += body.planet.spinSpeed * dt;
      }

      if (background) ctx.drawImage(background, 0, 0, width, height);

      for (const body of bodies) drawOrbit(ctx, layout, body.planet.orbit);

      const placed = bodies.map((body) => {
        const orbitRadius = body.planet.orbit * layout.rmax;
        return {
          body,
          x: layout.cx + orbitRadius * Math.cos(body.angle),
          y: layout.cy + orbitRadius * ORBIT_TILT * Math.sin(body.angle),
          depth: Math.sin(body.angle),
        };
      });

      for (const p of placed) {
        if (p.depth >= 0) continue;
        drawPlanet(ctx, p.body.planet, p.x, p.y, p.body.planet.radius * layout.unit, p.body.spin);
      }

      drawSun(ctx, layout.cx, layout.cy, SUN.radius * layout.unit);

      for (const p of placed) {
        if (p.depth < 0) continue;
        drawPlanet(ctx, p.body.planet, p.x, p.y, p.body.planet.radius * layout.unit, p.body.spin);
      }

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
