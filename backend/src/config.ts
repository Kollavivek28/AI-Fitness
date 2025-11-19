import dotenv from 'dotenv';

dotenv.config();

const requiredEnv: string[] = [];

requiredEnv.forEach((name) => {
  if (!process.env[name]) {
    console.warn(`[config] Environment variable ${name} is not set. Some features will be disabled.`);
  }
});

const sanitizeGeminiModel = (value?: string | null) => {
  if (!value) return '';
  return value.replace(/^GEMINI_MODEL=/i, '').trim();
};

export const config = {
  port: Number(process.env.PORT) || 5000,
  openAiKey: process.env.OPENAI_API_KEY ?? '',
  openAiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  imageModel: process.env.IMAGE_MODEL ?? 'gpt-image-1',
  geminiKey: process.env.GEMINI_API_KEY ?? '',
  geminiModel: sanitizeGeminiModel(process.env.GEMINI_MODEL) || 'gemini-1.5-pro',
  voiceApiKey: process.env.ELEVENLABS_API_KEY ?? '',
  voiceModel: process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
};

export const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseAnonKey);

