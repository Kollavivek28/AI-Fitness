"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePlan = savePlan;
exports.fetchPlan = fetchPlan;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("../config");
let supabase = null;
function ensureClient() {
    if (!config_1.isSupabaseConfigured) {
        throw new Error('Supabase is not configured.');
    }
    if (!supabase) {
        supabase = (0, supabase_js_1.createClient)(config_1.config.supabaseUrl, config_1.config.supabaseAnonKey);
    }
    return supabase;
}
async function savePlan(payload) {
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
async function fetchPlan(id) {
    const client = ensureClient();
    const { data, error } = await client.from('ai_plans').select('*').eq('id', id).single();
    if (error) {
        throw error;
    }
    return data;
}
