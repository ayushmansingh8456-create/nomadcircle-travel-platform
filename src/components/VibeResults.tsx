import type { ReactNode } from 'react';
import { ArrowRight, Plane, RotateCcw, Shirt, ShoppingBag, type LucideIcon } from 'lucide-react';
import { boutiqueItems } from '@/data/boutique';
import { trips } from '@/data/trips';
import { wardrobeCountries } from '@/data/wardrobe';
import { vibes, type VibeSelection } from '@/data/vibes';
import { useCurrency } from '@/context/CurrencyContext';

interface VibeResultsProps {
  selection: VibeSelection;
  filterOn: boolean;
  onFilterChange: (on: boolean) => void;
  onReset: () => void;
}

export default function VibeResults({ selection, filterOn, onFilterChange, onReset }: VibeResultsProps) {
  const vibe = vibes[selection.vibe];
  const { format } = useCurrency();

  const matchedTrips = trips.filter((trip) => vibe.tripIds.includes(trip.id));
  const matchedCountries = wardrobeCountries.filter((country) => vibe.wardrobeCountryIds.includes(country.id));
  const matchedThrift = boutiqueItems.filter((item) => vibe.thriftIds.includes(item.id));

  return (
    <div className="mt-10 pt-8 border-t border-slate-700/40">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <p className="text-sm text-diamond-400">
          Personalized picks for <span className="font-semibold text-turquoise-300">{vibe.label}</span>
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <FilterToggle on={filterOn} onChange={onFilterChange} />
          <button
            type="button"
            onClick={onReset}
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-diamond-300 border border-slate-700/60 hover:text-turquoise-300 hover:border-turquoise-400/40 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            Reset Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ResultColumn icon={Plane} title="Trips" href="#trips" emptyText="No trips match this vibe yet.">
          {matchedTrips.map((trip) => (
            <ResultRow
              key={trip.id}
              image={trip.image}
              title={trip.title}
              meta={`${trip.destination}, ${trip.country}`}
              price={format(trip.price)}
            />
          ))}
        </ResultColumn>

        <ResultColumn icon={Shirt} title="Rentals" href="#wardrobe" emptyText="No rental sets for this vibe yet.">
          {matchedCountries.map((country) => (
            <ResultRow
              key={country.id}
              image={country.image}
              title={country.name}
              meta={country.tagline}
            />
          ))}
        </ResultColumn>

        <ResultColumn icon={ShoppingBag} title="Thrift Finds" href="#boutique" emptyText="No thrift finds for this vibe yet.">
          {matchedThrift.map((item) => (
            <ResultRow
              key={item.id}
              image={item.image}
              title={item.title}
              meta={item.category}
              price={format(item.price)}
            />
          ))}
        </ResultColumn>
      </div>
    </div>
  );
}

function FilterToggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-turquoise-400/30 bg-slate-950/60 text-sm font-semibold text-diamond-100 hover:border-turquoise-400/60 transition-colors duration-300"
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
          on ? 'bg-turquoise-500' : 'bg-obsidian-800 border border-slate-700/60'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-300 ${
            on ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </span>
      Filter Platform by Vibe
    </button>
  );
}

function ResultColumn({
  icon: Icon,
  title,
  href,
  emptyText,
  children,
}: {
  icon: LucideIcon;
  title: string;
  href: string;
  emptyText: string;
  children: ReactNode[];
}) {
  const hasItems = children.length > 0;

  return (
    <div className="flex flex-col rounded-xl3 bg-slate-950/60 border border-slate-700/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-turquoise-300">
          <Icon className="w-4 h-4" strokeWidth={2.5} />
          <span className="text-xs uppercase tracking-[0.15em] font-bold">{title}</span>
        </div>
        {hasItems && (
          <a
            href={href}
            className="group inline-flex items-center gap-1 text-xs font-semibold text-diamond-400 hover:text-turquoise-300 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>
      {hasItems ? (
        <div className="flex flex-col gap-3">{children}</div>
      ) : (
        <p className="text-sm text-diamond-500 leading-relaxed">{emptyText}</p>
      )}
    </div>
  );
}

function ResultRow({ image, title, meta, price }: { image: string; title: string; meta: string; price?: string }) {
  return (
    <div className="flex items-center gap-3">
      <img src={image} alt={title} loading="lazy" className="w-12 h-12 rounded-lg object-cover border border-slate-700/40" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-diamond-100 truncate">{title}</p>
        <p className="text-xs text-diamond-500 truncate">{meta}</p>
      </div>
      {price && <span className="text-sm font-bold text-diamond-100 whitespace-nowrap">{price}</span>}
    </div>
  );
}
