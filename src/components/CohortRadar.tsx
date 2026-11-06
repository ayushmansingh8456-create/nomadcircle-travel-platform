import { useState } from 'react';
import { Radar, Users } from 'lucide-react';
import { cohortPins } from '@/data/radar';
import RadarMap from './radar/RadarMap';
import RadarPanel from './radar/RadarPanel';

export default function CohortRadar() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPin = cohortPins.find((pin) => pin.id === selectedId) ?? null;
  const totalTravelers = cohortPins.reduce((sum, pin) => sum + pin.travelersLive, 0);

  const handleJoinLounge = () => {
    setSelectedId(null);
    document.getElementById('community')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Radar className="w-4 h-4 text-turquoise-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-turquoise-400">Real-Time Global View</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
            Live Cohort Radar
          </h2>
          <p className="mt-3 text-diamond-400 max-w-xl mx-auto">
            See where NomadCircle crews are wandering right now. Click any glowing pin to meet the cohort and join the lounge.
          </p>
        </div>

        <div
          className="relative rounded-xl3 overflow-hidden border border-turquoise-400/20 shadow-soft-lg bg-[#06070B]"
          style={{ height: '560px' }}
        >
          <RadarMap pins={cohortPins} selectedId={selectedId} onSelect={setSelectedId} />

          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-turquoise-400/20 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
            <Users className="w-3.5 h-3.5 text-turquoise-400" />
            <span className="text-xs font-semibold text-diamond-200">{totalTravelers} travelers live globally</span>
          </div>

          <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-4 px-4 py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-turquoise-400/20 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-turquoise-400 ring-2 ring-slate-950 shadow-glow-turquoise" />
              <span className="text-[11px] font-medium text-diamond-300">Active hub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-500 ring-2 ring-slate-950 shadow-glow-coral" />
              <span className="text-[11px] font-medium text-diamond-300">Selected</span>
            </div>
          </div>

          {selectedPin && (
            <RadarPanel pin={selectedPin} onClose={() => setSelectedId(null)} onJoinLounge={handleJoinLounge} />
          )}
        </div>
      </div>
    </section>
  );
}
