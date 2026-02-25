import { User, Patient, UserRole } from '../types';
import { apiFetch } from '../lib/supabaseClient';

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
        cascadeId: user.cascadeId,
      }),
    });
    return newUser as User;
  } catch (err: any) {
    console.error('Registration error:', err);
    throw err;
  }
};

// --- Patient Services ---

export const getMyPatients = async (userId: string): Promise<Patient[]> => {
  try {
    return await apiFetch(`/api/patients?userId=${encodeURIComponent(userId)}`);
  } catch (err) {
    console.error('Error fetching my patients:', err);
    return [];
  }
};

export const getAllPatients = async (cascadeId?: string): Promise<Patient[]> => {
  try {
    const url = cascadeId
      ? `/api/patients?cascadeId=${encodeURIComponent(cascadeId)}`
      : '/api/patients';
    return await apiFetch(url);
  } catch (err) {
    console.error('Error fetching all patients:', err);
    return [];
  }
};

export const savePatient = async (patient: Patient): Promise<void> => {
  console.log('Attempting to save patient to Neon:', patient);

  await apiFetch('/api/save-patient', {
    method: 'POST',
    body: JSON.stringify({
      id: patient.id,
      userId: patient.userId,
      cascadeId: patient.cascadeId,
      operatorUsername: patient.operatorUsername,
      name: patient.name,
      surname: patient.surname,
      clinicalCode: patient.clinicalCode,
      answers: patient.answers,
      timestamp: patient.timestamp,
    }),
  });

  console.log('Patient Save Success');
};

export const saveFollowup = async (patientId: string, followupAnswers: Record<string, string>): Promise<void> => {
  console.log('Attempting to save followup for patient:', patientId);

  await apiFetch('/api/save-followup', {
    method: 'POST',
    body: JSON.stringify({
      patientId,
      followupAnswers,
    }),
  });

  console.log('Followup Save Success');
};

// --- Init ---
export const initStorage = async () => {
  // No-op
};