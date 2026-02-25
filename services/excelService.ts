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

export const exportToExcel = (patients: Patient[]) => {
  const allSurveyQuestions = flattenQuestions(SURVEY_QUESTIONS);
  const allFollowupQuestions = flattenQuestions(FOLLOWUP_QUESTIONS);

  // 1. Prepare Header Row
  const headers = [
    'ID Sistema',
    'Codice Paziente',
    'Evento',
    'Città',
    'Operatore',
    'Data Inserimento',
    ...allSurveyQuestions.map(q => `[Scheda] ${q.text}`),
    ...allFollowupQuestions.map(q => `[Followup] ${q.text}`)
  ];

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
    });

    // Append followup answers
    allFollowupQuestions.forEach(q => {
      row.push(p.followupAnswers ? formatAnswer(p.followupAnswers[q.id]) : '');
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