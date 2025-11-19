import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import PlanForm from './components/PlanForm';
import PlanDisplay from './components/PlanDisplay';
import PlanActions from './components/PlanActions';
import MotivationCard from './components/MotivationCard';
import StatGlance from './components/StatGlance';
import ThemeToggle from './components/ThemeToggle';
import ImagePreview from './components/ImagePreview';
import DecorativeBackground from './components/DecorativeBackground';
import { initialProfile } from './constants/options';
import { useLocalPlan } from './hooks/useLocalPlan';
import api from './lib/api';

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
};

function App() {
  const [profile, setProfile] = useState(initialProfile);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [imagePreview, setImagePreview] = useState({ title: '', prompt: '', type: 'generic', url: '', loading: false });
  const { savedPlan, savePlan } = useLocalPlan();
  const formAnchorRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (savedPlan && !plan) {
      setPlan(savedPlan.plan);
      setProfile(savedPlan.profile);
    }
  }, [savedPlan, plan]);

  const planMutation = useCallback(
    async (formValues = profile) => {
      setLoading(true);
      try {
        const { data } = await api.post('/plan', { profile: formValues });
        setPlan(data);
        setProfile(formValues);
        toast.success('Your AI plan is ready! 🚀');
      } catch (error) {
        toast.error(error.message ?? 'Unable to create plan');
      } finally {
        setLoading(false);
      }
    },
    [profile],
  );

  const handleGenerate = useCallback(
    async (values) => {
      await planMutation(values);
    },
    [planMutation],
  );

  const handleRegenerate = () => planMutation(profile);

  const handleSavePlan = () => {
    if (!plan) return;
    savePlan(plan, profile);
    toast.success('Plan saved locally');
  };

  const handleExport = async () => {
    if (!plan) return;
    toast.loading('Preparing PDF...', { id: 'pdf' });
    try {
      const { data } = await api.post('/export/pdf', { plan, profile });
      const byteCharacters = atob(data.pdf);
      const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) => byteCharacters.charCodeAt(i));
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${profile.name || 'fitness'}-plan.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported', { id: 'pdf' });
    } catch (error) {
      toast.error(error.message ?? 'Unable to export PDF', { id: 'pdf' });
    }
  };

  const sectionToText = useCallback(
    (section) => {
      if (!plan) return '';
      if (section === 'diet') {
        return plan.diet
          .map((day) => `${day.day}: ${day.meals.map((meal) => `${meal.title} - ${meal.description}`).join('. ')}`)
          .join('\n');
      }
      if (section === 'tips') return plan.aiTips.join('. ');
      return plan.workout
        .map((day) =>
          `${day.day}: ${day.exercises.map((exercise) => `${exercise.name} ${exercise.sets}x${exercise.reps}`).join(', ')}`,
        )
        .join('\n');
    },
    [plan],
  );

  const handleVoice = async (section) => {
    if (!plan) return;
    toast.loading('Generating audio...', { id: 'voice' });
    try {
      const text = sectionToText(section);
      const { data } = await api.post('/voice', { section, text });
      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      await audio.play();
      toast.success('Enjoy the narration!', { id: 'voice' });
    } catch (error) {
      toast.error(error.message ?? 'Unable to play audio', { id: 'voice' });
    }
  };

  const handleImage = async ({ prompt, title, type = 'generic' }) => {
    const previewState = { title: title ?? prompt, prompt, type, url: '', loading: true };
    setImagePreview(previewState);
    try {
      const { data } = await api.post('/image', { prompt, type });
      setImagePreview({ ...previewState, url: data.url, loading: false });
    } catch (error) {
      setImagePreview({ ...previewState, url: '', loading: false });
      toast.error(error.message ?? 'Could not generate image');
    }
  };

  const heroSubtitle = useMemo(
    () =>
      ['LLM-personalized workouts', 'Adaptive meal plans', 'Voice + visual guidance'].map((item, index) => (
        <motion.span key={item} variants={heroVariants} initial="hidden" animate="visible" custom={index} className="text-sm text-slate-500 dark:text-slate-300">
          {item}
        </motion.span>
      )),
    [],
  );

  const highlightPills = ['Realtime TTS feedback', 'AI imagery for moves', 'PDF exports', 'Local + cloud saves'];
  const scrollToForm = () => formAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 transition dark:text-white md:px-8">
      <DecorativeBackground />
      <Toaster />
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.header
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel relative overflow-hidden rounded-[2.5rem] border border-white/30 p-8 shadow-glass dark:border-slate-800"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-secondary">AI Fitness Studio</p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
                FitMind Studio
              </h1>
              <div className="mt-4 flex flex-wrap gap-3">{heroSubtitle}</div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="pill px-6 py-3 text-base font-semibold shadow-xl"
                >
                  Design my plan
                </button>
                <div className="text-sm text-slate-500 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">{plan ? 'Plan ready' : '5k+'}</span> personalized routines delivered
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
                {highlightPills.map((pill) => (
                  <span key={pill} className="rounded-full border border-white/40 px-3 py-1 backdrop-blur dark:border-slate-700/80">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <ThemeToggle isDark={darkMode} onToggle={() => setDarkMode((mode) => !mode)} />
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/30 opacity-50" />
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div ref={formAnchorRef}>
            <PlanForm initialValues={profile} onSubmit={handleGenerate} loading={loading} />
          </div>
          <div className="space-y-6">
            <StatGlance plan={plan} />
            <MotivationCard quote={plan?.quote} model={plan?.model} timestamp={plan?.createdAt ?? new Date().toISOString()} />
            <PlanActions
              onExport={handleExport}
              onSave={handleSavePlan}
              onRegenerate={handleRegenerate}
              onPlay={handleVoice}
              disabled={!plan || loading}
            />
          </div>
        </div>

        {plan ? <PlanDisplay plan={plan} onSelectItem={handleImage} /> : null}
      </div>

      <ImagePreview
        title={imagePreview.title}
        prompt={imagePreview.prompt}
        url={imagePreview.url}
        loading={imagePreview.loading}
        onClose={() => setImagePreview({ title: '', prompt: '', type: 'generic', url: '', loading: false })}
      />
    </div>
  );
}

export default App;
