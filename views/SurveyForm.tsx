import React, { useState } from 'react';
import { User, Patient } from '../types';
import { SURVEY_QUESTIONS, ALL_CASCADES } from '../constants';
import { savePatient } from '../services/storageService';
import { Button } from '../components/Button';
import { ArrowLeft, ClipboardList, UserCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';

interface SurveyFormProps {
  user: User;
  onBack: () => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ user, onBack }) => {
  const [patientName, setPatientName] = useState('');
  const [patientSurname, setPatientSurname] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const cascade = ALL_CASCADES.find(c => c.id === user.cascadeId);

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Create a random ID for the patient
    const patientId = 'paz_' + Math.random().toString(36).substring(2, 11);

    const patient: Patient = {
      id: patientId,
      userId: user.id,
      cascadeId: user.cascadeId!,
      operatorUsername: user.username,
      name: patientName,
      surname: patientSurname,
      answers,
      timestamp: new Date().toISOString()
    };

    try {
      await savePatient(patient);
      alert("Paziente salvato correttamente!");
      onBack();
    } catch (error: any) {
      console.error("Submission error details:", error);
      alert(`Errore durante il salvataggio: ${error.message || 'Errore sconosciuto'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-[#9BD7D1]/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="scale-65 origin-left -ml-2">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#F26627] transition-colors px-4 py-2 rounded-full hover:bg-red-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ANNULLA
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl shadow-[#325D79]/10 overflow-hidden border border-[#9BD7D1]/30">

          <div className="bg-[#325D79] px-8 py-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ClipboardList className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="inline-block bg-[#F26627] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg shadow-[#F26627]/30">
                NUOVO PAZIENTE
              </div>
              <h2 className="text-3xl font-black flex items-center gap-3">
                REGISTRAZIONE SCHEDA
              </h2>
              <p className="mt-3 text-indigo-100 font-medium">
                {cascade?.label} — Operatore: <span className="text-[#F9A26C]">{user.username}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">

            {/* Patient Identity Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-[#EFEEEE]">
                <UserCircle className="w-6 h-6 text-[#325D79]" />
                <h3 className="text-lg font-black text-[#325D79] uppercase tracking-wider">Identità Paziente</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome Paziente"
                  placeholder="Inserisci nome"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
                <Input
                  label="Cognome Paziente"
                  placeholder="Inserisci cognome"
                  value={patientSurname}
                  onChange={(e) => setPatientSurname(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-[#EFEEEE]">
                <ClipboardList className="w-6 h-6 text-[#325D79]" />
                <h3 className="text-lg font-black text-[#325D79] uppercase tracking-wider">Anamnesi e Stile di Vita</h3>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {SURVEY_QUESTIONS.map((q) => (
                  <div key={q.id} className="space-y-4">
                    <label className="block text-xl font-bold text-[#325D79] leading-tight">
                      {q.text}
                    </label>

                    {q.type === 'number' || q.type === 'text' ? (
                      <input
                        type={q.type}
                        required
                        className="w-full sm:w-1/2 p-4 border-2 border-[#9BD7D1]/50 rounded-2xl focus:ring-4 focus:ring-[#F9A26C]/20 focus:border-[#F26627] outline-none font-bold text-2xl text-[#325D79] bg-[#EFEEEE]/30 transition-all placeholder:text-slate-300"
                        placeholder={q.type === 'number' ? '00' : 'Scrivi qui...'}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {q.options?.map((option) => {
                          const isSelected = answers[q.id] === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleInputChange(q.id, option)}
                              className={`
                                px-8 py-4 rounded-2xl border-2 text-base font-black transition-all duration-300 transform
                                ${isSelected
                                  ? 'bg-[#F26627] border-[#F26627] text-white shadow-xl shadow-[#F26627]/30 -translate-y-1'
                                  : 'bg-white border-[#9BD7D1]/50 text-[#325D79] hover:bg-[#EFEEEE] hover:border-[#F9A26C]'}
                              `}
                            >
                              {option}
                            </button>
                          );
                        })}
                        <input type="text" className="sr-only" required value={answers[q.id] || ''} onChange={() => { }} tabIndex={-1} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10">
              <Button type="submit" isLoading={isLoading} className="w-full py-6 text-xl bg-[#325D79] hover:bg-[#24465F] font-black uppercase tracking-widest shadow-2xl shadow-[#325D79]/30 rounded-2xl border-none">
                Salva Paziente nel Database
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};