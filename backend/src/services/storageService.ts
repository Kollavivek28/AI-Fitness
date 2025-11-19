import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config, isSupabaseConfigured } from '../config';
import { PlanResponse, PlanSavePayload, UserProfile } from '../types';

let supabase: SupabaseClient | null = null;

function ensureClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }
  if (!supabase) {
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  }
  return supabase;
}

export async function savePlan(payload: PlanSavePayload) {
  const client = ensureClient();
  const { data, error } = await client.from('ai_plans').insert([
      {
        profile: payload.profile,
        plan: payload.plan,
        storage_key: payload.storageKey ?? null,
      },
    ]).select().single();

  if (error) {
    throw error;
  }
  return data;
}

export async function fetchPlan(id: string): Promise<{ plan: PlanResponse; profile: UserProfile } | null> {
  const client = ensureClient();
  const { data, error } = await client.from('ai_plans').select('*').eq('id', id).single();
  if (error) {
    throw error;
  }
  return data;
}

