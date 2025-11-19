import { motion } from 'framer-motion';
import { Dumbbell, Clock, Salad, Sparkles } from 'lucide-react';

const container = {
  hidden: { opacity: 0, y: 30 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, type: 'spring', stiffness: 120 },
  }),
};

export default function PlanDisplay({ plan, onSelectItem }) {
  if (!plan) return null;
  return (
    <div className="space-y-8">
      <SectionHeading
        icon={<Dumbbell className="text-brand-primary" size={20} />}
        title="Workout Schedule"
        subtitle="Daily sessions with sets, reps & rest"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {plan.workout.map((day, index) => (
          <motion.div
            key={day.day}
            variants={container}
            initial="hidden"
            animate="visible"
            custom={index}
            className="group glass-panel rounded-3xl border border-white/40 p-5 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{day.day}</h3>
              <span className="rounded-full bg-brand-secondary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                {day.notes ?? 'Balanced'}
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {day.exercises.map((exercise) => (
                <button
                  type="button"
                  key={exercise.name}
                  onClick={() =>
                    onSelectItem({
                      prompt: `${exercise.name} exercise demonstration`,
                      title: exercise.name,
                      type: 'workout',
                    })
                  }
                  className="w-full rounded-2xl border border-transparent bg-white/60 p-3 text-left transition hover:border-brand-primary/40 hover:bg-white/90 dark:bg-slate-900/40"
                >
                  <p className="font-semibold text-slate-800 dark:text-white">{exercise.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {exercise.sets} sets • {exercise.reps} reps • Rest {exercise.rest}
                  </p>
                  {exercise.focus ? <p className="text-xs text-brand-secondary">Focus: {exercise.focus}</p> : null}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <SectionHeading
        icon={<Salad className="text-brand-secondary" size={20} />}
        title="Nutrition Plan"
        subtitle="Meals structured for your goals"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {plan.diet.map((day, index) => (
          <motion.div
            key={day.day}
            variants={container}
            initial="hidden"
            animate="visible"
            custom={index}
            className="group glass-panel rounded-3xl border border-white/40 p-5 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{day.day}</h3>
              {day.hydration ? (
                <span className="rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-semibold text-brand-primary">
                  {day.hydration}
                </span>
              ) : null}
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {day.meals.map((meal) => (
                <button
                  type="button"
                  key={meal.title}
                  onClick={() =>
                    onSelectItem({
                      prompt: `${meal.title} ${meal.description}`,
                      title: meal.title,
                      type: 'meal',
                    })
                  }
                  className="w-full rounded-2xl bg-white/70 p-3 text-left transition hover:bg-white/90 dark:bg-slate-900/40"
                >
                  <p className="font-semibold text-slate-800 dark:text-white">{meal.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{meal.description}</p>
                  {meal.calories ? <p className="text-xs text-brand-secondary">{meal.calories} kcal</p> : null}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <SectionHeading
        icon={<Clock className="text-brand-accent" size={20} />}
        title="AI Tips, Recovery & Mindset"
        subtitle="Actionable nudges for consistency"
      />
      <motion.ul
        variants={container}
        initial="hidden"
        animate="visible"
        className="glass-panel grid gap-3 rounded-3xl border border-white/30 p-6 text-sm text-slate-600 shadow-xl dark:text-slate-300 dark:border-slate-800"
      >
        {plan.aiTips.map((tip, index) => (
          <li key={tip} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">
              {index + 1}
            </span>
            {tip}
          </li>
        ))}
      </motion.ul>

      {plan.quote ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="glass-panel flex items-center gap-4 rounded-3xl border border-white/40 p-6 text-center text-lg font-semibold text-brand-secondary shadow-lg dark:border-slate-800"
        >
          <Sparkles />
          “{plan.quote}”
        </motion.div>
      ) : null}
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-inner dark:bg-slate-900/40">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{subtitle}</p>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
    </div>
  );
}

