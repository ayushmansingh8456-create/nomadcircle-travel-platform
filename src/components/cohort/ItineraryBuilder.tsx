import { useEffect, useMemo, useState } from 'react';
import {
  Calendar, ChevronUp, ChevronDown, Plus, Tag, Wallet,
  ThumbsUp, ThumbsDown, Sparkles, X, Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  seedActivities, categoryStyles, categoryList,
  type ItineraryActivity, type ActivityCategory,
} from '@/data/itinerary';

const TRIP_ID = 'london-imperial';
const TOTAL_DAYS = 7;

interface VoteRecord {
  direction: 'up' | 'down';
}

export default function ItineraryBuilder() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [activities, setActivities] = useState<ItineraryActivity[]>(seedActivities);
  const [activeDay, setActiveDay] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [loading, setLoading] = useState(true);

  // Load activities and user's votes from Supabase when authenticated
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      const [{ data: dbActivities }, { data: dbVotes }] = await Promise.all([
        supabase
          .from('itinerary_activities')
          .select('id, trip_id, day, title, category, cost, suggested_by, votes')
          .eq('trip_id', TRIP_ID)
          .order('votes', { ascending: false }),
        supabase
          .from('itinerary_votes')
          .select('activity_id, direction')
          .eq('user_id', user.id),
      ]);

      if (dbActivities && dbActivities.length > 0) {
        const mapped: ItineraryActivity[] = dbActivities.map((row) => ({
          id: row.id,
          day: row.day,
          title: row.title,
          category: row.category as ActivityCategory,
          cost: row.cost,
          suggestedBy: row.suggested_by,
          votes: row.votes,
        }));
        setActivities(mapped);
      }

      if (dbVotes) {
        const voteMap: Record<string, 'up' | 'down'> = {};
        for (const v of dbVotes) {
          voteMap[v.activity_id] = v.direction as 'up' | 'down';
        }
        setUserVotes(voteMap);
      }

      setLoading(false);
    })();
  }, [user]);

  const dayActivities = useMemo(() => {
    return activities
      .filter((a) => a.day === activeDay)
      .sort((a, b) => b.votes - a.votes);
  }, [activities, activeDay]);

  const handleVote = async (activityId: string, direction: 'up' | 'down') => {
    if (!user) return;

    const currentVote = userVotes[activityId];
    let voteDelta = 0;

    if (currentVote === direction) {
      // Toggle off — remove vote
      voteDelta = direction === 'up' ? -1 : 1;
      setUserVotes((prev) => {
        const next = { ...prev };
        delete next[activityId];
        return next;
      });
      setActivities((prev) =>
        prev.map((a) => (a.id === activityId ? { ...a, votes: a.votes + voteDelta } : a)),
      );
      await supabase
        .from('itinerary_votes')
        .delete()
        .eq('activity_id', activityId)
        .eq('user_id', user.id);
    } else {
      // New vote or change direction
      voteDelta = direction === 'up' ? 1 : -1;
      if (currentVote === 'up') voteDelta -= 1;
      if (currentVote === 'down') voteDelta += 1;

      setUserVotes((prev) => ({ ...prev, [activityId]: direction }));
      setActivities((prev) =>
        prev.map((a) => (a.id === activityId ? { ...a, votes: a.votes + voteDelta } : a)),
      );

      await supabase
        .from('itinerary_votes')
        .upsert(
          { activity_id: activityId, user_id: user.id, direction },
          { onConflict: 'activity_id,user_id' },
        );
    }

    const updatedActivity = activities.find((a) => a.id === activityId);
    if (updatedActivity) {
      const newVotes = updatedActivity.votes + voteDelta;
      await supabase
        .from('itinerary_activities')
        .update({ votes: newVotes })
        .eq('id', activityId);
    }
  };

  const handleAddActivity = async (title: string, category: ActivityCategory, cost: number, day: number) => {
    const newActivity: ItineraryActivity = {
      id: `local-${Date.now()}`,
      day,
      title,
      category,
      cost,
      suggestedBy: user?.email?.split('@')[0] ?? 'Crew Member',
      votes: 0,
    };

    setActivities((prev) => [...prev, newActivity]);
    setActiveDay(day);
    setShowAddForm(false);

    if (user) {
      const { data } = await supabase
        .from('itinerary_activities')
        .insert({
          trip_id: TRIP_ID,
          day,
          title,
          category,
          cost,
          suggested_by: newActivity.suggestedBy,
          votes: 0,
        })
        .select('id')
        .single();

      if (data) {
        setActivities((prev) =>
          prev.map((a) => (a.id === newActivity.id ? { ...a, id: data.id } : a)),
        );
      }
    }
  };

  const totalDayCost = dayActivities.reduce((sum, a) => sum + a.cost, 0);
  const topActivity = dayActivities[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-700/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-turquoise-400" />
            <h3 className="text-sm font-bold text-diamond-100">Day-by-Day Itinerary</h3>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-turquoise-500/10 text-turquoise-300 text-xs font-semibold border border-turquoise-400/30 hover:bg-turquoise-500 hover:text-obsidian-950 hover:border-turquoise-400 transition-all duration-300"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}
            {showAddForm ? 'Cancel' : 'Suggest'}
          </button>
        </div>
        <p className="text-[11px] text-diamond-500 mt-0.5">
          {activities.length} activities · sorted by crew votes
        </p>
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 px-3 py-2.5 overflow-x-auto scrollbar-hide border-b border-slate-700/40">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeDay === day
                ? 'bg-turquoise-500 text-obsidian-950 shadow-glow-turquoise'
                : 'bg-obsidian-800 text-diamond-400 hover:text-turquoise-300 hover:bg-obsidian-700 border border-slate-700/40'
            }`}
          >
            D{day}
          </button>
        ))}
      </div>

      {/* Add activity form */}
      {showAddForm && (
        <AddActivityForm
          defaultDay={activeDay}
          onSubmit={handleAddActivity}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-diamond-500">Loading itinerary...</p>
          </div>
        ) : dayActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Sparkles className="w-6 h-6 text-diamond-600 mb-2" />
            <p className="text-xs font-semibold text-diamond-300 mb-1">No activities yet for Day {activeDay}</p>
            <p className="text-[11px] text-diamond-500">Be the first to suggest something!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayActivities.map((activity, idx) => {
              const style = categoryStyles[activity.category];
              const userVote = userVotes[activity.id];
              const isTop = idx === 0 && activity.votes > 0;

              return (
                <div
                  key={activity.id}
                  className={`group rounded-xl2 border p-3 transition-all duration-300 ${
                    isTop
                      ? 'bg-turquoise-500/8 border-turquoise-400/30 shadow-glow-turquoise'
                      : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Vote column */}
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => user && handleVote(activity.id, 'up')}
                        disabled={!user}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          userVote === 'up'
                            ? 'bg-turquoise-500 text-obsidian-950 shadow-glow-turquoise'
                            : 'text-diamond-500 hover:text-turquoise-300 hover:bg-turquoise-500/10'
                        } ${!user ? 'cursor-not-allowed opacity-40' : ''}`}
                        aria-label="Upvote"
                      >
                        <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                      <span className={`text-xs font-bold tabular-nums ${isTop ? 'text-turquoise-300' : 'text-diamond-200'}`}>
                        {activity.votes}
                      </span>
                      <button
                        onClick={() => user && handleVote(activity.id, 'down')}
                        disabled={!user}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          userVote === 'down'
                            ? 'bg-coral-500 text-white'
                            : 'text-diamond-500 hover:text-coral-400 hover:bg-coral-500/10'
                        } ${!user ? 'cursor-not-allowed opacity-40' : ''}`}
                        aria-label="Downvote"
                      >
                        <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm font-semibold leading-snug ${isTop ? 'text-turquoise-200' : 'text-diamond-100'}`}>
                          {isTop && <Sparkles className="w-3 h-3 text-turquoise-400 inline mr-1 -mt-0.5" />}
                          {activity.title}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${style.bg} ${style.text} border ${style.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {activity.category}
                        </span>
                        {activity.cost > 0 && (
                          <span className="flex items-center gap-0.5 text-[11px] text-diamond-400">
                            <Wallet className="w-3 h-3" />
                            {format(activity.cost)}
                          </span>
                        )}
                        <span className="text-[10px] text-diamond-600">
                          by {activity.suggestedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer summary */}
      <div className="px-4 py-3 border-t border-slate-700/40">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-diamond-500">
            Day {activeDay} total
          </span>
          <span className="font-bold text-diamond-200">{format(totalDayCost)}</span>
        </div>
        {!user && (
          <p className="text-[10px] text-diamond-600 mt-1 text-center">
            Sign in to vote and suggest activities
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Add Activity Form
// ============================================================

interface AddActivityFormProps {
  defaultDay: number;
  onSubmit: (title: string, category: ActivityCategory, cost: number, day: number) => void;
  onCancel: () => void;
}

function AddActivityForm({ defaultDay, onSubmit, onCancel }: AddActivityFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Food');
  const [cost, setCost] = useState('');
  const [day, setDay] = useState(defaultDay);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), category, parseInt(cost) || 0, day);
  };

  return (
    <div className="px-4 py-3 border-b border-slate-700/40 bg-obsidian-900/50 animate-slide-down">
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="flex items-center gap-2 mb-1">
          <Plus className="w-3.5 h-3.5 text-turquoise-400" />
          <span className="text-xs font-bold text-diamond-100">Suggest an Activity</span>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Portobello Road Market"
          autoFocus
          className="w-full bg-obsidian-800 rounded-lg px-3 py-2 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/50 transition-all"
        />

        {/* Category + Day + Cost */}
        <div className="grid grid-cols-3 gap-2">
          {/* Category */}
          <div className="col-span-3">
            <div className="flex flex-wrap gap-1.5">
              {categoryList.map((cat) => {
                const style = categoryStyles[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all ${
                      category === cat
                        ? `${style.bg} ${style.text} ${style.border}`
                        : 'bg-obsidian-800 text-diamond-500 border-slate-700/40 hover:border-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day selector */}
          <div>
            <label className="block text-[9px] uppercase tracking-wider text-diamond-500 font-semibold mb-1">Day</label>
            <select
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              className="w-full bg-obsidian-800 rounded-lg px-2 py-2 text-xs text-diamond-100 outline-none border border-slate-700/40 focus:border-turquoise-400/50 transition-all"
            >
              {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>Day {d}</option>
              ))}
            </select>
          </div>

          {/* Cost */}
          <div className="col-span-2">
            <label className="block text-[9px] uppercase tracking-wider text-diamond-500 font-semibold mb-1">Est. Cost (USD)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full bg-obsidian-800 rounded-lg px-3 py-2 text-xs text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/50 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-xs font-bold hover:shadow-glow-turquoise transition-all disabled:opacity-40"
          >
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            Add Activity
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-lg bg-obsidian-800 text-diamond-300 text-xs font-medium hover:bg-slate-700 transition-colors border border-slate-700/40"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
