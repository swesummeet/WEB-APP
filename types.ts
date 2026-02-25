export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Cascade {
  id: string;
  eventId: string;
  city: string;
  label: string;
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
  cascadeId?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'number' | 'multi_select';
  options?: string[];
  subQuestions?: Question[]; // Conditional questions
  visibilityValue?: any;     // Value that triggers subQuestions (default 'SI')
}

export interface Patient {
  id: string;
  userId: string;
  cascadeId: string;
  name: string;       // Not used in new clinical logic, but kept for schema compatibility or internal ref
  surname: string;    // Same as above
  clinicalCode: string; // The new clinical code (initials + number)
  answers: Record<string, any>;
  followupAnswers?: Record<string, any> | null;
  timestamp: string;
  operatorUsername: string;
}

export interface DashboardStats {
  totalPatients: number;
  patientsByCascade: Record<string, number>;
}