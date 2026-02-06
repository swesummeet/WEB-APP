import { EventOption, Question, UserRole } from './types';

export const ADMIN_CREDENTIALS = {
  username: 'summeet',
  password: 'maspero05',
};

// Events can now act as Screening Days or Locations
export const MOCK_EVENTS: EventOption[] = [
  { id: 'ev_001', name: 'Screening Piazza Duomo', date: '2024-05-15', city: 'Milano' },
  { id: 'ev_002', name: 'Giornata della Salute', date: '2024-06-20', city: 'Roma' },
  { id: 'ev_003', name: 'Check-up Torino', date: '2024-09-10', city: 'Torino' },
  { id: 'ev_004', name: 'Prevenzione Cardiovascolare', date: '2024-04-12', city: 'Milano' },
];

export const SURVEY_QUESTIONS: Question[] = [
  // --- DATI GENERALI ---
  {
    id: 'eta',
    text: 'Età',
    type: 'text',
  },
  {
    id: 'genere',
    text: 'Genere',
    type: 'multiple_choice',
    options: ['M', 'F'],
  },

  // --- ANAMNESI CLINICA ---
  {
    id: 'fumo',
    text: 'Fumo attivo o pregresso',
    type: 'multiple_choice',
    options: ['No', 'Attivo', 'Ex fumatore'],
  },
  {
    id: 'alcol',
    text: 'Consumo alcol',
    type: 'multiple_choice',
    options: ['No', 'Saltuario', 'Frequente'],
  },
  {
    id: 'fam_cardio',
    text: 'Familiarità per Malattie cardiovascolari precoci (età <55 M)',
    type: 'multiple_choice',
    options: ['Sì', 'No'],
  },
  {
    id: 'fam_diabete',
    text: 'Familiarità per Diabete tipo 2',
    type: 'multiple_choice',
    options: ['Sì', 'No', 'Non so'],
  },

  // --- STILI DI VITA ---
  {
    id: 'dieta',
    text: 'Segue una dieta bilanciata?',
    type: 'multiple_choice',
    options: ['Sì', 'No', 'Non sempre'],
  },
  {
    id: 'att_fisica',
    text: 'Pratica attività fisica regolare (almeno 150 min/settimana)?',
    type: 'multiple_choice',
    options: ['Sì', 'No'],
  },
  {
    id: 'insonnia',
    text: 'Soffre di insonnia o disturbi del sonno?',
    type: 'multiple_choice',
    options: ['Sì', 'No'],
  },

  // --- TERAPIE CRONICHE IN CORSO ---
  {
    id: 'terapia_ipertensione',
    text: 'Farmaci antiipertensivi in corso',
    type: 'multiple_choice',
    options: ['Sì', 'No'],
  },
  {
    id: 'terapia_statine',
    text: 'Statine o ipolipemizzanti in corso',
    type: 'multiple_choice',
    options: ['Sì', 'No'],
  },
  {
    id: 'terapia_diabete',
    text: 'Antidiabetici orali / insulina in corso',
    type: 'multiple_choice',
    options: ['Sì', 'No'],
  },
  {
    id: 'terapia_anticoagulanti',
    text: 'Anticoagulanti / antiaggreganti in corso',
    type: 'multiple_choice',
    options: ['Sì', 'No'],
  },
];