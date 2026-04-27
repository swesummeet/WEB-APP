import React, { useState } from 'react';
import { User, Patient, Question } from '../types';
import { SURVEY_QUESTIONS, ALL_CASCADES } from '../constants';
import { savePatient } from '../services/storageService';
import { Button } from '../components/Button';
import { ArrowLeft, ClipboardList, Stethoscope, Check, Calculator } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';

interface SurveyFormProps {
  user: User;
  onBack: () => void;
}

// BMI = peso(kg) / (altezza(m))^2
const calculateBMI = (peso: number, altezza: number): string => {
  if (peso > 0 && altezza > 0) {
    const altezzaM = altezza / 100;
    return (peso / (altezzaM * altezzaM)).toFixed(1);
  }
  return '';
};

// CKD-EPI 2021 (race-free)
const calculateEGFR = (creatinina: number, eta: number, sesso: string): string => {
  if (creatinina > 0 && eta > 0 && (sesso === 'M' || sesso === 'F')) {
    const kappa = sesso === 'F' ? 0.7 : 0.9;
    const alpha = sesso === 'F' ? -0.241 : -0.302;
    const femaleFactor = sesso === 'F' ? 1.012 : 1;
    const scrOverKappa = creatinina / kappa;
    const egfr = 142
      * Math.pow(Math.min(scrOverKappa, 1), alpha)
      * Math.pow(Math.max(scrOverKappa, 1), -1.200)
      * Math.pow(0.9938, eta)
      * femaleFactor;
    return Math.round(egfr).toString();
  }
  return '';
};

export const SurveyForm: React.FC<SurveyFormProps> = ({ user, onBack }) => {
  const [clinicalCode, setClinicalCode] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const cascade = ALL_CASCADES.find(c => c.id === user.cascadeId);

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: value };

      // Auto-calculate BMI when peso or altezza change
      if (questionId === 'peso' || questionId === 'altezza') {
        const peso = parseFloat(questionId === 'peso' ? value : prev['peso']);
        const altezza = parseFloat(questionId === 'altezza' ? value : prev['altezza']);
        updated['bmi'] = calculateBMI(peso, altezza);
      }

      // Auto-calculate eGFR when creatinina, eta or sesso change
      if (questionId === 'creatinina' || questionId === 'eta' || questionId === 'sesso') {
        const creatinina = parseFloat(questionId === 'creatinina' ? value : prev['creatinina']);
        const eta = parseFloat(questionId === 'eta' ? value : prev['eta']);
        const sesso = questionId === 'sesso' ? value : prev['sesso'];
        updated['egfr'] = calculateEGFR(creatinina, eta, sesso);
      }

      // Clear "altro" note when a non-Altro single-choice option is selected
      if (!questionId.endsWith('_altro_note') && typeof value === 'string' && value !== 'Altro') {
        delete updated[`${questionId}_altro_note`];
      }

      return updated;
    });

    // Clear validation error when field is filled
    if (validationErrors.includes(questionId)) {
      setValidationErrors(prev => prev.filter(id => id !== questionId));
    }
  };

  const handleMultiSelect = (questionId: string, option: string) => {
    const currentValues = (answers[questionId] as string[]) || [];
    let newValues: string[];

    if (currentValues.includes(option)) {
      newValues = currentValues.filter(v => v !== option);
      // If "Altro" was deselected, clear the note
      if (option === 'Altro') {
        setAnswers(prev => ({
          ...prev,
          [questionId]: newValues,
          [`${questionId}_altro_note`]: undefined,
        }));
        return;
      }
    } else {
      newValues = [...currentValues, option];
    }

    handleInputChange(questionId, newValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredQuestions = SURVEY_QUESTIONS.filter(q => q.required);
    const missing = requiredQuestions.filter(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null || ans === '') return true;
      if (Array.isArray(ans) && ans.length === 0) return true;
      return false;
    });

    if (missing.length > 0) {
      setValidationErrors(missing.map(q => q.id));
      alert(`Compilare i campi obbligatori: ${missing.map(q => q.text).join(', ')}`);
      return;
    }

    setValidationErrors([]);
    setIsLoading(true);

    const entryId = 'paz_' + Math.random().toString(36).substring(2, 11);

    const patient: Patient = {
      id: entryId,
      userId: user.id,
      cascadeId: user.cascadeId!,
      operatorUsername: user.username,
      name: '',
      surname: '',
      clinicalCode: clinicalCode,
      answers,
      timestamp: new Date().toISOString()
    };

    try {
      await savePatient(patient);
      alert("Scheda salvata correttamente!");
      onBack();
    } catch (error: any) {
      console.error("Submission error details:", error);
      alert(`Errore durante il salvataggio: ${error.message || 'Errore sconosciuto'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestion = (q: Question) => {
    const targetValue = q.visibilityValue || 'SI';
    const isVisible = q.subQuestions ? answers[q.id] === targetValue : true;
    const hasError = validationErrors.includes(q.id);

    // Detect if any option is "Altro"
    const hasAltro = q.options?.some(o => o === 'Altro');
    const isAltroSelected = hasAltro && (
      q.type === 'multi_select'
        ? ((answers[q.id] as string[]) || []).includes('Altro')
        : answers[q.id] === 'Altro'
    );

    return (
      <div key={q.id} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <label className="block text-xl font-bold text-[#325D79] leading-tight">
          {q.text}
          {q.required && <span className="text-red-500 ml-1">*</span>}
          {q.computed && (
            <span className="inline-flex items-center gap-1 ml-2 text-xs font-bold text-[#9BD7D1] bg-[#9BD7D1]/10 px-2 py-0.5 rounded-full">
              <Calculator className="w-3 h-3" /> Auto
            </span>
          )}
        </label>

        {hasError && (
          <p className="text-red-500 text-xs font-bold animate-in fade-in duration-300">
            ⚠ Campo obbligatorio
          </p>
        )}

        {q.type === 'number' || q.type === 'text' ? (
          <input
            type={q.type}
            className={`w-full sm:w-1/2 p-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#F9A26C]/20 focus:border-[#F26627] outline-none font-bold text-2xl text-[#325D79] transition-all placeholder:text-slate-300 ${
              q.computed
                ? 'bg-[#9BD7D1]/10 border-[#9BD7D1]/40'
                : hasError
                  ? 'bg-red-50 border-red-300'
                  : 'bg-[#EFEEEE]/30 border-[#9BD7D1]/50'
            }`}
            placeholder={q.type === 'number' ? '0.0' : 'Scrivi qui...'}
            value={answers[q.id] || ''}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
          />
        ) : q.type === 'multi_select' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options?.map((option) => {
              const selectedArray = (answers[q.id] as string[]) || [];
              const isSelected = selectedArray.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleMultiSelect(q.id, option)}
                  className={`
                    flex items-center justify-between px-6 py-4 rounded-2xl border-2 text-sm font-black transition-all duration-300
                    ${isSelected
                      ? 'bg-[#F26627] border-[#F26627] text-white shadow-lg'
                      : 'bg-white border-[#9BD7D1]/50 text-[#325D79] hover:border-[#F9A26C]'}
                  `}
                >
                  <span className="text-left">{option}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className={`flex flex-wrap gap-4 ${hasError ? 'ring-2 ring-red-300 rounded-2xl p-2 bg-red-50/50' : ''}`}>
            {q.options?.map((option) => {
              const isSelected = answers[q.id] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange(q.id, option)}
                  className={`
                    px-8 py-4 rounded-2xl border-2 text-base font-black transition-all duration-300
                    ${isSelected
                      ? 'bg-[#F26627] border-[#F26627] text-white shadow-xl -translate-y-1'
                      : 'bg-white border-[#9BD7D1]/50 text-[#325D79] hover:bg-[#EFEEEE] hover:border-[#F9A26C]'}
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* "Altro" note field */}
        {isAltroSelected && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-bold text-[#F9A26C] mb-1">Specificare &quot;Altro&quot;:</label>
            <textarea
              className="w-full p-4 border-2 border-[#F9A26C]/50 rounded-2xl focus:ring-4 focus:ring-[#F9A26C]/20 focus:border-[#F26627] outline-none text-sm text-[#325D79] bg-[#EFEEEE]/30 transition-all resize-none"
              placeholder="Inserire note..."
              rows={3}
              value={answers[`${q.id}_altro_note`] || ''}
              onChange={(e) => handleInputChange(`${q.id}_altro_note`, e.target.value)}
            />
          </div>
        )}

        {/* Render Sub-questions if parent is "SI" */}
        {isVisible && q.subQuestions && (
          <div className="mt-6 ml-4 pl-6 border-l-4 border-[#F9A26C] space-y-8 py-4 bg-[#EFEEEE]/20 rounded-r-3xl animate-in slide-in-from-left-4 duration-500">
            {q.subQuestions.map(subQ => renderQuestion(subQ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-[#9BD7D1]/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="scale-65 origin-left -ml-2">
            <Logo />
          </div>
          <button onClick={onBack} className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#F26627] transition-colors px-4 py-2 rounded-full hover:bg-red-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ANNULLA
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#9BD7D1]/30">

          <div className="bg-[#325D79] px-8 py-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Stethoscope className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="inline-block bg-[#F26627] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                PRIMA VISITA
              </div>
              <h2 className="text-3xl font-black italic">
                Paziente con DMT2 eleggibile a trattamento
              </h2>
              <p className="mt-3 text-indigo-100 font-medium">
                {cascade?.label} — Operatore: <span className="text-[#F9A26C]">{user.username}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">

            {/* Clinical Code Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-[#EFEEEE]">
                <ClipboardList className="w-6 h-6 text-[#325D79]" />
                <h3 className="text-lg font-black text-[#325D79] uppercase tracking-wider">Identificativo Clinico</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Codice Paziente"
                  placeholder="Iniziali Medico + n. scheda (es. MR01)"
                  value={clinicalCode}
                  onChange={(e) => setClinicalCode(e.target.value.toUpperCase())}
                />
              </div>
              <p className="text-xs text-slate-400 italic">
                * Il codice deve essere formato dalle iniziali del medico e dal numero progressivo della scheda.
              </p>
            </div>

            {/* Questions Section */}
            <div className="space-y-12">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-[#EFEEEE]">
                <Stethoscope className="w-6 h-6 text-[#325D79]" />
                <h3 className="text-lg font-black text-[#325D79] uppercase tracking-wider">Parametri Clinici</h3>
              </div>

              <p className="text-xs text-slate-400 italic">I campi contrassegnati con <span className="text-red-500 font-bold">*</span> sono obbligatori.</p>

              <div className="space-y-16">
                {SURVEY_QUESTIONS.map(q => renderQuestion(q))}
              </div>
            </div>

            <div className="pt-10">
              <Button type="submit" isLoading={isLoading} className="w-full py-6 text-xl bg-[#325D79] hover:bg-[#24465F] font-black uppercase tracking-widest shadow-2xl shadow-[#325D79]/30 rounded-2xl border-none transition-all">
                Finalizza Inserimento
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};