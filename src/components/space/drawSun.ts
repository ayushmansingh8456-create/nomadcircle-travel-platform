import { SUN } from '@/data/solarSystem';

const TAU = Math.PI * 2;
const FLARE_COUNT = 14;

function drawCorona(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, pulse: number) {
  const outer = radius * 4.2 * pulse;
  const corona = ctx.createRadialGradient(x, y, radius * 0.9, x, y, outer);
  corona.addColorStop(0, `rgba(${SUN.corona}, 0.55)`);
  corona.addColorStop(0.35, `rgba(${SUN.corona}, 0.18)`);
  corona.addColorStop(0.7, `rgba(${SUN.halo}, 0.07)`);
  corona.addColorStop(1, `rgba(${SUN.halo}, 0)`);
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(x, y, outer, 0, TAU);
  ctx.fill();
}

function drawFlares(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, elapsed: number) {
  const step = TAU / FLARE_COUNT;
  for (let i = 0; i < FLARE_COUNT; i++) {
    const angle = i * step + elapsed * 0.04;
    const wave = 0.5 + 0.5 * Math.sin(elapsed * 0.8 + i * 2.3);
    const length = radius * (2.1 + 1.4 * wave);
    const halfWidth = 0.035 + 0.02 * wave;
    const base = radius * 0.85;
    const tipX = x + Math.cos(angle) * length;
    const tipY = y + Math.sin(angle) * length;
    const gradient = ctx.createLinearGradient(x + Math.cos(angle) * base, y + Math.sin(angle) * base, tipX, tipY);
    gradient.addColorStop(0, `rgba(255, 236, 170, ${0.35 + 0.25 * wave})`);
    gradient.addColorStop(1, 'rgba(255, 170, 60, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle - halfWidth) * base, y + Math.sin(angle - halfWidth) * base);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(x + Math.cos(angle + halfWidth) * base, y + Math.sin(angle + halfWidth) * base);
    ctx.closePath();
    ctx.fill();
  }
}

function drawCore(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  const core = ctx.createRadialGradient(x - radius * 0.2, y - radius * 0.2, radius * 0.05, x, y, radius);
  core.addColorStop(0, SUN.colors.core);
  core.addColorStop(0.35, SUN.colors.bright);
  core.addColorStop(0.7, SUN.colors.flame);
  core.addColorStop(1, SUN.colors.ember);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

export function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, elapsed: number) {
  const pulse = 1 + 0.04 * Math.sin(elapsed * 1.6);
  drawCorona(ctx, x, y, radius, pulse);
  drawFlares(ctx, x, y, radius, elapsed);
  drawCore(ctx, x, y, radius);
}
