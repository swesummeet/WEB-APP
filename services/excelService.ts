import * as XLSX from 'xlsx';
import { Patient } from '../types';
import { SURVEY_QUESTIONS, FOLLOWUP_QUESTIONS, ALL_CASCADES, EVENTS } from '../constants';

export const exportToExcel = (patients: Patient[]) => {
  // 1. Prepare Header Row
  // ID, Nome Paziente, Cognome Paziente, Evento, Città, Operatore, Data Inserimento, [Main Questions...], [Followup Questions...]

  const headers = [
    'ID Paziente',
    'Nome Paziente',
    'Cognome Paziente',
    'Evento',
    'Città',
    'Operatore',
    'Data Inserimento',
    ...SURVEY_QUESTIONS.map(q => `[Scheda] ${q.text}`),
    ...FOLLOWUP_QUESTIONS.map(q => `[Followup] ${q.text}`)
  ];

  // 2. Map Data Rows
  const data = patients.map(p => {
    const cascade = ALL_CASCADES.find(c => c.id === p.cascadeId);
    const event = EVENTS.find(e => e.id === cascade?.eventId);

    // Create base row
    const row: (string | number)[] = [
      p.id,
      p.name,
      p.surname,
      event?.name || 'Sconosciuto',
      cascade?.city || '-',
      p.operatorUsername || '-',
      new Date(p.timestamp).toLocaleString(),
    ];

    // Append main answers
    SURVEY_QUESTIONS.forEach(q => {
      row.push(p.answers[q.id] || '');
    });

    // Append followup answers
    FOLLOWUP_QUESTIONS.forEach(q => {
      row.push(p.followupAnswers ? p.followupAnswers[q.id] || '' : '');
    });

    return row;
  });

  // 3. Create Worksheet
  const worksheetData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // 4. Create Workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pazienti");

  // 5. Download File
  XLSX.writeFile(wb, `Logica_Report_Pazienti_${new Date().toISOString().slice(0, 10)}.xlsx`);
};