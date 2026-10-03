import { useState } from 'react';
import { Users, MapPin, Calendar, Plane, MessageCircle, ListChecks } from 'lucide-react';
import TravelerPanel from './cohort/TravelerPanel';
import ChatTimeline from './cohort/ChatTimeline';
import PlaylistSidebar from './cohort/PlaylistSidebar';
import ItineraryBuilder from './cohort/ItineraryBuilder';

type Tab = 'lounge' | 'itinerary';

export default function CohortLounge() {
  const [activeTab, setActiveTab] = useState<Tab>('lounge');

  return (
    <section id="community" className="relative py-20 lg:py-28 bg-obsidian-950">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-turquoise-500/8 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="w-4 h-4 text-turquoise-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-turquoise-400">Community</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
            The Cohort Lounge
          </h2>
          <p className="mt-3 text-diamond-400 max-w-xl mx-auto">
            Your group's private space before the journey begins. Meet your crew, plan the itinerary, and set the soundtrack.
          </p>
        </div>

        {/* Trip banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl3 bg-slate-950 border border-turquoise-400/20 shadow-soft-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-turquoise-400 to-turquoise-600 flex items-center justify-center shadow-glow-turquoise shrink-0">
              <Plane className="w-6 h-6 text-obsidian-950" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-diamond-100">London Imperial Culture</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-diamond-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-turquoise-400" />
                  London, UK
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-turquoise-400" />
                  Dec 2 — Dec 9, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-turquoise-400" />
                  6 confirmed
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-mint-500/15 text-mint-400 text-xs font-semibold border border-mint-400/30">
              Trip Confirmed
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1.5 rounded-full bg-slate-950 border border-turquoise-400/20 shadow-soft-md">
            <button
              onClick={() => setActiveTab('lounge')}
              className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'lounge'
                  ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 shadow-glow-turquoise'
                  : 'text-diamond-400 hover:text-turquoise-300'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Lounge
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'itinerary'
                  ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 shadow-glow-turquoise'
                  : 'text-diamond-400 hover:text-turquoise-300'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              Itinerary Builder
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'lounge' ? (
          /* Three-panel layout — Lounge */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-[640px]">
            {/* Left — Travelers */}
            <div className="lg:col-span-3 rounded-xl3 bg-slate-950 border border-turquoise-400/15 shadow-soft-md overflow-hidden flex flex-col min-h-0">
              <TravelerPanel />
            </div>

            {/* Center — Chat */}
            <div className="lg:col-span-6 rounded-xl3 bg-slate-950 border border-turquoise-400/15 shadow-soft-md overflow-hidden flex flex-col min-h-0">
              <ChatTimeline />
            </div>

            {/* Right — Playlist */}
            <div className="lg:col-span-3 rounded-xl3 bg-slate-950 border border-turquoise-400/15 shadow-soft-md overflow-hidden flex flex-col min-h-0">
              <PlaylistSidebar />
            </div>
          </div>
        ) : (
          /* Itinerary Builder layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-[640px]">
            {/* Left — Travelers (compact) */}
            <div className="hidden lg:block lg:col-span-3 rounded-xl3 bg-slate-950 border border-turquoise-400/15 shadow-soft-md overflow-hidden flex flex-col min-h-0">
              <TravelerPanel />
            </div>

            {/* Center+Right — Itinerary Builder */}
            <div className="lg:col-span-9 rounded-xl3 bg-slate-950 border border-turquoise-400/15 shadow-soft-md overflow-hidden flex flex-col min-h-0">
              <ItineraryBuilder />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
