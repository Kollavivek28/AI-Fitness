"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExerciseImage = generateExerciseImage;
const DEFAULT_PROMPTS = {
    workout: 'Cinematic ultra-realistic fitness photography shot on DSLR, dramatic lighting, professional athlete performing',
    meal: 'Studio food photography, vibrant colors, plated gourmet dish, appetizing lighting, shallow depth of field',
    generic: 'High-quality concept art, soft lighting, rendered in detail',
};
function generateExerciseImage(prompt, type = 'generic') {
    const base = DEFAULT_PROMPTS[type] ?? DEFAULT_PROMPTS.generic;
    const finalPrompt = `${base}: ${prompt}`;
    const seed = Math.floor(Math.random() * 10000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=512&height=512&seed=${seed}`;
    return url;
}
