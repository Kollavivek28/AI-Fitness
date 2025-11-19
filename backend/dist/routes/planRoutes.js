"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const llmService_1 = require("../services/llmService");
const voiceService_1 = require("../services/voiceService");
const imageService_1 = require("../services/imageService");
const pdfService_1 = require("../services/pdfService");
const storageService_1 = require("../services/storageService");
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
router.post('/plan', async (req, res) => {
    try {
        const payload = req.body;
        const plan = await (0, llmService_1.generatePersonalizedPlan)({
            profile: payload.profile,
            planDuration: payload.planDuration ?? 7,
            quoteStyle: payload.quoteStyle,
        });
        plan.quote = plan.quote ?? (await (0, llmService_1.generateMotivationQuote)(payload.profile, payload.quoteStyle));
        res.json(plan);
    }
    catch (error) {
        console.error('[plan] error', error);
        res.status(500).json({ message: error.message });
    }
});
router.post('/voice', async (req, res) => {
    try {
        const audioBase64 = await (0, voiceService_1.synthesizeVoice)(req.body);
        res.json({ audio: audioBase64 });
    }
    catch (error) {
        console.error('[voice] error', error);
        res.status(500).json({ message: error.message });
    }
});
router.post('/image', async (req, res) => {
    try {
        const { prompt, type } = req.body;
        const url = (0, imageService_1.generateExerciseImage)(prompt, type);
        res.json({ url });
    }
    catch (error) {
        console.error('[image] error', error);
        res.status(500).json({ message: error.message });
    }
});
router.post('/export/pdf', async (req, res) => {
    try {
        const pdf = await (0, pdfService_1.createPlanPdf)(req.body.plan, req.body.profile);
        res.json({ pdf });
    }
    catch (error) {
        console.error('[pdf] error', error);
        res.status(500).json({ message: error.message });
    }
});
router.post('/plans', async (req, res) => {
    if (!config_1.isSupabaseConfigured) {
        return res.status(501).json({ message: 'Supabase not configured on server.' });
    }
    try {
        const record = await (0, storageService_1.savePlan)(req.body);
        res.json(record);
    }
    catch (error) {
        console.error('[plans] error', error);
        res.status(500).json({ message: error.message });
    }
});
router.get('/plans/:id', async (req, res) => {
    if (!config_1.isSupabaseConfigured) {
        return res.status(501).json({ message: 'Supabase not configured on server.' });
    }
    try {
        const record = await (0, storageService_1.fetchPlan)(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(record);
    }
    catch (error) {
        console.error('[plans:get] error', error);
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
