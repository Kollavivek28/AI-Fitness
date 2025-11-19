import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ai-fitness-plan';

export function useLocalPlan() {
  const [savedPlan, setSavedPlan] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!savedPlan) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlan));
  }, [savedPlan]);

  const savePlan = (plan, profile) => {
    setSavedPlan({ plan, profile, savedAt: new Date().toISOString() });
  };

  const clearPlan = () => setSavedPlan(null);

  return { savedPlan, savePlan, clearPlan };
}

