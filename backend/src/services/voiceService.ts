import { config } from '../config';

interface VoicePayload {
  text: string;
  voice?: string; // name or voice_id
  section?: 'workout' | 'diet' | 'tips';
}

// Built-in voice_id values that ALWAYS exist on ElevenLabs accounts
const VOICE_MAP: Record<string, string> = {
  Rachel: 'EXAVITQu4vr4xnSDxMaL',
  Bella: 'JBFqnCBsd6RMkjVDRZzb',
  Sarah: 'MjD8LmnrkVQYuEJdH9xf',
};

// Choose default
const DEFAULT_VOICE = VOICE_MAP.Rachel;

function resolveVoiceId(voice?: string): string {
  if (!voice) return DEFAULT_VOICE;

  // If passed voice name exists in map → return ID
  if (VOICE_MAP[voice]) return VOICE_MAP[voice];

  // If user passes a real voice_id → use directly
  if (/^[A-Za-z0-9]{10,}$/.test(voice)) return voice;

  // Fallback
  return DEFAULT_VOICE;
}

export async function synthesizeVoice(payload: VoicePayload): Promise<string> {
  if (!config.voiceApiKey) {
    throw new Error('Voice synthesis requires ELEVENLABS_API_KEY.');
  }

  const voiceId = resolveVoiceId(payload.voice);

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': config.voiceApiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      model_id: config.voiceModel,
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
