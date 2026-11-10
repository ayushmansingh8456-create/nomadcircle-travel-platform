import { useEffect, useRef } from 'react';
import { STAR_LAYERS } from '@/data/deepSpace';
import { PLANETS, ORBIT_TILT, type Planet } from '@/data/solarSystem';
import { createStarField, drawBackdrop, renderNebulaLayer, type StarField } from '@/components/space/drawBackdrop';
import { drawOrbitRing, drawOrbitTrail } from '@/components/space/drawOrbit';
import { drawPlanet } from '@/components/space/drawPlanet';

const MAX_DPR = 2;

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

function computeLayout(width: number, height: number): Layout {
  const rmax = Math.min(width * 0.46, (height * 0.46) / ORBIT_TILT);
  const unit = Math.min(1.5, Math.max(0.55, rmax / 420));
  return { cx: width / 2, cy: height / 2, rmax, unit };
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const starFields: StarField[] = STAR_LAYERS.map(createStarField);
    const bodies: Body[] = PLANETS.map((planet) => ({ planet, angle: planet.startAngle, spin: 0 }));
    let width = 0;
    let height = 0;
    let layout = computeLayout(0, 0);
    let nebula: HTMLCanvasElement | null = null;
    let elapsed = 0;
    let frameId = 0;
    let lastTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout = computeLayout(width, height);
      nebula = renderNebulaLayer(width, height);
    };

    const draw = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      elapsed += dt;

      for (const body of bodies) {
        body.angle += body.planet.orbitalSpeed * dt;
        body.spin += body.planet.spinSpeed * dt;
      }

      drawBackdrop(ctx, width, height, elapsed, nebula, starFields);

      for (const body of bodies) {
        const orbitRadius = body.planet.orbit * layout.rmax;
        drawOrbitRing(ctx, layout.cx, layout.cy, orbitRadius);
        drawOrbitTrail(ctx, layout.cx, layout.cy, orbitRadius, body.angle, body.planet.atmosphere);
      }

      const placed = bodies.map((body) => {
        const orbitRadius = body.planet.orbit * layout.rmax;
        return {
          body,
          x: layout.cx + orbitRadius * Math.cos(body.angle),
          y: layout.cy + orbitRadius * ORBIT_TILT * Math.sin(body.angle),
          depth: Math.sin(body.angle),
        };
      });

      const drawPlacedPlanet = (p: (typeof placed)[number]) =>
        drawPlanet(
          ctx,
          p.body.planet,
          p.x,
          p.y,
          p.body.planet.radius * layout.unit,
          p.body.spin,
          layout.cx,
          layout.cy,
        );

      placed.filter((p) => p.depth < 0).forEach(drawPlacedPlanet);
      placed.filter((p) => p.depth >= 0).forEach(drawPlacedPlanet);

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
