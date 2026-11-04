import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { animate, motion, useMotionValue } from 'framer-motion';

const GAP = 24;

interface DragCarouselProps {
  children: ReactNode[];
}

export default function DragCarousel({ children }: DragCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const movedRef = useRef(false);
  const [maxOffset, setMaxOffset] = useState(0);
  const [index, setIndex] = useState(0);
  const count = children.length;

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const getStep = () => {
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    return first ? first.offsetWidth + GAP : 0;
  };

  const snapTo = (target: number) => {
    const clamped = Math.min(Math.max(target, 0), count - 1);
    const position = Math.max(-maxOffset, -clamped * getStep());
    setIndex(clamped);
    animate(x, position, { type: 'spring', stiffness: 260, damping: 32, mass: 0.8 });
  };

  return (
    <div>
      <div
        ref={viewportRef}
        className="overflow-hidden"
        onPointerDownCapture={() => {
          movedRef.current = false;
        }}
        onClickCapture={(e) => {
          if (movedRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -maxOffset, right: 0 }}
          dragElastic={0.15}
          dragMomentum={false}
          onDrag={(_, info) => {
            if (Math.abs(info.offset.x) > 6) movedRef.current = true;
          }}
          onDragEnd={(_, info) => {
            const step = getStep();
            if (step === 0) return;
            const projected = x.get() + info.velocity.x * 0.2;
            snapTo(Math.round(-projected / step));
          }}
          style={{ x }}
          className="flex w-max gap-6 cursor-grab active:cursor-grabbing select-none"
        >
          {children}
        </motion.div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={() => snapTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous destination"
          className="p-3 rounded-full border border-gold-400/30 text-gold-400 hover:bg-gold-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => snapTo(index + 1)}
          disabled={index >= count - 1}
          aria-label="Next destination"
          className="p-3 rounded-full border border-gold-400/30 text-gold-400 hover:bg-gold-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
