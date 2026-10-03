import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

type TripType = 'crew' | 'stranger';

interface SearchWidgetProps {
  tripType: TripType;
  onTripTypeChange: (t: TripType) => void;
}

export default function SearchWidget({ tripType, onTripTypeChange }: SearchWidgetProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 rounded-full bg-slate-950 shadow-soft-md border border-turquoise-400/20">
          <button
            onClick={() => onTripTypeChange('crew')}
            className={`px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              tripType === 'crew'
                ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 shadow-glow-turquoise'
                : 'text-diamond-400 hover:text-turquoise-300'
            }`}
          >
            Crew Getaways
          </button>
          <button
            onClick={() => onTripTypeChange('stranger')}
            className={`px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              tripType === 'stranger'
                ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 shadow-glow-turquoise'
                : 'text-diamond-400 hover:text-turquoise-300'
            }`}
          >
            Social Stranger Trips
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-slate-950 rounded-xl3 shadow-soft-lg border border-turquoise-400/15 p-2 sm:p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Destination */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-obsidian-800 border border-slate-700/40 hover:border-turquoise-400/40 transition-colors">
            <MapPin className="w-5 h-5 text-turquoise-400 shrink-0" />
            <div className="flex-1 text-left">
              <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold">Destination</label>
              <input
                type="text"
                placeholder="Where to next?"
                className="w-full bg-transparent text-sm text-diamond-100 placeholder:text-diamond-600 outline-none mt-0.5"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-obsidian-800 border border-slate-700/40 hover:border-turquoise-400/40 transition-colors">
            <Calendar className="w-5 h-5 text-turquoise-400 shrink-0" />
            <div className="flex-1 text-left">
              <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold">Dates</label>
              <input
                type="text"
                placeholder="Any dates"
                className="w-full bg-transparent text-sm text-diamond-100 placeholder:text-diamond-600 outline-none mt-0.5"
              />
            </div>
          </div>

          {/* Group size */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-obsidian-800 border border-slate-700/40 hover:border-turquoise-400/40 transition-colors">
            <Users className="w-5 h-5 text-turquoise-400 shrink-0" />
            <div className="flex-1 text-left">
              <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold">Travelers</label>
              <input
                type="text"
                placeholder="2 travelers"
                className="w-full bg-transparent text-sm text-diamond-100 placeholder:text-diamond-600 outline-none mt-0.5"
              />
            </div>
          </div>

          {/* Search button */}
          <button className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-sm font-bold hover:shadow-glow-turquoise transition-all duration-300 sm:px-7">
            <Search className="w-4 h-4" strokeWidth={2.5} />
            <span className="sm:hidden lg:inline">Search</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
