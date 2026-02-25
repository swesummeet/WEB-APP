import { User, SurveyResponse, UserRole } from '../types';
import { apiFetch } from '../lib/supabaseClient';
import { ADMIN_CREDENTIALS } from '../constants';

// --- In-Memory Storage for Demo Mode ---
const DEMO_RESPONSES: SurveyResponse[] = [];

// --- Auth & User Services ---

export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const user = await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return user as User;
  } catch (err: any) {
    if (err.message && err.message.includes('non valide')) {
      return null;
    }
    console.error('Login error:', err);
    return null;
  }
};

export const registerUser = async (user: Omit<User, 'id'> & { password: string }): Promise<User | null> => {
  try {
    const newUser = await apiFetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: user.username,
        password: user.password,
        name: user.name,
        surname: user.surname,
        role: user.role,
        eventId: user.eventId,
      }),
    });
    return newUser as User;
  } catch (err: any) {
    console.error('Registration error:', err);
    throw err;
  }
};

// --- Response Services ---

export const getResponses = async (): Promise<SurveyResponse[]> => {
  try {
    const dbResponses = await apiFetch('/api/responses');
    return [...DEMO_RESPONSES, ...(dbResponses as SurveyResponse[])];
  } catch (err) {
    console.warn('Errore caricamento risposte:', err);
    return DEMO_RESPONSES;
  }
};

export const getUserResponseCount = async (userId: string): Promise<number> => {
  if (userId === 'demo_user_preview') {
    return DEMO_RESPONSES.filter(r => r.userId === userId).length;
  }

  try {
    const { count } = await apiFetch(`/api/user-response-count?userId=${encodeURIComponent(userId)}`);
    return count || 0;
  } catch (err) {
    console.error('Errore conteggio risposte utente:', err);
    return 0;
  }
};

export const saveResponse = async (response: SurveyResponse): Promise<void> => {
  // Demo Mode
  if (response.userId === 'demo_user_preview') {
    console.log('Saving demo response to local memory:', response);
    DEMO_RESPONSES.push(response);
    return Promise.resolve();
  }

  console.log('Attempting to save to Neon:', response);

  await apiFetch('/api/save-response', {
    method: 'POST',
    body: JSON.stringify({
      id: response.id,
      userId: response.userId,
      eventId: response.eventId,
      username: response.username,
      answers: response.answers,
      timestamp: response.timestamp,
    }),
  });

  console.log('Neon Save Success');
};

// --- Init ---
export const initStorage = async () => {
  // No-op
};