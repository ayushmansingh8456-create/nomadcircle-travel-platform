import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface FloatingCard {
  id: string;
  label: string;
  icon: string;
  x: number; // percentage of viewport
  y: number;
  delay: number;
  accent: string;
}

const cards: FloatingCard[] = [
  { id: 'kyoto', label: 'Kyoto', icon: '🏛', x: 12, y: 28, delay: 0.3, accent: '#00D9D0' },
  { id: 'machu', label: 'Machu Picchu', icon: '⛰', x: 82, y: 22, delay: 0.5, accent: '#FF6B4A' },
  { id: 'cairo', label: 'Cairo', icon: '🔺', x: 18, y: 68, delay: 0.7, accent: '#F5B820' },
  { id: 'paris', label: 'Paris', icon: '🗼', x: 78, y: 64, delay: 0.4, accent: '#00D9D0' },
  { id: 'tokyo', label: 'Tokyo', icon: '🗾', x: 88, y: 42, delay: 0.6, accent: '#FF6B4A' },
  { id: 'london', label: 'London', icon: '🎡', x: 8, y: 48, delay: 0.55, accent: '#F5B820' },
];

interface FloatingCardsProps {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}

export default function FloatingCards({ mouseX, mouseY }: FloatingCardsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[15] hidden md:block">
      {cards.map((card) => (
        <FloatingCardItem key={card.id} card={card} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}

function FloatingCardItem({ card, mouseX, mouseY }: { card: FloatingCard } & FloatingCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Parallax based on global mouse position
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const springX = useSpring(parallaxX, { stiffness: 40, damping: 20 });
  const springY = useSpring(parallaxY, { stiffness: 40, damping: 20 });

  // Magnetic attraction toward cursor
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springMagnetX = useSpring(magnetX, { stiffness: 120, damping: 15 });
  const springMagnetY = useSpring(magnetY, { stiffness: 120, damping: 15 });

  useEffect(() => {
    const update = () => {
      // Global parallax — shift opposite to mouse for depth
      const px = (mouseX.current - 0.5) * -30;
      const py = (mouseY.current - 0.5) * -30;
      parallaxX.set(px);
      parallaxY.set(py);
    };
    const interval = setInterval(update, 16);
    return () => clearInterval(interval);
  }, [mouseX, mouseY, parallaxX, parallaxY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * 0.15;
    const dy = (e.clientY - centerY) * 0.15;
    magnetX.set(dx);
    magnetY.set(dy);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    magnetX.set(0);
    magnetY.set(0);
  };

  const rotateX = useTransform(springY, [-20, 20], [8, -8]);
  const rotateY = useTransform(springX, [-20, 20], [-8, 8]);

  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-auto"
      style={{
        left: `${card.x}%`,
        top: `${card.y}%`,
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: card.delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          x: springMagnetX,
          y: springMagnetY,
          rotateX,
          rotateY,
          transformPerspective: 600,
        }}
        className="group relative cursor-pointer"
      >
        {/* Glow */}
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ background: `${card.accent}30` }}
        />
        {/* Card */}
        <div
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-400"
          style={{
            background: hovered ? 'rgba(11,12,16,0.75)' : 'rgba(11,12,16,0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderColor: hovered ? `${card.accent}60` : 'rgba(0,217,208,0.12)',
            boxShadow: hovered
              ? `0 8px 32px ${card.accent}20, 0 0 0 1px ${card.accent}20`
              : '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          {/* Icon orb */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `${card.accent}15`,
              border: `1px solid ${card.accent}30`,
            }}
          >
            {card.icon}
          </div>
          {/* Label */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-diamond-100 leading-tight">{card.label}</span>
            <span className="flex items-center gap-1 text-[9px] text-diamond-500 mt-0.5">
              <MapPin className="w-2.5 h-2.5" style={{ color: card.accent }} />
              Destination Highlight
            </span>
          </div>
          {/* Live dot */}
          <span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
            style={{ background: card.accent, boxShadow: `0 0 8px ${card.accent}` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
