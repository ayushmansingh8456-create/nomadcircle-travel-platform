import { ArrowRight, Calendar, MapPin, Radio, Sparkles, Users, X } from 'lucide-react';
import type { CohortPin } from '@/data/radar';

const archetypeTagStyles: Record<string, string> = {
  ember: 'bg-coral-500/15 text-coral-400',
  teal: 'bg-turquoise-500/15 text-turquoise-300',
  gold: 'bg-gold-500/15 text-gold-400',
};

const categoryDotStyles: Record<string, string> = {
  Food: 'bg-coral-500',
  Culture: 'bg-turquoise-400',
  Shopping: 'bg-gold-500',
  Nightlife: 'bg-mint-500',
  Sightseeing: 'bg-turquoise-400',
  Adventure: 'bg-coral-500',
};

interface RadarPanelProps {
  pin: CohortPin;
  onClose: () => void;
  onJoinLounge: () => void;
}

export default function RadarPanel({ pin, onClose, onJoinLounge }: RadarPanelProps) {
  return (
    <div className="absolute right-4 top-16 bottom-4 z-[1000] w-[340px] max-w-[calc(100%-2rem)] animate-fade-up">
      <div
        className="h-full flex flex-col rounded-xl3 overflow-hidden border border-turquoise-400/30 shadow-glow-lg"
        style={{
          background: 'rgba(11, 12, 16, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-obsidian-800/80 border border-slate-700/60 flex items-center justify-center text-diamond-300 hover:text-turquoise-300 hover:border-turquoise-400/40 transition-all duration-300"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="px-5 py-4 border-b border-turquoise-400/15 bg-turquoise-500/5">
          <div className="flex items-center gap-1.5 mb-2">
            <Radio className="w-3.5 h-3.5 text-turquoise-400" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-turquoise-300">Live Cohort</span>
            <span className="w-1 h-1 rounded-full bg-diamond-600" />
            <span className="flex items-center gap-1 text-[10px] text-mint-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
              Live now
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-diamond-100 leading-tight pr-10">
            {pin.city}, {pin.country}
          </h3>
          <p className="text-sm text-turquoise-300 font-medium mt-0.5">{pin.cohortName}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-diamond-400">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-turquoise-400" />
              {pin.travelersLive} travelers
            </span>
            <span className="w-1 h-1 rounded-full bg-diamond-600" />
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-turquoise-400" />
              {pin.activity}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-5 py-4">
            <h4 className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-3 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-turquoise-400" />
              Active Crew Members
            </h4>
            <div className="space-y-2">
              {pin.members.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 p-2 rounded-xl bg-obsidian-800/60 border border-slate-700/30 hover:border-turquoise-400/20 transition-colors"
                >
                  <div className="relative shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      loading="lazy"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700/40"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-mint-500 border-2 border-slate-950" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-diamond-100 truncate">{member.name}</p>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold ${archetypeTagStyles[member.archetypeColor] ?? 'bg-slate-700 text-diamond-300'}`}
                    >
                      {member.archetype}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-slate-700/30">
            <h4 className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-3 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-turquoise-400" />
              Current Itinerary Preview
            </h4>
            <div className="space-y-2">
              {pin.itinerary.map((item) => (
                <div
                  key={`${item.day}-${item.title}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian-800/60 border border-slate-700/30"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-6 h-6 rounded-lg bg-turquoise-500/10 border border-turquoise-400/20 flex items-center justify-center text-[10px] font-bold text-turquoise-300">
                      D{item.day}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${categoryDotStyles[item.category] ?? 'bg-turquoise-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-diamond-100 truncate">{item.title}</p>
                    <p className="text-[10px] text-diamond-500">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-turquoise-400/15 bg-obsidian-900/60">
          <button
            type="button"
            onClick={onJoinLounge}
            className="group w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-sm font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Join Cohort Lounge
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
          <p className="text-[10px] text-diamond-500 text-center mt-2">
            Jump into the shared lounge chat and itinerary
          </p>
        </div>
      </div>
    </div>
  );
}
