export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Cascade {
  id: string;
  eventId: string;
  city: string;
  label: string; // e.g. "Summeet Milano 2024"
}

export interface EventOption {
  id: string;
  name: string;
  date: string;
  cascades: Cascade[];
}

export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  role: UserRole;
  cascadeId?: string; // Admin doesn't need one
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'number';
  options?: string[]; // For multiple choice
}

export interface Patient {
  id: string;
  userId: string;
  cascadeId: string;
  name: string;
  surname: string;
  answers: Record<string, string>; // Main survey answers
  followupAnswers?: Record<string, string> | null; // Follow-up answers (added later)
  timestamp: string;
  operatorUsername: string; // Who collected the data
}

export interface DashboardStats {
  totalPatients: number;
  patientsByCascade: Record<string, number>;
}