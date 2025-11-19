"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeVoice = synthesizeVoice;
const config_1 = require("../config");
const DEFAULT_VOICE = 'Rachel';
async function synthesizeVoice(payload) {
    if (!config_1.config.voiceApiKey) {
        throw new Error('Voice synthesis requires ELEVENLABS_API_KEY.');
    }
    const voiceId = payload.voice ?? DEFAULT_VOICE;
    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'xi-api-key': config_1.config.voiceApiKey,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
            model_id: config_1.config.voiceModel,
            text: payload.text,
            voice_settings: {
                stability: 0.35,
                similarity_boost: 0.75,
                style: payload.section === 'diet' ? 0.4 : 0.55,
            },
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Voice API failed: ${response.status} ${errorText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString('base64');
}
