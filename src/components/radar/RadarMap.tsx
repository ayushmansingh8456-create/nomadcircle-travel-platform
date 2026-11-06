import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Minus, Plus } from 'lucide-react';
import type { CohortPin } from '@/data/radar';

interface RadarMapProps {
  pins: CohortPin[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const HUB_ACTIVE_COLOR = '#FF6B4A';
const HUB_IDLE_COLOR = '#00D9D0';

function createHubIcon(active: boolean): L.DivIcon {
  const color = active ? HUB_ACTIVE_COLOR : HUB_IDLE_COLOR;
  return L.divIcon({
    className: 'cohort-marker',
    html: `<div class="cohort-hub" style="--hub-color:${color}"><span class="cohort-hub-ring"></span><span class="cohort-hub-ring cohort-hub-ring--delayed"></span><span class="cohort-hub-dot"></span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function RadarMap({ pins, selectedId, onSelect }: RadarMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: [25, 10],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: true,
      maxBounds: [[-85, -200], [85, 200]],
      maxBoundsViscosity: 0.8,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], {
        icon: createHubIcon(false),
        title: `${pin.city}, ${pin.country}`,
        keyboard: true,
      }).addTo(map);
      marker.on('click', () => {
        onSelectRef.current(pin.id);
        map.flyTo([pin.lat, pin.lng], 4, { duration: 0.8 });
      });
      markersRef.current.set(pin.id, marker);
    });

    mapRef.current = map;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [pins]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.setIcon(createHubIcon(id === selectedId));
    });
  }, [selectedId]);

  return (
    <>
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute top-4 left-4 z-[1000] flex flex-col overflow-hidden rounded-xl bg-slate-950/80 backdrop-blur-md border border-turquoise-400/20 shadow-soft">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Zoom in"
          className="flex items-center justify-center w-9 h-9 text-diamond-300 hover:text-turquoise-300 hover:bg-turquoise-500/10 transition-colors duration-300"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <span className="h-px bg-turquoise-400/15" />
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Zoom out"
          className="flex items-center justify-center w-9 h-9 text-diamond-300 hover:text-turquoise-300 hover:bg-turquoise-500/10 transition-colors duration-300"
        >
          <Minus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <style>{`
        .cohort-hub { position: relative; width: 24px; height: 24px; }
        .cohort-hub-dot {
          position: absolute; inset: 6px; border-radius: 50%;
          background: var(--hub-color);
          box-shadow: 0 0 12px var(--hub-color), 0 0 24px var(--hub-color);
          border: 2px solid #0B0C10;
          transition: transform 0.3s ease;
        }
        .cohort-hub:hover .cohort-hub-dot { transform: scale(1.2); }
        .cohort-hub-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid var(--hub-color);
          opacity: 0;
          animation: cohort-ring 2.2s ease-out infinite;
        }
        .cohort-hub-ring--delayed { animation-delay: 1.1s; }
        @keyframes cohort-ring {
          0% { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(2.4); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cohort-hub-ring { animation: none; }
        }
      `}</style>
    </>
  );
}
