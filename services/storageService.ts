import { User, SurveyResponse, UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';
import { ADMIN_CREDENTIALS } from '../constants';

// --- In-Memory Storage for Demo Mode ---
const DEMO_RESPONSES: SurveyResponse[] = [];

// --- Auth & User Services ---

export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      username: data.username,
      role: data.role as UserRole,
      eventId: data.event_id
    };
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

export const registerUser = async (user: Omit<User, 'id'> & { password: string }): Promise<User | null> => {
  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', user.username)
      .single();

    if (existing) {
      throw new Error("Username already taken");
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: user.username,
        password: user.password,
        name: user.name,
        surname: user.surname,
        role: user.role,
        event_id: user.eventId
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      username: data.username,
      role: data.role as UserRole,
      eventId: data.event_id
    };
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
};

// --- Response Services ---

export const getResponses = async (): Promise<SurveyResponse[]> => {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.warn("Supabase load error:", error.message);
    return DEMO_RESPONSES;
  }

  const dbResponses = data.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    eventId: row.event_id,
    username: row.username,
    answers: row.answers,
    timestamp: row.timestamp
  }));

  return [...DEMO_RESPONSES, ...dbResponses];
};

export const getUserResponseCount = async (userId: string): Promise<number> => {
  if (userId === 'demo_user_preview') {
    return DEMO_RESPONSES.filter(r => r.userId === userId).length;
  }

  const { count, error } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error("Error counting user responses", error);
    return 0;
  }
  return count || 0;
};

export const saveResponse = async (response: SurveyResponse): Promise<void> => {
  // 1. Demo Mode Check
  if (response.userId === 'demo_user_preview') {
    console.log("Saving demo response to local memory:", response);
    DEMO_RESPONSES.push(response);
    return Promise.resolve();
  }

  console.log("Attempting to save to Supabase:", response);

  // 2. Real Database Save
  // We use .select() at the end to force Supabase to return the row or throw an error immediately.
  const { data, error } = await supabase
    .from('responses')
    .insert([{
      id: response.id, 
      user_id: response.userId,
      event_id: response.eventId,
      username: response.username,
      answers: response.answers,
      timestamp: response.timestamp
    }])
    .select(); // <--- IMPORTANTE: Senza questo, l'errore a volte viene ignorato in v2

  if (error) {
    console.error("Supabase CRITICAL Save Error:", error);
    throw new Error(error.message);
  }

  console.log("Supabase Save Success:", data);
};

// --- Init ---
export const initStorage = async () => {
    // No-op
};