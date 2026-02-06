import React, { useState } from 'react';
import { User, SurveyResponse } from '../types';
import { MOCK_EVENTS, SURVEY_QUESTIONS } from '../constants';
import { saveResponse } from '../services/storageService';
import { Button } from '../components/Button';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Logo } from '../components/Logo';

interface SurveyFormProps {
  user: User;
  onBack: () => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ user, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const event = MOCK_EVENTS.find(e => e.id === user.eventId);

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create a random ID for the patient/response
    const responseId = 'paz_' + Math.random().toString(36).substr(2, 9);
    
    const response: SurveyResponse = {
      id: responseId,
      userId: user.id,
      eventId: user.eventId!,
      username: user.username, // Who collected the data
      answers,
      timestamp: new Date().toISOString()
    };

    try {
      await saveResponse(response);
      // Immediately return to dashboard after successful save
      alert("Scheda salvata correttamente!");
      onBack();
    } catch (error: any) {
      console.error("Submission error details:", error);
      alert(`Errore durante il salvataggio: ${error.message || 'Errore sconosciuto'}. Controlla la console.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-[#9BD7D1]/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="scale-50 origin-left -ml-4">
             <Logo />
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:block">Op: {user.username}</span>
             <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-500 hover:text-[#F26627] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#9BD7D1]/30">
          
          {/* Header Card */}
          <div className="bg-[#325D79] px-6 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <ClipboardList className="w-5 h-5 text-[#9BD7D1]" />
                  Parte da compilare a cura del cittadino
                </h2>
                <p className="mt-2 text-[#9BD7D1] text-sm">
                  Compilare tutti i campi relativi allo stato di salute e stile di vita.
                </p>
              </div>
              <div className="text-right text-xs bg-[#24465F] px-3 py-1 rounded-full text-[#F9A26C]">
                {event?.name}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            {/* Field Rendering */}
            {SURVEY_QUESTIONS.map((q) => (
              <div key={q.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-0">
                <label className="block text-base font-semibold text-[#325D79]">
                  {q.text}
                </label>
                
                {q.type === 'text' ? (
                  <input
                    type={q.id === 'eta' ? 'number' : 'text'}
                    required
                    className="w-full sm:w-1/3 p-3 border border-[#9BD7D1] rounded-lg focus:ring-2 focus:ring-[#F9A26C] focus:border-[#F26627] outline-none font-medium text-lg bg-[#EFEEEE]"
                    placeholder="_____"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                  />
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {q.options?.map((option) => {
                      const isSelected = answers[q.id] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleInputChange(q.id, option)}
                          className={`
                            px-6 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#F9A26C]
                            ${isSelected 
                              ? 'bg-[#F26627] border-[#F26627] text-white shadow-md transform scale-105' 
                              : 'bg-white border-[#9BD7D1] text-[#325D79] hover:bg-[#EFEEEE] hover:border-[#F9A26C]'}
                          `}
                        >
                          {option}
                        </button>
                      );
                    })}
                    {/* Hidden input to enforce required validation */}
                    <input 
                      type="text" 
                      className="sr-only" 
                      required 
                      value={answers[q.id] || ''} 
                      onChange={()=>{}} 
                      tabIndex={-1}
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6">
              <Button type="submit" isLoading={isLoading} className="w-full py-4 text-lg shadow-lg shadow-[#F9A26C]/50">
                Salva Scheda
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};