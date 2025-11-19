import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalOptions, levelOptions, locationOptions, dietOptions, stressLevels } from '../constants/options';

const genders = ['Male', 'Female', 'Other'];
const equipmentChoices = ['Dumbbells', 'Kettlebell', 'Resistance Bands', 'Pull-up Bar', 'Yoga Mat', 'No Equipment'];

const profileSchema = z.object({
  name: z.string().min(2, 'Please enter a valid name'),
  age: z.coerce.number().min(16).max(80),
  gender: z.enum(['Male', 'Female', 'Other']),
  heightCm: z.coerce.number().min(120).max(230),
  weightKg: z.coerce.number().min(35).max(180),
  fitnessGoal: z.enum(goalOptions),
  fitnessLevel: z.enum(levelOptions),
  workoutLocation: z.enum(locationOptions),
  dietaryPreference: z.enum(dietOptions),
  medicalHistory: z.string().optional(),
  stressLevel: z.enum(stressLevels),
  equipmentAvailable: z.array(z.string()).optional(),
});

export default function PlanForm({ initialValues, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  useEffect(() => {
    register('equipmentAvailable');
  }, [register]);

  const selectedEquipment = watch('equipmentAvailable') ?? [];

  const toggleEquipment = (item) => {
    const exists = selectedEquipment.includes(item);
    const updated = exists ? selectedEquipment.filter((i) => i !== item) : [...selectedEquipment, item];
    setValue('equipmentAvailable', updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-[2rem] border border-white/40 p-6 shadow-glass dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">Let’s calibrate your coach</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Personalize your plan</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">LLM-curated workouts + meals matched to your lifestyle.</p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 px-4 py-1 text-xs font-semibold text-brand-primary backdrop-blur">
          AI-crafted
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
        {['Smart recovery cues', 'Macro-balanced meals', 'Location-aware sessions'].map((item) => (
          <span key={item} className="rounded-full border border-slate-200/60 px-3 py-1 dark:border-slate-700/70">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className="input" placeholder="Jordan" {...register('name')} />
        </Field>
        <Field label="Age" error={errors.age?.message}>
          <input type="number" min="16" className="input" {...register('age')} />
        </Field>
        <Field label="Gender" error={errors.gender?.message}>
          <select className="input" {...register('gender')}>
            {genders.map((gender) => (
              <option key={gender}>{gender}</option>
            ))}
          </select>
        </Field>
        <Field label="Stress level" error={errors.stressLevel?.message}>
          <select className="input" {...register('stressLevel')}>
            {stressLevels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </Field>
        <Field label="Height (cm)" error={errors.heightCm?.message}>
          <input type="number" className="input" {...register('heightCm')} />
        </Field>
        <Field label="Weight (kg)" error={errors.weightKg?.message}>
          <input type="number" className="input" {...register('weightKg')} />
        </Field>
        <Field label="Fitness goal" error={errors.fitnessGoal?.message}>
          <select className="input" {...register('fitnessGoal')}>
            {goalOptions.map((goal) => (
              <option key={goal}>{goal}</option>
            ))}
          </select>
        </Field>
        <Field label="Current level" error={errors.fitnessLevel?.message}>
          <select className="input" {...register('fitnessLevel')}>
            {levelOptions.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </Field>
        <Field label="Workout location" error={errors.workoutLocation?.message}>
          <select className="input" {...register('workoutLocation')}>
            {locationOptions.map((place) => (
              <option key={place}>{place}</option>
            ))}
          </select>
        </Field>
        <Field label="Dietary preference" error={errors.dietaryPreference?.message}>
          <select className="input" {...register('dietaryPreference')}>
            {dietOptions.map((diet) => (
              <option key={diet}>{diet}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Medical history / notes" className="mt-4" error={errors.medicalHistory?.message}>
        <textarea rows={3} className="input resize-none" placeholder="Optional" {...register('medicalHistory')} />
      </Field>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Equipment you can access</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {equipmentChoices.map((item) => {
            const active = selectedEquipment.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleEquipment(item)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-slate-200 text-slate-500 hover:border-brand-primary/60 hover:text-brand-primary'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading}
      >
        {loading ? 'Generating your plan...' : 'Generate AI Plan'}
      </button>
    </form>
  );
}

function Field({ label, error, className = '', children }) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 ${className}`}>
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-brand-accent">{error}</span> : null}
    </label>
  );
}

