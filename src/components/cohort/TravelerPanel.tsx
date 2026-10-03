import { travelers } from '@/data/cohort';

const tagStyles: Record<string, string> = {
  ember: 'bg-coral-500/15 text-coral-400',
  teal: 'bg-turquoise-500/15 text-turquoise-300',
  gold: 'bg-gold-500/15 text-gold-400',
};

export default function TravelerPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-4 py-3.5 border-b border-slate-700/40">
        <h3 className="text-sm font-bold text-diamond-100">The Crew</h3>
        <p className="text-[11px] text-diamond-500 mt-0.5">{travelers.length} travelers confirmed</p>
      </div>

      {/* Traveler list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-1">
        {travelers.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-obsidian-800 transition-colors cursor-pointer group"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={t.avatar}
                alt={t.name}
                loading="lazy"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700/60 group-hover:ring-turquoise-400/60 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-mint-500 border-2 border-slate-950" />
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-diamond-100 truncate">{t.name}</p>
              <p className="text-[11px] text-diamond-500">{t.role}</p>
            </div>

            {/* Tag */}
            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold ${tagStyles[t.tagColor]}`}
            >
              {t.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700/40">
        <div className="flex items-center gap-2 text-[11px] text-diamond-500">
          <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
          All travelers checked in
        </div>
      </div>
    </div>
  );
}
