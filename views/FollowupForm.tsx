import React, { useState } from 'react';
import { User, Patient } from '../types';
import { FOLLOWUP_QUESTIONS, ALL_CASCADES } from '../constants';
import { saveFollowup } from '../services/storageService';
import { Button } from '../components/Button';
import { ArrowLeft, Activity, User as UserIcon } from 'lucide-react';
import { Logo } from '../components/Logo';

interface FollowupFormProps {
    user: User;
    patient: Patient;
    onBack: () => void;
}

export const FollowupForm: React.FC<FollowupFormProps> = ({ user, patient, onBack }) => {
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

        try {
            await saveFollowup(patient.id, answers);
            alert("Follow-up salvato correttamente!");
            onBack();
        } catch (error: any) {
            console.error("Follow-up error details:", error);
            alert(`Errore salvataggio follow-up: ${error.message || 'Errore sconosciuto'}.`);
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
                    <button onClick={onBack} className="flex items-center text-xs font-black text-slate-400 hover:text-[#F26627] uppercase tracking-widest px-4 py-2 rounded-full transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        INDIETRO
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#9BD7D1]/30">

                    <div className="bg-[#F26627] px-8 py-10 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-block bg-[#325D79] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                FASE 2
                            </div>
                            <h2 className="text-3xl font-black">FOLLOW-UP CLINICO</h2>
                            <div className="mt-4 flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md">
                                <UserIcon className="w-5 h-5 text-white" />
                                <span className="font-bold text-xl uppercase tracking-tight">{patient.name} {patient.surname}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">

                        <div className="bg-[#EFEEEE]/50 p-6 rounded-2xl border border-dashed border-[#9BD7D1]/50 mb-8">
                            <h3 className="text-xs font-black text-[#325D79] uppercase tracking-widest mb-2">Informazioni Logistiche</h3>
                            <p className="text-sm text-slate-500 font-medium">
                                Sede: <span className="font-bold text-[#325D79]">{cascade?.label}</span><br />
                                ID Paziente: <span className="font-mono">{patient.id}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            {FOLLOWUP_QUESTIONS.map((q) => (
                                <div key={q.id} className="space-y-4">
                                    <label className="block text-xl font-bold text-[#325D79]">
                                        {q.text}
                                    </label>

                                    {q.type === 'number' || q.type === 'text' ? (
                                        <input
                                            type={q.type}
                                            required
                                            className="w-full sm:w-1/2 p-4 border-2 border-[#9BD7D1]/50 rounded-2xl focus:ring-4 focus:ring-[#F26627]/20 focus:border-[#F26627] outline-none font-bold text-2xl text-[#325D79] bg-[#EFEEEE]/30 transition-all"
                                            placeholder={q.type === 'number' ? '0.0' : 'Inserisci note...'}
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
                              px-8 py-4 rounded-2xl border-2 text-base font-black transition-all duration-300
                              ${isSelected
                                                                ? 'bg-[#325D79] border-[#325D79] text-white shadow-xl shadow-[#325D79]/30'
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

                        <div className="pt-10">
                            <Button type="submit" isLoading={isLoading} className="w-full py-6 text-xl bg-[#F26627] hover:bg-[#d9561b] font-black uppercase tracking-widest shadow-2xl shadow-[#F9A26C]/30 rounded-2xl border-none">
                                Completa Follow-up
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};
