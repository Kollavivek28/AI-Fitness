import { Router } from 'express';
import { generatePersonalizedPlan, generateMotivationQuote } from '../services/llmService';
import { synthesizeVoice } from '../services/voiceService';
import { generateExerciseImage } from '../services/imageService';
import { createPlanPdf } from '../services/pdfService';
import { fetchPlan, savePlan } from '../services/storageService';
import { isSupabaseConfigured } from '../config';
import { PlanRequest } from '../types';

const router = Router();

router.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/plan', async (req, res) => {
  try {
    const payload = req.body as PlanRequest;
    const plan = await generatePersonalizedPlan({
      profile: payload.profile,
      planDuration: payload.planDuration ?? 7,
      quoteStyle: payload.quoteStyle,
    });
    plan.quote = plan.quote ?? (await generateMotivationQuote(payload.profile, payload.quoteStyle));
    res.json(plan);
  } catch (error) {
    console.error('[plan] error', error);
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post('/voice', async (req, res) => {
  try {
    const audioBase64 = await synthesizeVoice(req.body);
    res.json({ audio: audioBase64 });
  } catch (error) {
    console.error('[voice] error', error);
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post('/image', async (req, res) => {
  try {
    const { prompt, type } = req.body;
    const url = await generateExerciseImage(prompt, type);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: "Image generation failed" });
  }
});

router.post('/export/pdf', async (req, res) => {
  try {
    const pdf = await createPlanPdf(req.body.plan, req.body.profile);
    res.json({ pdf });
  } catch (error) {
    console.error('[pdf] error', error);
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post('/plans', async (req, res) => {
  if (!isSupabaseConfigured) {
    return res.status(501).json({ message: 'Supabase not configured on server.' });
  }
  try {
    const record = await savePlan(req.body);
    res.json(record);
  } catch (error) {
    console.error('[plans] error', error);
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get('/plans/:id', async (req, res) => {
  if (!isSupabaseConfigured) {
    return res.status(501).json({ message: 'Supabase not configured on server.' });
  }
  try {
    const record = await fetchPlan(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(record);
  } catch (error) {
    console.error('[plans:get] error', error);
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;

