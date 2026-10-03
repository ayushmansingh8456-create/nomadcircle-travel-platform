import { useState } from 'react';
import { Flame, ArrowUp } from 'lucide-react';
import { trips } from '@/data/trips';
import TripCard from './TripCard';

export default function TripGrid() {
  const [showAllTrips, setShowAllTrips] = useState(false);
  const visibleTrips = showAllTrips ? trips : trips.slice(0, 3);

  return (
    <section id="trips" className="relative py-20 lg:py-28 bg-obsidian-950">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-coral-500" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-coral-400">Now Boarding</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
              Active Social Stranger Trips
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
          {visibleTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  );
}
