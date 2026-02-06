export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface EventOption {
  id: string;
  name: string;
  date: string;
  city: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  role: UserRole;
  eventId?: string; // Admin doesn't need an event
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice';
  options?: string[]; // For multiple choice
}

export interface SurveyResponse {
  id: string;
  userId: string;
  eventId: string;
  username: string; // Denormalized for easier export
  answers: Record<string, string>; // questionId -> answer
  timestamp: string;
}

export interface DashboardStats {
  totalResponses: number;
  responsesByEvent: Record<string, number>;
  recentResponses: SurveyResponse[];
}