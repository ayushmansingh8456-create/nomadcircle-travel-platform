import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Coffee, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import {
  archetypes,
  paceOptions,
  vibeOrder,
  vibes,
  type Pace,
  type VibeId,
  type VibeSelection,
} from '@/data/vibes';
import VibeResults from './VibeResults';
import SplitWords from './motion/SplitWords';

type QuizStep = 'vibe' | 'pace' | 'result';

interface VibeMatcherProps {
  selection: VibeSelection | null;
  filterOn: boolean;
  onComplete: (selection: VibeSelection) => void;
  onReset: () => void;
  onFilterChange: (on: boolean) => void;
}

const stepLabels: { id: QuizStep; label: string }[] = [
  { id: 'vibe', label: 'Your vibe' },
  { id: 'pace', label: 'Your pace' },
  { id: 'result', label: 'Your archetype' },
];

const paceIcons: Record<Pace, LucideIcon> = {
  relaxed: Coffee,
  fast: Zap,
};

const stepTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

export default function VibeMatcher({ selection, filterOn, onComplete, onReset, onFilterChange }: VibeMatcherProps) {
  const [draftVibe, setDraftVibe] = useState<VibeId | null>(null);

  const step: QuizStep = selection ? 'result' : draftVibe ? 'pace' : 'vibe';
  const stepIndex = stepLabels.findIndex((s) => s.id === step);

  const handleReset = () => {
    setDraftVibe(null);
    onReset();
  };

  return (
    <section id="vibe" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[640px] h-[360px] rounded-full bg-turquoise-500/8 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-turquoise-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-turquoise-300">Vibe Matcher</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
            <SplitWords text="Find your travel archetype" />
          </h2>
          <p className="mt-4 text-diamond-400 max-w-xl mx-auto leading-relaxed">
            Answer two quick questions and we will tune the trips and rentals on this page to your style.
          </p>
        </div>

        <div
          className="relative rounded-xl3 overflow-hidden border border-turquoise-400/40 p-6 sm:p-10 shadow-glow-turquoise"
          style={{
            background: 'linear-gradient(160deg, rgba(11,12,16,0.85) 0%, rgba(6,7,11,0.7) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-turquoise-500/10 blur-[90px]" />

          <div className="relative">
            <StepIndicator currentIndex={stepIndex} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={stepTransition}
              >
                {step === 'vibe' && (
                  <VibeStep onSelect={(vibe) => setDraftVibe(vibe)} />
                )}
                {step === 'pace' && draftVibe && (
                  <PaceStep
                    onBack={() => setDraftVibe(null)}
                    onSelect={(pace) => onComplete({ vibe: draftVibe, pace })}
                  />
                )}
                {step === 'result' && selection && (
                  <ResultStep
                    selection={selection}
                    filterOn={filterOn}
                    onFilterChange={onFilterChange}
                    onReset={handleReset}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <ol className="flex items-center justify-center gap-3 mb-8">
      {stepLabels.map((s, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        return (
          <li key={s.id} className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition-all duration-500 ${
                active
                  ? 'bg-turquoise-500 text-obsidian-950 border-turquoise-400 shadow-glow-turquoise'
                  : done
                    ? 'bg-turquoise-500/15 text-turquoise-300 border-turquoise-400/40'
                    : 'bg-obsidian-800 text-diamond-500 border-slate-700/60'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`hidden sm:inline text-xs font-semibold uppercase tracking-wider transition-colors duration-500 ${
                active ? 'text-turquoise-300' : 'text-diamond-500'
              }`}
            >
              {s.label}
            </span>
            {i < stepLabels.length - 1 && <span className="hidden sm:block w-8 h-px bg-slate-700/60" />}
          </li>
        );
      })}
    </ol>
  );
}

function VibeStep({ onSelect }: { onSelect: (vibe: VibeId) => void }) {
  return (
    <div>
      <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-diamond-100 text-center mb-8">
        What&apos;s your travel vibe?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vibeOrder.map((id) => {
          const vibe = vibes[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="group relative h-64 rounded-xl3 overflow-hidden text-left border border-turquoise-400/20 hover:border-turquoise-400/60 hover:shadow-glow-turquoise transition-all duration-500 hover:-translate-y-1"
            >
              <img
                src={vibe.image}
                alt={vibe.destination}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {vibe.moods.map((mood) => (
                    <span
                      key={mood}
                      className="px-2 py-0.5 rounded-md bg-slate-950/70 text-[10px] font-semibold uppercase tracking-wide text-turquoise-300 border border-turquoise-400/25"
                    >
                      {mood}
                    </span>
                  ))}
                </div>
                <p className="font-serif text-xl font-semibold text-diamond-100 leading-tight">{vibe.label}</p>
                <p className="text-xs text-diamond-400 mt-1">{vibe.destination}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PaceStep({ onBack, onSelect }: { onBack: () => void; onSelect: (pace: Pace) => void }) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="group inline-flex items-center gap-2 mb-6 text-sm font-semibold text-diamond-300 hover:text-turquoise-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Change vibe
      </button>
      <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-diamond-100 text-center mb-8">
        Preferred pace?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {paceOptions.map((option) => {
          const Icon = paceIcons[option.id];
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className="group flex flex-col items-start gap-4 p-6 rounded-xl3 bg-slate-950/60 border border-turquoise-400/20 text-left hover:border-turquoise-400/60 hover:bg-turquoise-500/5 hover:shadow-glow-turquoise hover:-translate-y-1 transition-all duration-500"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-turquoise-500/10 text-turquoise-300 border border-turquoise-400/30 group-hover:bg-turquoise-500 group-hover:text-obsidian-950 transition-colors duration-500">
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </span>
              <span className="font-serif text-xl font-semibold text-diamond-100">{option.label}</span>
              <span className="text-sm text-diamond-400 leading-relaxed">{option.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultStep({
  selection,
  filterOn,
  onFilterChange,
  onReset,
}: {
  selection: VibeSelection;
  filterOn: boolean;
  onFilterChange: (on: boolean) => void;
  onReset: () => void;
}) {
  const archetype = archetypes[selection.vibe][selection.pace];

  return (
    <div>
      <ResultBadge name={archetype.name} description={archetype.description} />
      <VibeResults
        selection={selection}
        filterOn={filterOn}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />
    </div>
  );
}

function ResultBadge({ name, description }: { name: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      className="flex flex-col items-center text-center"
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-turquoise-500/10 border border-turquoise-400/40 text-xs font-bold uppercase tracking-[0.18em] text-turquoise-300 shadow-glow-turquoise">
        <Sparkles className="w-3.5 h-3.5" />
        Your Travel Archetype
      </span>
      <h3 className="mt-5 font-serif text-4xl sm:text-5xl font-semibold text-diamond-100 leading-[1.1]">{name}</h3>
      <p className="mt-4 max-w-xl text-diamond-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}
