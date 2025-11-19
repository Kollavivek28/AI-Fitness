"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePersonalizedPlan = generatePersonalizedPlan;
exports.generateMotivationQuote = generateMotivationQuote;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("../config");
const geminiClient = config_1.config.geminiKey ? new generative_ai_1.GoogleGenerativeAI(config_1.config.geminiKey) : null;
const FALLBACK_MODELS = [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
];
let cachedModel = null;
let cachedModelName = null;
let availableModels = null;
const planSchema = {
    type: 'object',
    properties: {
        workout: {
            type: 'array',
            minItems: 7,
            items: {
                type: 'object',
                properties: {
                    day: { type: 'string' },
                    notes: { type: 'string' },
                    exercises: {
                        type: 'array',
                        minItems: 3,
                        items: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                sets: { type: 'number' },
                                reps: { type: 'string' },
                                rest: { type: 'string' },
                                focus: { type: 'string' },
                                equipment: { type: 'string' },
                            },
                            required: ['name', 'sets', 'reps', 'rest', 'focus', 'equipment'],
                            additionalProperties: false,
                        },
                    },
                },
                required: ['day', 'notes', 'exercises'],
                additionalProperties: false,
            },
        },
        diet: {
            type: 'array',
            minItems: 7,
            items: {
                type: 'object',
                properties: {
                    day: { type: 'string' },
                    hydration: { type: 'string' },
                    meals: {
                        type: 'array',
                        minItems: 4,
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                description: { type: 'string' },
                                calories: { type: 'number' },
                                protein: { type: 'string' },
                                carbs: { type: 'string' },
                                fats: { type: 'string' },
                            },
                            required: ['title', 'description', 'calories', 'protein', 'carbs', 'fats'],
                            additionalProperties: false,
                        },
                    },
                },
                required: ['day', 'hydration', 'meals'],
                additionalProperties: false,
            },
        },
        aiTips: {
            type: 'array',
            items: { type: 'string' },
            minItems: 3,
            maxItems: 6,
        },
        quote: { type: 'string' },
        createdAt: { type: 'string' },
        model: { type: 'string' },
    },
    required: ['workout', 'diet', 'aiTips', 'quote', 'createdAt', 'model'],
    additionalProperties: false,
};
async function listAvailableModels() {
    if (availableModels) {
        return availableModels;
    }
    availableModels = new Set();
    if (!config_1.config.geminiKey) {
        return availableModels;
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${config_1.config.geminiKey}`);
        if (!response.ok) {
            console.warn(`[gemini] Unable to list models: ${response.status} ${response.statusText}`);
            return availableModels;
        }
        const payload = (await response.json());
        payload.models?.forEach((model) => {
            const name = model.name?.replace(/^models\//, '');
            if (name) {
                availableModels?.add(name);
            }
        });
    }
    catch (error) {
        console.warn('[gemini] Failed to fetch models list', error);
    }
    return availableModels;
}
async function ensureModel() {
    if (cachedModel && cachedModelName) {
        return { model: cachedModel, name: cachedModelName };
    }
    if (!geminiClient) {
        throw new Error('Gemini API key missing. Set GEMINI_API_KEY in your environment.');
    }
    const candidates = Array.from(new Set([config_1.config.geminiModel, ...FALLBACK_MODELS].filter((name) => Boolean(name))));
    const available = await listAvailableModels();
    for (const candidate of candidates) {
        if (available.size > 0 && !available.has(candidate)) {
            continue;
        }
        try {
            const model = geminiClient.getGenerativeModel({
                model: candidate,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9,
                },
            });
            cachedModel = model;
            cachedModelName = candidate;
            return { model, name: candidate };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[gemini] Failed to initialize model ${candidate}: ${message}`);
        }
    }
    throw new Error('No compatible Gemini model available. Update GEMINI_MODEL or check your Generative Language API access.');
}
function buildSystemPrompt(profile) {
    return `You are an elite fitness coach and performance dietician.
Generate detailed structured workout and diet plans tailored to the user.
Tone: supportive, specific, safe. Assume user has medical clearance unless
medical history indicates otherwise. Factor in equipment availability and
workout location: ${profile.workoutLocation}. Diet must respect ${profile.dietaryPreference}.`;
}
function sanitizeJson(text) {
    if (!text)
        return '{}';
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
        return cleaned;
    }
    return cleaned.slice(firstBrace, lastBrace + 1);
}
async function generatePersonalizedPlan(payload) {
    const { model, name: modelName } = await ensureModel();
    const days = payload.planDuration ?? 7;
    const prompt = `
${buildSystemPrompt(payload.profile)}

User profile JSON:
${JSON.stringify(payload.profile, null, 2)}

Plan duration: ${days} days.

Respond ONLY with valid JSON that matches this schema:
${JSON.stringify(planSchema, null, 2)}

Never include markdown fences.`;
    const result = await model.generateContent(prompt);
    const raw = sanitizeJson(result.response.text() ?? '');
    let plan;
    try {
        plan = JSON.parse(raw);
    }
    catch (error) {
        console.error('[llm] Failed to parse Gemini response', raw);
        throw new Error(`Gemini response was not valid JSON: ${error.message}`);
    }
    plan.createdAt = plan.createdAt ?? new Date().toISOString();
    plan.model = plan.model ?? modelName;
    return plan;
}
async function generateMotivationQuote(profile, style) {
    const { model } = await ensureModel();
    const prompt = `
Craft one motivational quote (max 28 words) for a fitness enthusiast.
Tone: ${style ?? 'modern athletic'}.
Profile: ${profile.name}, goal ${profile.fitnessGoal}, level ${profile.fitnessLevel}, stress ${profile.stressLevel}.
Respond with plain text only.`;
    const result = await model.generateContent(prompt);
    const quote = result.response.text() ?? 'Stay consistent. Progress compounds daily.';
    return quote.replace(/^"|"$/g, '').trim();
}
