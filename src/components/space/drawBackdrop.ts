import { NEBULAE, STAR_LAYERS, type StarLayer } from '@/data/deepSpace';

const TAU = Math.PI * 2;
const TOP_COLOR = '#090b10';
const BOTTOM_COLOR = '#020305';
const NEBULA_RESOLUTION = 0.5;
const NEBULA_OVERSCAN = 1.2;

export interface StarField {
  layer: StarLayer;
  stars: { x: number; y: number; radius: number; alpha: number }[];
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function createStarField(layer: StarLayer): StarField {
  const stars = Array.from({ length: layer.count }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: randomBetween(layer.minRadius, layer.maxRadius),
    alpha: randomBetween(layer.minAlpha, layer.maxAlpha),
  }));
  return { layer, stars };
}

export function renderNebulaLayer(width: number, height: number): HTMLCanvasElement {
  const layer = document.createElement('canvas');
  const w = Math.ceil(width * NEBULA_OVERSCAN * NEBULA_RESOLUTION);
  const h = Math.ceil(height * NEBULA_OVERSCAN * NEBULA_RESOLUTION);
  layer.width = w;
  layer.height = h;
  const ctx = layer.getContext('2d');
  if (!ctx) return layer;

  for (const cloud of NEBULAE) {
    const rx = cloud.radius * w;
    ctx.save();
    ctx.translate(cloud.x * w, cloud.y * h);
    ctx.scale(1, cloud.squash);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gradient.addColorStop(0, `rgba(${cloud.rgb}, ${cloud.alpha})`);
    gradient.addColorStop(0.5, `rgba(${cloud.rgb}, ${cloud.alpha * 0.4})`);
    gradient.addColorStop(1, `rgba(${cloud.rgb}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  return layer;
}

export function drawBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elapsed: number,
  nebula: HTMLCanvasElement | null,
  starFields: StarField[],
) {
  const base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, TOP_COLOR);
  base.addColorStop(1, BOTTOM_COLOR);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  if (nebula) {
    const driftX = Math.sin(elapsed * 0.03) * width * 0.04;
    const driftY = Math.cos(elapsed * 0.021) * height * 0.03;
    const marginX = (width * (NEBULA_OVERSCAN - 1)) / 2;
    const marginY = (height * (NEBULA_OVERSCAN - 1)) / 2;
    ctx.drawImage(
      nebula,
      -marginX + driftX,
      -marginY + driftY,
      width * NEBULA_OVERSCAN,
      height * NEBULA_OVERSCAN,
    );
  }

  for (const field of starFields) {
    ctx.fillStyle = `rgb(${field.layer.rgb})`;
    for (const star of field.stars) {
      const x = ((((star.x - field.layer.speed * elapsed) % 1) + 1) % 1) * width;
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(x, star.y * height, star.radius, 0, TAU);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
