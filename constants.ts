import { EventOption, Question } from './types';

export const ADMIN_CREDENTIALS = {
  username: 'summeet',
  password: 'maspero05',
};

// Each event has multiple cascades (cities)
export const EVENTS: EventOption[] = [
  {
    id: 'ev_001',
    name: 'Summeet 2024',
    date: '2024',
    cascades: [
      { id: 'cas_001_mi', eventId: 'ev_001', city: 'Milano', label: 'Summeet 2024 – Milano' },
      { id: 'cas_001_ro', eventId: 'ev_001', city: 'Roma', label: 'Summeet 2024 – Roma' },
      { id: 'cas_001_to', eventId: 'ev_001', city: 'Torino', label: 'Summeet 2024 – Torino' },
    ],
  },
  {
    id: 'ev_002',
    name: 'Summeet 2025',
    date: '2025',
    cascades: [
      { id: 'cas_002_mi', eventId: 'ev_002', city: 'Milano', label: 'Summeet 2025 – Milano' },
      { id: 'cas_002_ro', eventId: 'ev_002', city: 'Roma', label: 'Summeet 2025 – Roma' },
      { id: 'cas_002_to', eventId: 'ev_002', city: 'Torino', label: 'Summeet 2025 – Torino' },
    ],
  },
];

// Flat list of all cascades (for lookups)
export const ALL_CASCADES = EVENTS.flatMap(ev => ev.cascades);

// --- Main Survey Questions (compiled at time of patient registration) ---
export const SURVEY_QUESTIONS: Question[] = [
  // --- DATI GENERALI ---
  {
    id: 'eta',
    text: 'Età',
    type: 'number',
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

// --- Follow-up Questions (compiled after the initial visit) ---
export const FOLLOWUP_QUESTIONS: Question[] = [
  {
    id: 'fu_pressione',
    text: 'Pressione arteriosa sistolica (mmHg)',
    type: 'number',
  },
  {
    id: 'fu_glicemia',
    text: 'Glicemia a digiuno (mg/dL)',
    type: 'number',
  },
  {
    id: 'fu_colesterolo',
    text: 'Colesterolo totale (mg/dL)',
    type: 'number',
  },
  {
    id: 'fu_bmi',
    text: 'BMI',
    type: 'number',
  },
  {
    id: 'fu_outcome',
    text: 'Esito screening',
    type: 'multiple_choice',
    options: ['Nella norma', 'Richiede follow-up', 'Inviato a specialista'],
  },
  {
    id: 'fu_note',
    text: 'Note cliniche',
    type: 'text',
  },
];