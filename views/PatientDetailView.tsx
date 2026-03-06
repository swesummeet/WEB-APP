import React from 'react';
import { Patient, Question } from '../types';
import { SURVEY_QUESTIONS, FOLLOWUP_QUESTIONS, ALL_CASCADES, EVENTS } from '../constants';
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  Clock,
  MapPin,
  User as UserIcon,
  AlertCircle,
} from 'lucide-react';

interface PatientDetailViewProps {
  patient: Patient;
  onBack: () => void;
}

const formatAnswer = (value: any): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '—';
  }
  return String(value);
};

const AnswerRow: React.FC<{ question: Question; answers: Record<string, any> }> = ({
  question,
  answers,
}) => {
  const answer = answers[question.id];
  const displayAnswer = formatAnswer(answer);
  const visibilityTrigger = question.visibilityValue ?? 'SI';
  const showSub = question.subQuestions && answer === visibilityTrigger;

  return (
    <div className="border-b border-[#EFEEEE] last:border-0">
      <div className="flex items-start justify-between gap-4 py-3 px-1">
        <span className="text-xs font-bold text-[#325D79]/60 uppercase tracking-wide flex-1">
          {question.text}
        </span>
        <span
          className={`text-sm font-semibold text-right max-w-[55%] ${
            displayAnswer === '—' ? 'text-slate-300' : 'text-[#325D79]'
          }`}
        >
          {displayAnswer}
        </span>
      </div>
      {showSub &&
        question.subQuestions!.map((sub) => (
          <div
            key={sub.id}
            className="flex items-start justify-between gap-4 py-2 px-1 pl-4 bg-[#9BD7D1]/10 rounded-lg mb-1"
          >
            <span className="text-xs font-bold text-[#325D79]/50 uppercase tracking-wide flex-1">
              ↳ {sub.text}
            </span>
            <span
              className={`text-sm font-semibold text-right max-w-[55%] ${
                formatAnswer(answers[sub.id]) === '—'
                  ? 'text-slate-300'
                  : 'text-[#325D79]'
              }`}
            >
              {formatAnswer(answers[sub.id])}
            </span>
          </div>
        ))}
    </div>
  );
};

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack }) => {
  const cascade = ALL_CASCADES.find((c) => c.id === patient.cascadeId);
  const event = EVENTS.find((e) => e.id === cascade?.eventId);
  const hasFollowup = !!patient.followupAnswers;

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#9BD7D1]/30 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4 text-[#325D79]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EFEEEE] hover:bg-[#325D79] hover:text-white font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla lista
          </button>
          <div className="h-6 w-px bg-[#9BD7D1]/40" />
          <span className="text-sm font-black tracking-widest uppercase text-[#F26627]">
            Scheda Paziente
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Patient Identity Card */}
        <div className="bg-[#325D79] rounded-3xl p-6 text-white shadow-xl shadow-[#325D79]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#9BD7D1] mb-3 text-sm font-bold uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              {cascade?.city} — {event?.name}
            </div>
            <h1 className="text-4xl font-black mb-4">
              {patient.clinicalCode}
            </h1>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#F9A26C]" />
                {new Date(patient.timestamp).toLocaleDateString('it-IT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10">
                <UserIcon className="w-3.5 h-3.5 text-[#9BD7D1]" />
                {patient.operatorUsername}
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  hasFollowup
                    ? 'bg-[#9BD7D1]/20 border-[#9BD7D1]/30 text-[#9BD7D1]'
                    : 'bg-white/10 border-white/10 text-white/60'
                }`}
              >
                {hasFollowup ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F26627]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {hasFollowup ? 'Follow-up completato' : 'Follow-up mancante'}
              </div>
            </div>
          </div>
        </div>

        {/* Survey Answers */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#9BD7D1]/30 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#EFEEEE]">
            <ClipboardList className="w-5 h-5 text-[#F26627]" />
            <h2 className="text-sm font-black text-[#325D79] uppercase tracking-widest">
              Scheda Iniziale
            </h2>
          </div>
          <div className="px-6 py-2">
            {SURVEY_QUESTIONS.map((q) => (
              <AnswerRow key={q.id} question={q} answers={patient.answers || {}} />
            ))}
          </div>
        </div>

        {/* Followup Answers */}
        {hasFollowup && (
          <div className="bg-white rounded-3xl shadow-sm border border-[#9BD7D1]/30 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#EFEEEE]">
              <CheckCircle2 className="w-5 h-5 text-[#F26627]" />
              <h2 className="text-sm font-black text-[#325D79] uppercase tracking-widest">
                Follow-up
              </h2>
            </div>
            <div className="px-6 py-2">
              {FOLLOWUP_QUESTIONS.map((q) => (
                <AnswerRow key={q.id} question={q} answers={patient.followupAnswers!} />
              ))}
            </div>
          </div>
        )}

        {/* Missing followup notice */}
        {!hasFollowup && (
          <div className="flex items-center gap-3 bg-white border border-dashed border-[#9BD7D1] rounded-2xl p-5 text-[#325D79]/50">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold">Il follow-up non è ancora stato compilato per questo paziente.</p>
          </div>
        )}
      </main>
    </div>
  );
};
