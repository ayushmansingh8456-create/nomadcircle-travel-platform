import type { Planet } from '@/data/solarSystem';

const TAU = Math.PI * 2;
const RING_SQUASH = 0.3;
const BACK_RING_FACTOR = 0.45;

const RING_BANDS = [
  { from: 0, to: 0.2, alpha: 0.35 },
  { from: 0.2, to: 0.45, alpha: 0.7 },
  { from: 0.45, to: 0.52, alpha: 0.04 },
  { from: 0.52, to: 0.8, alpha: 0.55 },
  { from: 0.8, to: 1, alpha: 0.25 },
];

function drawAtmosphere(ctx: CanvasRenderingContext2D, planet: Planet, x: number, y: number, radius: number) {
  const outer = radius * 1.9;
  const aura = ctx.createRadialGradient(x, y, radius * 0.9, x, y, outer);
  aura.addColorStop(0, `rgba(${planet.atmosphere}, 0.35)`);
  aura.addColorStop(0.5, `rgba(${planet.atmosphere}, 0.1)`);
  aura.addColorStop(1, `rgba(${planet.atmosphere}, 0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(x, y, outer, 0, TAU);
  ctx.fill();
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  planet: Planet,
  x: number,
  y: number,
  radius: number,
  part: 'back' | 'front',
) {
  const ring = planet.ring;
  if (!ring) return;
  const span = ring.outer - ring.inner;
  const [start, end] = part === 'back' ? [Math.PI, TAU] : [0, Math.PI];
  const factor = part === 'back' ? BACK_RING_FACTOR : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, RING_SQUASH);
  for (const band of RING_BANDS) {
    const inner = radius * (ring.inner + span * band.from);
    const outer = radius * (ring.inner + span * band.to);
    ctx.strokeStyle = `rgba(${ring.color}, ${band.alpha * factor})`;
    ctx.lineWidth = outer - inner;
    ctx.beginPath();
    ctx.arc(0, 0, (inner + outer) / 2, start, end);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSphere(
  ctx: CanvasRenderingContext2D,
  planet: Planet,
  x: number,
  y: number,
  radius: number,
  spin: number,
  lightX: number,
  lightY: number,
) {
  const highlight = ctx.createRadialGradient(
    x + lightX * radius * 0.35,
    y + lightY * radius * 0.35,
    radius * 0.1,
    x,
    y,
    radius,
  );
  highlight.addColorStop(0, planet.colors.light);
  highlight.addColorStop(0.55, planet.colors.mid);
  highlight.addColorStop(1, planet.colors.dark);

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.clip();
  ctx.fillStyle = highlight;
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

  const shade = ctx.createRadialGradient(
    x + lightX * radius * 0.45,
    y + lightY * radius * 0.45,
    radius * 0.2,
    x,
    y,
    radius * 1.05,
  );
  shade.addColorStop(0, 'rgba(2, 3, 5, 0)');
  shade.addColorStop(1, 'rgba(2, 3, 5, 0.75)');
  ctx.fillStyle = shade;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();
}

function drawRimLight(
  ctx: CanvasRenderingContext2D,
  planet: Planet,
  x: number,
  y: number,
  radius: number,
  lightX: number,
  lightY: number,
) {
  const facing = Math.atan2(lightY, lightX);
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.96, facing - 0.95, facing + 0.95);
  ctx.strokeStyle = `rgba(${planet.atmosphere}, 0.5)`;
  ctx.lineWidth = Math.max(1, radius * 0.12);
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function drawPlanet(
  ctx: CanvasRenderingContext2D,
  planet: Planet,
  x: number,
  y: number,
  radius: number,
  spin: number,
  sunX: number,
  sunY: number,
) {
  const dx = sunX - x;
  const dy = sunY - y;
  const distance = Math.hypot(dx, dy) || 1;
  const lightX = dx / distance;
  const lightY = dy / distance;

  drawAtmosphere(ctx, planet, x, y, radius);
  drawRing(ctx, planet, x, y, radius, 'back');
  drawSphere(ctx, planet, x, y, radius, spin, lightX, lightY);
  drawRimLight(ctx, planet, x, y, radius, lightX, lightY);
  drawRing(ctx, planet, x, y, radius, 'front');
}
