import { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { chatMessages, travelers } from '@/data/cohort';

const tagColors: Record<string, string> = {
  ember: 'bg-coral-500/15 text-coral-400',
  teal: 'bg-turquoise-500/15 text-turquoise-300',
  gold: 'bg-gold-500/15 text-gold-400',
};

export default function ChatTimeline() {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      authorId: 't1',
      text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const getTraveler = (id: string) => travelers.find((t) => t.id === id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-700/40 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-diamond-100">Cohort Chat — London</h3>
          <p className="text-[11px] text-diamond-500 mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
            Live · {travelers.length} online
          </p>
        </div>
        <div className="flex -space-x-2">
          {travelers.slice(0, 5).map((t) => (
            <img
              key={t.id}
              src={t.avatar}
              alt={t.name}
              loading="lazy"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-950"
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-5">
        {/* Day separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-700/40" />
          <span className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold">Today</span>
          <div className="flex-1 h-px bg-slate-700/40" />
        </div>

        {messages.map((msg) => {
          const author = getTraveler(msg.authorId);
          if (!author) return null;
          const isMe = msg.authorId === 't1';

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <img
                src={author.avatar}
                alt={author.name}
                loading="lazy"
                className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-slate-700/40"
              />
              <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-diamond-100">{isMe ? 'You' : author.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${tagColors[author.tagColor]}`}>
                    {author.tag}
                  </span>
                  <span className="text-[10px] text-diamond-500">{msg.time}</span>
                </div>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 rounded-tr-sm font-medium'
                      : 'bg-obsidian-800 text-diamond-200 rounded-tl-sm border border-slate-700/40'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-700/40">
        <div className="flex items-center gap-2 bg-obsidian-800 rounded-full pl-4 pr-1.5 py-1.5 border border-slate-700/40 focus-within:border-turquoise-400/40 transition-colors">
          <button className="text-diamond-500 hover:text-turquoise-300 transition-colors" aria-label="Attach">
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share your thoughts..."
            className="flex-1 bg-transparent text-sm text-diamond-100 placeholder:text-diamond-600 outline-none"
          />
          <button className="text-diamond-500 hover:text-diamond-400 transition-colors" aria-label="Emoji">
            <Smile className="w-4 h-4" />
          </button>
          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 flex items-center justify-center hover:shadow-glow-turquoise transition-all shrink-0"
            aria-label="Send"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
