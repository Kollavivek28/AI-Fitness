## AI Fitness Studio

An AI-powered fitness assistant that generates hyper-personalized workout and diet plans using LLMs, complete with text-to-speech playback, on-demand AI imagery, PDF export, local storage, and dark/light modes. The project is split into a React frontend (`frontend/`) and an Express + TypeScript backend (`backend/`).

### Highlights
- Collect rich user context: demographics, body metrics, goal, level, workout location, dietary preferences, stress level, equipment access, and medical notes.
- LLM-backed plan generation (Gemini 1.5 by default) for multi-day workout & diet schedules, posture tips, and motivational quotes.
- Voice narration via ElevenLabs, AI image generation per exercise/meal, and animated UI with Framer Motion.
- Export plans as PDF, store them locally (browser `localStorage`) or optionally in Supabase.
- Smooth glassmorphism UI, dark/light toggle, regeneration flow, and toast feedback.

---

## Getting Started

### 1. Backend (`/backend`)
1. Install deps:
   ```bash
   cd backend
   npm install
   ```
2. Copy the environment template (if you can't create `.env`, set vars manually in your shell/env manager):
   ```
   PORT=5000
   GEMINI_API_KEY=your-gemini-key
   GEMINI_MODEL=gemini-1.5-pro       # optional; fallback tries gemini-1.5-pro then gemini-1.5-flash
   OPENAI_API_KEY=sk-...                # still used for image generation
   OPENAI_MODEL=gpt-4o-mini
   IMAGE_MODEL=gpt-image-1
   ELEVENLABS_API_KEY=your-voice-api-key
   ELEVENLABS_MODEL=eleven_multilingual_v2
   SUPABASE_URL=https://your-project.supabase.co   # optional
   SUPABASE_ANON_KEY=your-anon-key                 # optional
   ```
3. Run locally:
   ```bash
   npm run dev
   ```
4. Production build:
   ```bash
   npm run build
   npm start
   ```

#### Key Endpoints (`/api`)
| Method | Path            | Description                                  |
|--------|-----------------|----------------------------------------------|
| POST   | `/plan`         | Generate workout/diet/tips plan via LLM      |
| POST   | `/voice`        | Convert a plan section to narrated audio     |
| POST   | `/image`        | AI image for selected exercise/meal          |
| POST   | `/export/pdf`   | Return base64 PDF of the current plan        |
| POST   | `/plans`        | Optional Supabase save (if configured)       |
| GET    | `/plans/:id`    | Fetch saved plan from Supabase               |
| GET    | `/health`       | Basic health check                           |

### 2. Frontend (`/frontend`)
1. Install deps:
   ```bash
   cd frontend
   npm install
   ```
2. Configure the API base (defaults to `http://localhost:5000/api`). Set `VITE_API_URL` in your env if needed.
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

---

## Architecture Overview
- **Backend**: Express + TypeScript. Services for LLM prompts (Gemini 1.5 via `@google/generative-ai` v1 API with automatic model fallback), ElevenLabs TTS, OpenAI Images, PDFKit export, and optional Supabase storage. Cleanly separated routes and helpers with strong typing and error handling.
- **Frontend**: React (Vite) + TailwindCSS + Framer Motion. Componentized form, action bar, plan viewer, stats, and modals. Uses Axios for API calls, React Hook Form + Zod for validation, local storage hook, and React Hot Toast notifications.
- **Voice & Image**: Backend wrappers accept text/prompts and return base64 audio or hosted image URLs, keeping API keys server-side.
- **Persistence**: Browser `localStorage` remembers the last plan; Supabase integration can be enabled server-side without touching the UI.
- **Export**: PDFKit composes multi-page PDFs with workouts, meals, and AI tips for offline sharing.

---

## Supabase Table (Optional Cloud Storage)
If you plan to persist plans remotely, create the `ai_plans` table in Supabase:
```sql
create table if not exists public.ai_plans (
  id uuid primary key default gen_random_uuid(),
  profile jsonb not null,
  plan jsonb not null,
  storage_key text,
  created_at timestamptz default now()
);
```

Enable Row Level Security and allow inserts/selects for your desired role (example for anon key during prototyping):
```sql
alter table public.ai_plans enable row level security;

create policy "anon_insert_plan"
  on public.ai_plans
  for insert
  with check (true);

create policy "anon_select_plan"
  on public.ai_plans
  for select
  using (true);
```

Finally, add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `backend/.env` (or your environment manager) and restart the backend so it can connect.

---

## Next Steps / Ideas
- Wire additional providers (Gemini, Claude, X.ai, Replicate) via the same service layer.
- Add authentication and multi-user plans stored in Supabase/Postgres.
- Schedule reminders/push notifications, wearable integrations, or Apple/Google Health sync.
- Bundle the backend for serverless platforms (Vercel/Netlify functions) or containerize for deployment.

Enjoy building and iterating on your AI Fitness Studio! 💪

