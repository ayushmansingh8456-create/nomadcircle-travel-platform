import { useEffect, useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Compass, AlertCircle, WifiOff, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'signin' | 'signup';

export default function AuthModal({ isOpen, onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setError(null);
      setIsNetworkError(false);
      setEmail('');
      setPassword('');
      setFullName('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsNetworkError(false);
    setLoading(true);

    const result = mode === 'signup'
      ? (!fullName.trim()
          ? { error: 'Please enter your name' }
          : await signUp(email, password, fullName.trim()))
      : await signIn(email, password);

    if (result.error) {
      setError(result.error);
      const netKeywords = ['offline', 'unable to reach', 'network', 'connection', 'timeout', 'taking too long'];
      setIsNetworkError(netKeywords.some((kw) => result.error!.toLowerCase().includes(kw)));
      setLoading(false);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md animate-fade-in" />

      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide rounded-xl3 bg-slate-950 border border-turquoise-400/30 shadow-glow-lg animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-obsidian-800 border border-slate-700/60 flex items-center justify-center text-diamond-300 hover:text-turquoise-300 hover:border-turquoise-400/40 transition-all duration-300"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="px-6 sm:px-8 pt-8 pb-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-turquoise-400 to-turquoise-600 flex items-center justify-center shadow-glow-turquoise">
              <Compass className="w-5 h-5 text-obsidian-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-diamond-100">
              Nomad<span className="text-turquoise-400">Circle</span>
            </span>
          </div>

          <h2 className="font-serif text-2xl font-semibold text-diamond-100 mb-1">
            {mode === 'signup' ? 'Join the Circle' : 'Welcome back'}
          </h2>
          <p className="text-sm text-diamond-400 mb-6">
            {mode === 'signup'
              ? 'Create your account to book trips and save your cart.'
              : 'Sign in to access your trips and saved items.'}
          </p>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-coral-500/10 border border-coral-400/30 mb-4 animate-fade-in">
              <div className="flex items-start gap-2">
                {isNetworkError ? (
                  <WifiOff className="w-4 h-4 text-coral-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-coral-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-coral-400 leading-snug">{error}</p>
                  {isNetworkError && (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setIsNetworkError(false);
                        handleSubmit(new Event('submit') as unknown as React.FormEvent);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-turquoise-300 hover:text-turquoise-200 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-diamond-600" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Traveler"
                    className="w-full bg-obsidian-800 rounded-xl pl-11 pr-4 py-3 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/60 focus:shadow-glow-turquoise transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-diamond-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="w-full bg-obsidian-800 rounded-xl pl-11 pr-4 py-3 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/60 focus:shadow-glow-turquoise transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-diamond-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-obsidian-800 rounded-xl pl-11 pr-4 py-3 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/60 focus:shadow-glow-turquoise transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-5 text-center text-sm text-diamond-400">
            {mode === 'signup' ? 'Already have an account?' : "Don't have one yet?"}{' '}
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setError(null);
              }}
              className="text-turquoise-300 font-semibold hover:text-turquoise-200 transition-colors"
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
