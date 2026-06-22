import * as XLSX from 'xlsx';
import { Patient, Question } from '../types';
import { SURVEY_QUESTIONS, SURVEY_QUESTIONS_SGLT2I, FOLLOWUP_QUESTIONS, ALL_CASCADES, EVENTS } from '../constants';

// Helper to flatten questions including subQuestions
const flattenQuestions = (questions: Question[]): Question[] => {
  let flat: Question[] = [];
  questions.forEach(q => {
    flat.push(q);
    if (q.subQuestions) {
      flat = flat.concat(flattenQuestions(q.subQuestions));
    }
  });
  return flat;
};

// Helper to get questions that have an "Altro" option (including subquestions)
const getAltroQuestionIds = (questions: Question[]): string[] => {
  const ids: string[] = [];
  questions.forEach(q => {
    if (q.options?.includes('Altro')) ids.push(q.id);
    if (q.subQuestions) ids.push(...getAltroQuestionIds(q.subQuestions));
  });
  return ids;
};

// Helper to determine formType for a patient based on their cascade/event
const getPatientFormType = (patient: Patient): string => {
  const cascade = ALL_CASCADES.find(c => c.id === patient.cascadeId);
  const event = EVENTS.find(e => e.id === cascade?.eventId);
  return event?.formType || 'standard';
};

export const exportToExcel = (patients: Patient[]) => {
  const allSurveyQuestions = flattenQuestions(SURVEY_QUESTIONS);
  const allFollowupQuestions = flattenQuestions(FOLLOWUP_QUESTIONS);
  const allSglt2iQuestions = flattenQuestions(SURVEY_QUESTIONS_SGLT2I);
  const surveyAltroIds = getAltroQuestionIds(SURVEY_QUESTIONS);
  const followupAltroIds = getAltroQuestionIds(FOLLOWUP_QUESTIONS);
  const sglt2iAltroIds = getAltroQuestionIds(SURVEY_QUESTIONS_SGLT2I);

  // 1. Prepare Header Row
  const headers: string[] = [
    'ID Sistema',
    'Codice Paziente',
    'Evento',
    'Città',
    'Operatore',
    'Data Inserimento',
  ];

  // Add standard survey question headers (with note columns for "Altro" questions)
  allSurveyQuestions.forEach(q => {
    headers.push(`[Scheda] ${q.text}`);
    if (surveyAltroIds.includes(q.id)) {
      headers.push(`[Scheda] ${q.text} - Note Altro`);
    }
  });

  // Add followup question headers (with note columns for "Altro" questions)
  allFollowupQuestions.forEach(q => {
    headers.push(`[Followup] ${q.text}`);
    if (followupAltroIds.includes(q.id)) {
      headers.push(`[Followup] ${q.text} - Note Altro`);
    }
  });

  // Add SGLT2i (SCHEDA RESET) question headers
  allSglt2iQuestions.forEach(q => {
    headers.push(`[RESET] ${q.text}`);
    if (sglt2iAltroIds.includes(q.id)) {
      headers.push(`[RESET] ${q.text} - Note Altro`);
    }
  });

  // 2. Map Data Rows
  const data = patients.map(p => {
    const cascade = ALL_CASCADES.find(c => c.id === p.cascadeId);
    const event = EVENTS.find(e => e.id === cascade?.eventId);
    const patientFormType = getPatientFormType(p);

    const row: (string | number)[] = [
      p.id,
      p.clinicalCode,
      event?.name || 'Sconosciuto',
      cascade?.city || '-',
      p.operatorUsername || '-',
      new Date(p.timestamp).toLocaleString(),
    ];

    // Helper to format answers (join arrays for multi-select)
    const formatAnswer = (ans: any) => {
      if (Array.isArray(ans)) return ans.join(', ');
      return ans || '';
    };

    // Append standard survey answers (empty if SGLT2i patient)
    allSurveyQuestions.forEach(q => {
      row.push(patientFormType === 'standard' ? formatAnswer(p.answers[q.id]) : '');
      if (surveyAltroIds.includes(q.id)) {
        row.push(patientFormType === 'standard' ? (p.answers[`${q.id}_altro_note`] || '') : '');
      }
    });

    // Append followup answers (empty if SGLT2i patient)
    allFollowupQuestions.forEach(q => {
      if (patientFormType === 'standard') {
        row.push(p.followupAnswers ? formatAnswer(p.followupAnswers[q.id]) : '');
        if (followupAltroIds.includes(q.id)) {
          row.push(p.followupAnswers ? (p.followupAnswers[`${q.id}_altro_note`] || '') : '');
        }
      } else {
        row.push('');
        if (followupAltroIds.includes(q.id)) {
          row.push('');
        }
      }
    });

    // Append SGLT2i (SCHEDA RESET) answers (empty if standard patient)
    allSglt2iQuestions.forEach(q => {
      row.push(patientFormType === 'sglt2i' ? formatAnswer(p.answers[q.id]) : '');
      if (sglt2iAltroIds.includes(q.id)) {
        row.push(patientFormType === 'sglt2i' ? (p.answers[`${q.id}_altro_note`] || '') : '');
      }
    });

    return row;
  });

  // 3. Create Worksheet
  const worksheetData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // 4. Create Workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dati Clinici");

  // 5. Download File
  XLSX.writeFile(wb, `Report_Clinico_DMT2_${new Date().toISOString().slice(0, 10)}.xlsx`);
};