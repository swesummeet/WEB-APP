import { EventOption, Question } from './types';

export const ADMIN_CREDENTIALS = {
  username: 'summeet',
  password: 'maspero05',
};

// Real Events and Cascades
export const EVENTS: EventOption[] = [
  {
    id: 'ev_react_now',
    name: 'RE-ACT NOW',
    date: '2026',
    cascades: [
      { id: 'cas_react_corbetta', eventId: 'ev_react_now', city: 'Corbetta', label: 'RE-ACT NOW – Corbetta (19/03/26)' },
      { id: 'cas_react_milano', eventId: 'ev_react_now', city: 'Milano', label: 'RE-ACT NOW – Milano (14/04/26)' },
      { id: 'cas_react_lomazzo', eventId: 'ev_react_now', city: 'Lomazzo', label: 'RE-ACT NOW – Lomazzo (24/04/26)' },
    ],
  },
  {
    id: 'ev_act_now_dmt2',
    name: 'ACT NOW DMT2',
    date: '2026',
    cascades: [
      { id: 'cas_act_dmt2_gela', eventId: 'ev_act_now_dmt2', city: 'Gela', label: 'ACT NOW DMT2 – Gela (21/03/26)' },
    ],
  },
  {
    id: 'ev_act_now_3',
    name: 'ACT NOW 3.0',
    date: '2026',
    cascades: [
      { id: 'cas_act_3_dalmine', eventId: 'ev_act_now_3', city: 'Dalmine', label: 'ACT NOW 3.0 – Dalmine (06/05/26)' },
      { id: 'cas_act_3_vigevano', eventId: 'ev_act_now_3', city: 'Vigevano (PV)', label: 'ACT NOW 3.0 – Vigevano (PV) (19/05/26)' },
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