import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Radar, Users, Radio, Navigation, ArrowRight, X, Sparkles,
  Calendar, MapPin,
} from 'lucide-react';
import { cohortPins, type CohortPin } from '@/data/radar';

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

function createGlowingIcon(isActive: boolean): L.DivIcon {
  const color = isActive ? '#FF6B4A' : '#00D9D0';
  const glowColor = isActive ? 'rgba(255,107,74,0.4)' : 'rgba(0,217,208,0.4)';
  return L.divIcon({
    className: 'cohort-marker',
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;inset:-8px;border-radius:50%;
          background:radial-gradient(circle,${glowColor} 0%,transparent 70%);
          animation:cohort-pulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${color};
          box-shadow:0 0 12px ${color},0 0 24px ${glowColor};
          border:2px solid #0B0C10;
          transition:all 0.3s;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function createPulseIcon(): L.DivIcon {
  return L.divIcon({
    className: 'cohort-marker',
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;inset:-12px;border-radius:50%;
          border:2px solid rgba(0,217,208,0.3);
          animation:cohort-ring 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;inset:-8px;border-radius:50%;
          background:radial-gradient(circle,rgba(0,217,208,0.4) 0%,transparent 70%);
          animation:cohort-pulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:#00D9D0;
          box-shadow:0 0 12px #00D9D0,0 0 24px rgba(0,217,208,0.4);
          border:2px solid #0B0C10;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function CohortRadar() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [selectedPin, setSelectedPin] = useState<CohortPin | null>(null);
  const [hoveredPin, setHoveredPin] = useState<CohortPin | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [30, 20],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true,
      maxBounds: [[-85, -200], [85, 200]],
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    // Add markers
    cohortPins.forEach((pin, idx) => {
      const icon = idx === 0 ? createPulseIcon() : createGlowingIcon(false);
      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

      marker.on('click', () => {
        setSelectedPin(pin);
        map.flyTo([pin.lat, pin.lng], 4, { duration: 0.8 });
      });

      marker.on('mouseover', () => {
        setHoveredPin(pin);
        marker.setIcon(createGlowingIcon(true));
      });

      marker.on('mouseout', () => {
        setHoveredPin(null);
        if (selectedPin?.id !== pin.id) {
          marker.setIcon(idx === 0 ? createPulseIcon() : createGlowingIcon(false));
        }
      });

      markersRef.current[pin.id] = marker;
    });

    // Cleanup
    const checkResize = () => {
      if (mapInstance.current) mapInstance.current.invalidateSize();
    };
    setTimeout(checkResize, 100);

    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update marker icons when selection changes
  useEffect(() => {
    cohortPins.forEach((pin, idx) => {
      const marker = markersRef.current[pin.id];
      if (!marker) return;
      const isActive = selectedPin?.id === pin.id || hoveredPin?.id === pin.id;
      if (isActive) {
        marker.setIcon(createGlowingIcon(true));
      } else {
        marker.setIcon(idx === 0 ? createPulseIcon() : createGlowingIcon(false));
      }
    });
  }, [selectedPin, hoveredPin]);

  const handleJoinLounge = () => {
    setSelectedPin(null);
    const el = document.getElementById('community');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const totalTravelers = cohortPins.reduce((s, p) => s + p.travelersLive, 0);

  return (
    <section className="relative py-20 lg:py-28 bg-obsidian-900">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
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

        {/* Map container */}
        <div className="relative rounded-xl3 overflow-hidden border border-turquoise-400/20 shadow-soft-lg" style={{ height: '560px' }}>
          <div ref={mapRef} className="absolute inset-0" />

          {/* Hover tooltip (minimal) */}
          {hoveredPin && !selectedPin && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none animate-fade-in">
              <div className="px-4 py-2 rounded-full bg-slate-950/90 backdrop-blur-md border border-turquoise-400/30 shadow-glow-turquoise">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-turquoise-400" />
                  <span className="text-sm font-bold text-diamond-100">{hoveredPin.city}, {hoveredPin.country}</span>
                  <span className="w-1 h-1 rounded-full bg-diamond-600" />
                  <span className="flex items-center gap-1 text-xs text-turquoise-300">
                    <Users className="w-3 h-3" />
                    {hoveredPin.travelersLive} live
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats badge */}
          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-turquoise-400/20 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
            <span className="text-xs font-semibold text-diamond-200">{totalTravelers} travelers live globally</span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-4 px-4 py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-turquoise-400/20 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-turquoise-400 ring-2 ring-slate-950 shadow-glow-turquoise" />
              <span className="text-[11px] font-medium text-diamond-300">Active cohort</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-500 ring-2 ring-slate-950 shadow-glow-coral" />
              <span className="text-[11px] font-medium text-diamond-300">Selected</span>
            </div>
          </div>

          {/* Glassmorphism cohort detail panel */}
          {selectedPin && (
            <CohortDetailPanel pin={selectedPin} onClose={() => setSelectedPin(null)} onJoinLounge={handleJoinLounge} />
          )}
        </div>
      </div>

      {/* Keyframe styles for marker animations */}
      <style>{`
        @keyframes cohort-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes cohort-ring {
          0% { opacity: 0.6; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(2); }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// Glassmorphism Cohort Detail Panel
// ============================================================

interface PanelProps {
  pin: CohortPin;
  onClose: () => void;
  onJoinLounge: () => void;
}

function CohortDetailPanel({ pin, onClose, onJoinLounge }: PanelProps) {
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-obsidian-800/80 border border-slate-700/60 flex items-center justify-center text-diamond-300 hover:text-turquoise-300 hover:border-turquoise-400/40 transition-all duration-300"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Header */}
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
          <h3 className="font-serif text-lg font-semibold text-diamond-100 leading-tight">
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Active members */}
          <div className="px-5 py-4">
            <h4 className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-3 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-turquoise-400" />
              Active Crew Members
            </h4>
            <div className="space-y-2">
              {pin.members.map((member, idx) => (
                <div
                  key={idx}
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

          {/* Itinerary preview */}
          <div className="px-5 py-4 border-t border-slate-700/30">
            <h4 className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-3 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-turquoise-400" />
              Current Itinerary Preview
            </h4>
            <div className="space-y-2">
              {pin.itinerary.map((item, idx) => (
                <div
                  key={idx}
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

        {/* Join button */}
        <div className="px-5 py-4 border-t border-turquoise-400/15 bg-obsidian-900/60">
          <button
            onClick={onJoinLounge}
            className="group w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-sm font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Join Cohort Lounge
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
          <p className="text-[10px] text-diamond-600 text-center mt-2">
            Jump into the {pin.city} crew chat & itinerary
          </p>
        </div>
      </div>
    </div>
  );
}
