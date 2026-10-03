import { useState } from 'react';
import { Plus, Play, Pause, MoreHorizontal, Headphones } from 'lucide-react';
import { playlistTracks } from '@/data/cohort';

export default function PlaylistSidebar() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const togglePlay = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-700/40">
        <div className="flex items-center gap-2 mb-1">
          <Headphones className="w-4 h-4 text-turquoise-400" />
          <h3 className="text-sm font-bold text-diamond-100">Trip Playlist</h3>
        </div>
        <p className="text-[11px] text-diamond-500">Collaborative · {playlistTracks.length} tracks</p>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-0.5">
        {playlistTracks.map((track, idx) => {
          const isPlaying = playingId === track.id;
          return (
            <div
              key={track.id}
              className="group flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-obsidian-800 transition-colors cursor-pointer"
              onClick={() => togglePlay(track.id)}
            >
              {/* Album art / play button */}
              <div className="relative shrink-0">
                <img
                  src={track.art}
                  alt={track.title}
                  loading="lazy"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className={`absolute inset-0 rounded-lg bg-obsidian-950/60 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-turquoise-300" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 text-turquoise-300" fill="currentColor" />
                  )}
                </div>
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isPlaying ? 'text-turquoise-300' : 'text-diamond-100'}`}>
                  {track.title}
                </p>
                <p className="text-[11px] text-diamond-500 truncate">{track.artist}</p>
              </div>

              {/* Duration + index */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-diamond-500 tabular-nums">{track.duration}</span>
                <span className="text-[10px] text-diamond-600 group-hover:hidden">{idx + 1}</span>
                <button className="hidden group-hover:block text-diamond-500 hover:text-turquoise-300" aria-label="More options">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Added by labels */}
        <div className="pt-3 px-2.5">
          <p className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-2">Contributors</p>
          <div className="flex flex-wrap gap-1.5">
            {['Sam', 'Marcus', 'Aiko', 'Priya'].map((name) => (
              <span key={name} className="px-2 py-0.5 rounded-md bg-obsidian-800 text-[10px] text-diamond-300 border border-slate-700/40">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add a track */}
      <div className="px-3 py-3 border-t border-slate-700/40">
        {showAdd ? (
          <div className="space-y-2 animate-slide-down">
            <input
              type="text"
              placeholder="Paste a Spotify or SoundCloud link"
              className="w-full bg-obsidian-800 rounded-xl px-3 py-2 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/40"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-xs font-bold hover:shadow-glow-turquoise transition-all"
              >
                Add Track
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-2 rounded-xl bg-obsidian-800 text-diamond-300 text-xs font-medium hover:bg-slate-700 transition-colors border border-slate-700/40"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-turquoise-400/30 text-turquoise-400 text-sm font-semibold hover:bg-turquoise-500/10 hover:border-turquoise-400/50 transition-all duration-300"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add a Track
          </button>
        )}
      </div>
    </div>
  );
}
