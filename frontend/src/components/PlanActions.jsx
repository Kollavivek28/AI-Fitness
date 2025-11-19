import { Download, RefreshCcw, Save, Volume2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function PlanActions({ onExport, onSave, onRegenerate, onPlay, disabled }) {
  const [section, setSection] = useState('workout');

  return (
    <div className="glass-panel relative overflow-hidden rounded-[2.2rem] border border-white/40 p-6 shadow-glass dark:border-slate-800">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 opacity-80" />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <select
              value={section}
              onChange={(event) => setSection(event.target.value)}
              className="input max-w-xs rounded-full bg-white/80 text-sm font-medium dark:bg-slate-900/60"
            >
              <option value="workout">Workout plan</option>
              <option value="diet">Diet plan</option>
              <option value="tips">AI tips</option>
            </select>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-white/90 px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-900/70 dark:text-white"
              onClick={() => onPlay(section)}
              disabled={disabled}
            >
              <Volume2 size={16} />
              Read aloud
            </button>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white/10">
            <Sparkles size={14} />
            AI powered
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="pill secondary flex-1 justify-center" onClick={onSave} disabled={disabled}>
            <Save size={16} />
            Save plan
          </button>

          <button type="button" className="pill flex-1 justify-center" onClick={onExport} disabled={disabled}>
            <Download size={16} />
            Export PDF
          </button>

          <button
            type="button"
            className="pill accent flex-1 justify-center"
            onClick={onRegenerate}
            disabled={disabled}
          >
            <RefreshCcw size={16} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

