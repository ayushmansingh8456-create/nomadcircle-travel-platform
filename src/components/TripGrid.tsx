import { useState } from 'react';
import { Flame, ArrowUp } from 'lucide-react';
import { trips } from '@/data/trips';
import { vibes, type VibeId } from '@/data/vibes';
import TripCard from './TripCard';
import Reveal from './motion/Reveal';
import TiltCard from './motion/TiltCard';
import SplitWords from './motion/SplitWords';
import ParallaxLayer from './motion/ParallaxLayer';

export default function TripGrid({ vibeFilter }: { vibeFilter: VibeId | null }) {
  const [showAllTrips, setShowAllTrips] = useState(false);
  const matchingTrips = vibeFilter ? trips.filter((trip) => vibes[vibeFilter].tripIds.includes(trip.id)) : trips;
  const visibleTrips = showAllTrips ? matchingTrips : matchingTrips.slice(0, 3);

  return (
    <section id="trips" className="relative overflow-hidden py-20 lg:py-28 bg-obsidian-950">
      <ParallaxLayer speed={0.25}>
        <div className="absolute top-1/4 right-0 w-[480px] h-[480px] rounded-full bg-coral-500/5 blur-[140px]" />
      </ParallaxLayer>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-coral-500" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-coral-400">Now Boarding</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
              <SplitWords text="Active Social Stranger Trips" />
            </h2>
            <p className="mt-3 text-diamond-400 max-w-lg">
              Small-group journeys designed for solo travelers. Meet your crew, share the road, and come back with stories.
            </p>
          </div>
          <button
            onClick={() => setShowAllTrips((v) => !v)}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-turquoise-400 hover:text-turquoise-300 transition-colors whitespace-nowrap"
          >
            {showAllTrips ? 'Show less trips' : 'View all trips'}
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-0.5">
              {showAllTrips ? <ArrowUp className="w-4 h-4 inline" /> : '→'}
            </span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visibleTrips.map((trip, i) => (
            <Reveal key={trip.id} delay={(i % 3) * 0.1}>
              <TiltCard>
                <TripCard trip={trip} />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
