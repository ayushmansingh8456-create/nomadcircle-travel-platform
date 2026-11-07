import { ORBIT_TILT } from '@/data/solarSystem';

const TAU = Math.PI * 2;
const TRAIL_ARC = 0.7;
const ORBIT_COLOR = 'rgba(6, 182, 212, 0.14)';

export function drawOrbitRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, orbitRadius: number) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, orbitRadius, orbitRadius * ORBIT_TILT, 0, 0, TAU);
  ctx.strokeStyle = ORBIT_COLOR;
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawOrbitTrail(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  orbitRadius: number,
  angle: number,
  rgb: string,
) {
  const ry = orbitRadius * ORBIT_TILT;
  const tail = angle - TRAIL_ARC;
  const gradient = ctx.createLinearGradient(
    cx + orbitRadius * Math.cos(tail),
    cy + ry * Math.sin(tail),
    cx + orbitRadius * Math.cos(angle),
    cy + ry * Math.sin(angle),
  );
  gradient.addColorStop(0, `rgba(${rgb}, 0)`);
  gradient.addColorStop(1, `rgba(${rgb}, 0.45)`);
  ctx.beginPath();
  ctx.ellipse(cx, cy, orbitRadius, ry, 0, tail, angle);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.stroke();
}
