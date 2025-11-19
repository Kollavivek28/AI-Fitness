import { Activity, Flame, HeartPulse } from 'lucide-react';

const stats = [
  { label: 'Weekly Sessions', icon: Activity, key: 'sessions', suffix: ' days' },
  { label: 'Focus Intensity', icon: Flame, key: 'intensity', showBar: true, suffix: '%' },
  { label: 'Recovery Score', icon: HeartPulse, key: 'recovery', showBar: true, suffix: '%' },
];

export default function StatGlance({ plan }) {
  if (!plan) return null;

  const intensityScore = plan.workout ? Math.min(100, (plan.workout.flatMap((d) => d.exercises).length / 30) * 100) : 0;
  const derived = {
    sessions: plan.workout?.length ?? 0,
    intensity: Math.round(intensityScore),
    recovery: 82,
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const value = derived[stat.key];
        const progress = stat.showBar ? Math.min(100, Number(value)) : null;
        return (
          <div
            key={stat.label}
            className="glass-panel relative overflow-hidden rounded-3xl border border-white/30 p-4 shadow-glass dark:border-slate-800"
          >
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10" />
            <div className="relative flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-slate-900/60">
                  <Icon className="text-brand-primary" size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {value}
                    {stat.suffix ?? ''}
                  </p>
                </div>
              </div>
              {progress !== null ? (
                <div className="mt-1 h-2 w-full rounded-full bg-white/40 dark:bg-slate-800/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

