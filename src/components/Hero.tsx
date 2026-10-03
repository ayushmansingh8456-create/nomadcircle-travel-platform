import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowDown, Sun, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchWidget from './SearchWidget';
import { WireframeGlobe, ParticleField, DestinationMarkers } from './hero/GlobeScene';
import FloatingCards from './hero/FloatingCards';

type TripType = 'crew' | 'stranger';

interface HeroProps {
  tripType: TripType;
  onTripTypeChange: (t: TripType) => void;
}

export default function Hero({ tripType, onTripTypeChange }: HeroProps) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseXSmooth = useRef(0.5);
  const mouseYSmooth = useRef(0.5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseXSmooth.current = e.clientX / window.innerWidth;
      mouseYSmooth.current = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 bg-obsidian-950">
      {/* Dark midnight gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06070B] via-[#0B0C10] to-[#080910]" />

      {/* 3D Canvas — full screen */}
      <div className="absolute inset-0 z-[5]">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#00D9D0" />
          <pointLight position={[-5, -3, 2]} intensity={0.3} color="#FF6B4A" />
          <directionalLight position={[0, 2, 4]} intensity={0.4} />

          {/* Globe + markers + particles */}
          <WireframeGlobe mouse={mouseRef} />
          <DestinationMarkers mouse={mouseRef} />
          <ParticleField />
        </Canvas>
      </div>

      {/* Radial neon glow behind globe */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-turquoise-500/8 blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-coral-500/6 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/5 w-[250px] h-[250px] rounded-full bg-gold-500/5 blur-[90px]" />
      </div>

      {/* Vignette overlay for depth */}
      <div className="absolute inset-0 z-[10] pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#06070B]" />
      <div className="absolute inset-0 z-[10] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,7,11,0.6)_100%)]" />

      {/* Floating destination cards */}
      <FloatingCards mouseX={mouseXSmooth} mouseY={mouseYSmooth} />

      {/* Content overlay */}
      <div className="relative z-[20] w-full px-5 sm:px-8 py-16 lg:py-24 flex flex-col items-center">
        {/* Eyebrow — glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-turquoise-400/25"
            style={{
              background: 'rgba(11,12,16,0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 0 20px rgba(0,217,208,0.1), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <Sun className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-medium tracking-wide text-diamond-200">Curated group travel for the curious</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold text-center text-diamond-100 text-balance leading-[1.1] max-w-4xl mx-auto"
          style={{
            textShadow: '0 2px 30px rgba(0,0,0,0.6), 0 0 60px rgba(0,217,208,0.08)',
          }}
        >
          Travel together,
          <br />
          <span
            className="italic"
            style={{
              background: 'linear-gradient(135deg, #00D9D0 0%, #5EEAD4 50%, #00D9D0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(0,217,208,0.25))',
            }}
          >
            wander further.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-center text-base sm:text-lg text-diamond-300 max-w-xl mx-auto leading-relaxed"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}
        >
          Join small-group adventures curated for connection. Pick your crew or meet fellow strangers turned friends.
        </motion.p>

        {/* Search widget */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 w-full"
        >
          <SearchWidget tripType={tripType} onTripTypeChange={onTripTypeChange} />
        </motion.div>

        {/* Explore Trips button — glassmorphism */}
        <motion.a
          href="#trips"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="group mt-8 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-400 hover:-translate-y-1"
          style={{
            background: 'rgba(0,217,208,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,217,208,0.3)',
            boxShadow: '0 0 24px rgba(0,217,208,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
            color: '#5EEAD4',
          }}
        >
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
          Explore Trips
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" strokeWidth={2.5} />
        </motion.a>
      </div>

      {/* Scroll cue at bottom */}
      <motion.a
        href="#trips"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[20] flex flex-col items-center gap-2 text-diamond-400 hover:text-turquoise-300 transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll to discover</span>
        <div className="w-5 h-9 rounded-full border border-turquoise-400/20 flex items-start justify-center p-1">
          <span className="w-1 h-2 rounded-full bg-turquoise-400/60 animate-bounce" />
        </div>
      </motion.a>
    </section>
  );
}
