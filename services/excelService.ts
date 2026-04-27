import * as XLSX from 'xlsx';
import { Patient, Question } from '../types';
import { SURVEY_QUESTIONS, FOLLOWUP_QUESTIONS, ALL_CASCADES, EVENTS } from '../constants';

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

export const exportToExcel = (patients: Patient[]) => {
  const allSurveyQuestions = flattenQuestions(SURVEY_QUESTIONS);
  const allFollowupQuestions = flattenQuestions(FOLLOWUP_QUESTIONS);
  const surveyAltroIds = getAltroQuestionIds(SURVEY_QUESTIONS);
  const followupAltroIds = getAltroQuestionIds(FOLLOWUP_QUESTIONS);

  // 1. Prepare Header Row
  const headers: string[] = [
    'ID Sistema',
    'Codice Paziente',
    'Evento',
    'Città',
    'Operatore',
    'Data Inserimento',
  ];

  // Add survey question headers (with note columns for "Altro" questions)
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

  // 2. Map Data Rows
  const data = patients.map(p => {
    const cascade = ALL_CASCADES.find(c => c.id === p.cascadeId);
    const event = EVENTS.find(e => e.id === cascade?.eventId);

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

    // Append main answers
    allSurveyQuestions.forEach(q => {
      row.push(formatAnswer(p.answers[q.id]));
      if (surveyAltroIds.includes(q.id)) {
        row.push(p.answers[`${q.id}_altro_note`] || '');
      }
    });

    // Append followup answers
    allFollowupQuestions.forEach(q => {
      row.push(p.followupAnswers ? formatAnswer(p.followupAnswers[q.id]) : '');
      if (followupAltroIds.includes(q.id)) {
        row.push(p.followupAnswers ? (p.followupAnswers[`${q.id}_altro_note`] || '') : '');
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