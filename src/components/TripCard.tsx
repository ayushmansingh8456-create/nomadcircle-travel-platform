import { Calendar, Clock, MapPin, Users, ArrowUpRight, Check } from 'lucide-react';
import type { Trip } from '@/data/trips';
import { useCheckout } from '@/context/CheckoutContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function TripCard({ trip }: { trip: Trip }) {
  const { openCheckout } = useCheckout();
  const { format } = useCurrency();
  const spotsLeft = trip.capacity - trip.filled;
  const fillPercent = Math.round((trip.filled / trip.capacity) * 100);
  const almostFull = spotsLeft <= 3;

  return (
    <article className="group relative flex flex-col rounded-xl3 overflow-hidden bg-slate-950 border border-turquoise-400/20 shadow-soft hover:shadow-glow-turquoise transition-all duration-500 hover:-translate-y-1.5 hover:border-turquoise-400/40">
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src={trip.image}
          alt={`${trip.destination}, ${trip.country}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Spots badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-soft ${
              almostFull
                ? 'bg-coral-500 text-white'
                : 'bg-slate-950/80 text-turquoise-300 border border-turquoise-400/30 backdrop-blur-sm'
            }`}
          >
            <Users className="w-3.5 h-3.5" strokeWidth={2.5} />
            {trip.filled}/{trip.capacity} spots filled
          </div>
        </div>

        {/* Destination tag */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-turquoise-300 drop-shadow" />
          <span className="text-sm font-semibold text-diamond-100 drop-shadow">{trip.destination}, {trip.country}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="font-serif text-xl font-semibold text-diamond-100 mb-3 leading-tight group-hover:text-turquoise-300 transition-colors">
          {trip.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trip.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-turquoise-500/10 text-[11px] font-medium text-turquoise-300 border border-turquoise-400/15"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2 mb-4 text-sm text-diamond-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-diamond-500" />
            <span>{trip.dates}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-diamond-500" />
            <span>{trip.duration}</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-diamond-500 font-medium">Trip capacity</span>
            <span className={almostFull ? 'text-coral-400 font-semibold' : 'text-turquoise-400 font-semibold'}>
              {spotsLeft} spot left
            </span>
          </div>
          <div className="h-2 rounded-full bg-obsidian-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                almostFull ? 'bg-coral-500' : 'bg-gradient-to-r from-turquoise-500 to-turquoise-300'
              }`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-700/40">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold block">From</span>
            <span className="text-lg font-bold text-diamond-100">{format(trip.price)}</span>
            <span className="text-xs text-diamond-500"> /person</span>
          </div>
          <button
            onClick={() => openCheckout({
              type: 'trip',
              title: trip.title,
              subtitle: `${trip.destination}, ${trip.country} · ${trip.dates}`,
              price: trip.price,
              image: trip.image,
              tripId: trip.id,
              destination: `${trip.destination}, ${trip.country}`,
              dates: trip.dates,
            })}
            className="group/btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-turquoise-500/10 text-turquoise-300 text-sm font-semibold border border-turquoise-400/30 hover:bg-turquoise-500 hover:text-obsidian-950 hover:border-turquoise-400 transition-all duration-300"
          >
            Reserve
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Active ribbon */}
      {trip.filled >= 6 && (
        <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm shadow-soft border border-mint-500/30">
          <Check className="w-3 h-3 text-mint-400" strokeWidth={3} />
          <span className="text-[10px] font-semibold text-mint-400 uppercase tracking-wider">Active</span>
        </div>
      )}
    </article>
  );
}
