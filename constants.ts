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

export const ALL_CASCADES = EVENTS.flatMap(ev => ev.cascades);

// --- New Clinical Survey Questions (DMT2) ---
export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 'tipologia_paziente',
    text: 'TIPOLOGIA DI PAZIENTE',
    type: 'multiple_choice',
    options: [
      'Paziente in terapia con Metformina',
      'Paziente in terapia con SU in monoterapia o in associazione',
      'Paziente in terapia con DDP4i in monoterapia o in associazione',
      'Paziente in terapia con GLP1ra in monoterapia o in associazione',
      'Paziente in terapia con doppio agonista recettoriale GIP/GLP1, in monoterapia o in associazione',
      'Paziente naive a trattamento per DMT2',
      'Altro'
    ],
  },
  {
    id: 'sesso',
    text: 'SESSO',
    type: 'multiple_choice',
    options: ['M', 'F'],
  },
  {
    id: 'eta',
    text: 'ETA’ COMPIUTA',
    type: 'number',
  },
  {
    id: 'peso',
    text: 'PESO (kg)',
    type: 'number',
  },
  {
    id: 'bmi',
    text: 'BMI',
    type: 'number',
  },
  {
    id: 'durata_diabete',
    text: 'DURATA DI DIABETE (anni)',
    type: 'number',
  },
  {
    id: 'fattori_rischio',
    text: 'FATTORI DI RISCHIO',
    type: 'multi_select',
    options: [
      'malattia multivasale o stenosi >50%',
      'eta’>50',
      'obesita’',
      'fumo',
      'dislipidemia',
      'ipertensione'
    ],
  },
  {
    id: 'mcv_diagnosticata',
    text: 'MCV DIAGNOSTICATA',
    type: 'multiple_choice',
    options: ['SI', 'NO'],
    subQuestions: [
      {
        id: 'mcv_dettaglio',
        text: 'Selezionare una o più patologie MCV:',
        type: 'multi_select',
        options: [
          'scompenso cardiaco',
          'fibrillazione atriale',
          'cardiopatia ischemica',
          'IMA',
          'bypass aortocoronarico',
          'PCA',
          'coronaropatia',
          'arteriopatia periferica sintomatica'
        ]
      }
    ]
  },
  {
    id: 'danno_organo',
    text: 'DANNO D’ORGANO',
    type: 'multiple_choice',
    options: ['SI', 'NO'],
    subQuestions: [
      {
        id: 'danno_organo_dettaglio',
        text: 'Selezionare uno o più danni:',
        type: 'multi_select',
        options: [
          'Ipertrofia ventricolare sinistra',
          'Retinopatia',
          'Insufficienza renale'
        ]
      }
    ]
  },
  {
    id: 'hba1c',
    text: 'HBA1C (%)',
    type: 'number',
  },
  {
    id: 'albuminuria',
    text: 'ALBUMINURIA',
    type: 'multiple_choice',
    options: [
      'Non misurata',
      '<30 MG/G',
      '30-300 mg/g',
      '>300 mg/g'
    ],
  },
  {
    id: 'creatinina',
    text: 'CREATININA (mg/dl)',
    type: 'number',
  },
  {
    id: 'egfr',
    text: 'EGFR (mL/min/1.73m2)',
    type: 'number',
  },
  {
    id: 'ntprobnp',
    text: 'NTproBNP pg/ml',
    type: 'multiple_choice',
    options: [
      '< 125',
      '126 - 300',
      '301 – 450',
      '451 – 900',
      '> 900'
    ],
  },
  {
    id: 'terapie_non_diabetologiche',
    text: 'TERAPIE NON DIABETOLOGICHE',
    type: 'multiple_choice',
    options: ['SI', 'NO'],
    subQuestions: [
      {
        id: 'terapie_non_diab_dettaglio',
        text: 'Selezionare una o più terapie:',
        type: 'multi_select',
        options: [
          'Statine/ezetimibe/PCSK9i',
          'Antipertensivi',
          'Diuretici',
          'Antiaggreganti',
          'Anticoagulanti',
          'Antiaritmici'
        ]
      }
    ]
  },
  {
    id: 'sospensione_terapia',
    text: 'SOSPENSIONE TERAPIA IN ATTO',
    type: 'multiple_choice',
    options: ['SI', 'NO'],
  },
  {
    id: 'inserimento_terapeutico',
    text: 'INSERIMENTO TERAPEUTICO',
    type: 'multi_select', // Can be mono or association
    options: [
      'Dapagliflozin',
      'Empagliflozin',
      'Canagliflozin',
      'Ertugliflozin',
      'Nessuno',
      'Altro'
    ],
  },
];

// --- New Clinical Follow-up Questions ---
export const FOLLOWUP_QUESTIONS: Question[] = [
  {
    id: 'fu_bmi',
    text: 'BMI',
    type: 'number',
  },
  {
    id: 'fu_terapie_non_diabetologiche',
    text: 'TERAPIE NON DIABETOLOGICHE',
    type: 'multiple_choice',
    options: ['SI', 'NO'],
    subQuestions: [
      {
        id: 'fu_terapie_non_diab_dettaglio',
        text: 'Selezionare una o più terapie:',
        type: 'multi_select',
        options: [
          'Statine/PCSK9i',
          'Antipertensivi',
          'Diuretici',
          'Antiaggreganti',
          'Anticoagulanti',
          'Antiaritmici'
        ]
      }
    ]
  },
  {
    id: 'fu_hba1c',
    text: 'HBA1C (%)',
    type: 'number',
  },
  {
    id: 'fu_egfr',
    text: 'E-GFR (mL/min/1.73m2)',
    type: 'number',
  },
  {
    id: 'fu_albuminuria',
    text: 'ALBUMINURIA',
    type: 'multiple_choice',
    options: [
      'Non misurata',
      '<30 MG/G',
      '30-300 mg/g',
      '>300 mg/g'
    ],
  },
  {
    id: 'fu_proseguimento_terapia',
    text: 'PROSEGUIMENTO DELLA TERAPIA PER IL DMT2 IMPOSTATA IN PRIMA VISITA',
    type: 'multiple_choice',
    options: ['SI', 'NO'],
    visibilityValue: 'NO',
    subQuestions: [
      {
        id: 'fu_switch_terapia',
        text: 'Indicare SWITCH (selezionare una o più):',
        type: 'multi_select',
        options: [
          'Dapagliflozin',
          'Empagliflozin',
          'Canagliflozin',
          'Ertugliflozin',
          'Nessuna (o interruzione terapia con gliflozina)',
          'Altro'
        ]
      }
    ]
  },
];