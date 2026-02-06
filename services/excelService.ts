import * as XLSX from 'xlsx';
import { SurveyResponse, Question, EventOption } from '../types';
import { MOCK_EVENTS, SURVEY_QUESTIONS } from '../constants';

export const exportToExcel = (responses: SurveyResponse[]) => {
  // 1. Prepare Header Row
  // ID Risposta, ID Utente, Data Compilazione, Evento, Città, Data Evento, Nome Utente, [Questions...]
  
  const headers = [
    'ID Risposta',
    'ID Utente', // Represents the individual
    'Data Compilazione',
    'Evento',
    'Città',
    'Data Evento',
    'Nome Utente',
    ...SURVEY_QUESTIONS.map(q => q.text)
  ];

  // 2. Map Data Rows
  const data = responses.map(res => {
    const event = MOCK_EVENTS.find(e => e.id === res.eventId);
    
    // Create base row
    const row: (string | number)[] = [
      res.id,
      res.userId,
      new Date(res.timestamp).toLocaleString(),
      event?.name || 'Evento Sconosciuto',
      event?.city || '-',
      event?.date || '-',
      res.username
    ];

    // Append answers in order of questions
    SURVEY_QUESTIONS.forEach(q => {
      row.push(res.answers[q.id] || '');
    });

    return row;
  });

  // 3. Create Worksheet
  const worksheetData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // 4. Create Workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Risposte");

  // 5. Download File
  XLSX.writeFile(wb, `Logica_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
};