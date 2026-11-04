import type { PointerEvent, ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };

export default function TiltCard({ children, className }: TiltCardProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerTiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), springConfig);
  const pointerTiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), springConfig);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const scrollTilt = useSpring(useTransform(scrollVelocity, [-3000, 3000], [5, -5]), {
    stiffness: 120,
    damping: 20,
  });

  const rotateX = useTransform([pointerTiltX, scrollTilt], ([a, b]: number[]) => a + b);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY: pointerTiltY, transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
