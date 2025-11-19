import { Sparkles } from 'lucide-react';

export default function MotivationCard({ quote, model, timestamp }) {
  if (!quote) return null;
  return (
    <div className="glass-panel rounded-3xl p-6 text-center shadow-glass">
      <div className="inline-flex items-center gap-2 rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-semibold text-brand-secondary">
        <Sparkles size={14} />
        Daily Motivation
      </div>
      <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">“{quote}”</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {model} • {new Date(timestamp).toLocaleDateString()}
      </p>
    </div>
  );
}

