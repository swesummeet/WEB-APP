import React, { useState } from 'react';
import { User, Patient, Question } from '../types';
import { FOLLOWUP_QUESTIONS, ALL_CASCADES } from '../constants';
import { saveFollowup } from '../services/storageService';
import { Button } from '../components/Button';
import { ArrowLeft, Activity, User as UserIcon, Check, Calculator } from 'lucide-react';
import { Logo } from '../components/Logo';

interface FollowupFormProps {
    user: User;
    patient: Patient;
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

export const FollowupForm: React.FC<FollowupFormProps> = ({ user, patient, onBack }) => {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);

    const cascade = ALL_CASCADES.find(c => c.id === user.cascadeId);

    // Get sesso and eta from the initial patient answers for eGFR calculation
    const patientSesso = patient.answers?.['sesso'] || '';
    const patientEta = patient.answers?.['eta'] || '';

    const handleInputChange = (questionId: string, value: any) => {
        setAnswers(prev => {
            const updated = { ...prev, [questionId]: value };

            // Auto-calculate BMI when fu_peso or fu_altezza change
            if (questionId === 'fu_peso' || questionId === 'fu_altezza') {
                const peso = parseFloat(questionId === 'fu_peso' ? value : prev['fu_peso']);
                const altezza = parseFloat(questionId === 'fu_altezza' ? value : prev['fu_altezza']);
                updated['fu_bmi'] = calculateBMI(peso, altezza);
            }

            // Auto-calculate eGFR when fu_creatinina changes (uses sesso/eta from initial visit)
            if (questionId === 'fu_creatinina') {
                const creatinina = parseFloat(value);
                const eta = parseFloat(patientEta);
                updated['fu_egfr'] = calculateEGFR(creatinina, eta, patientSesso);
            }

            // Clear "altro" note when a non-Altro single-choice option is selected
            if (!questionId.endsWith('_altro_note') && typeof value === 'string' && value !== 'Altro') {
                delete updated[`${questionId}_altro_note`];
            }

            return updated;
        });
    };

    const handleMultiSelect = (questionId: string, option: string) => {
        const currentValues = (answers[questionId] as string[]) || [];
        let newValues: string[];

        if (currentValues.includes(option)) {
            newValues = currentValues.filter(v => v !== option);
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

    const renderQuestion = (q: Question) => {
        const targetValue = q.visibilityValue || 'SI';
        const isVisible = q.subQuestions ? answers[q.id] === targetValue : true;

        // Detect if any option is "Altro"
        const hasAltro = q.options?.some(o => o === 'Altro');
        const isAltroSelected = hasAltro && (
            q.type === 'multi_select'
                ? ((answers[q.id] as string[]) || []).includes('Altro')
                : answers[q.id] === 'Altro'
        );

        return (
            <div key={q.id} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="block text-xl font-bold text-[#325D79]">
                    {q.text}
                    {q.computed && (
                        <span className="inline-flex items-center gap-1 ml-2 text-xs font-bold text-[#9BD7D1] bg-[#9BD7D1]/10 px-2 py-0.5 rounded-full">
                            <Calculator className="w-3 h-3" /> Auto
                        </span>
                    )}
                </label>

                {q.type === 'number' || q.type === 'text' ? (
                    <input
                        type={q.type}
                        className={`w-full sm:w-1/2 p-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#F26627]/20 focus:border-[#F26627] outline-none font-bold text-2xl text-[#325D79] transition-all ${
                            q.computed
                                ? 'bg-[#9BD7D1]/10 border-[#9BD7D1]/40 cursor-not-allowed'
                                : 'bg-[#EFEEEE]/30 border-[#9BD7D1]/50'
                        }`}
                        placeholder={q.type === 'number' ? '0.0' : 'Note...'}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        readOnly={q.computed}
                        tabIndex={q.computed ? -1 : undefined}
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
                                            ? 'bg-[#325D79] border-[#325D79] text-white shadow-xl'
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
                            <h2 className="text-3xl font-black italic">FOLLOW-UP CLINICO</h2>
                            <div className="mt-4 flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md">
                                <UserIcon className="w-5 h-5 text-white" />
                                <span className="font-bold text-xl uppercase tracking-tight">CODICE: {patient.clinicalCode}</span>
                            </div>
                            {patientSesso && patientEta && (
                                <p className="mt-2 text-white/70 text-xs font-medium">
                                    Dati paziente: Sesso {patientSesso}, Età {patientEta} — usati per il calcolo automatico eGFR
                                </p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">

                        <div className="bg-[#EFEEEE]/50 p-6 rounded-2xl border border-dashed border-[#9BD7D1]/50 mb-8">
                            <h3 className="text-xs font-black text-[#325D79] uppercase tracking-widest mb-2">Scheda Paziente</h3>
                            <p className="text-sm text-slate-500 font-medium italic">
                                Sede: <span className="font-bold text-[#325D79]">{cascade?.label}</span><br />
                                ID Sistema: <span className="font-mono text-[10px]">{patient.id}</span>
                            </p>
                        </div>

                        <div className="space-y-16">
                            {FOLLOWUP_QUESTIONS.map(q => renderQuestion(q))}
                        </div>

                        <div className="pt-10">
                            <Button type="submit" isLoading={isLoading} className="w-full py-6 text-xl bg-[#F26627] hover:bg-[#d9561b] font-black uppercase tracking-widest shadow-2xl shadow-[#F9A26C]/30 rounded-2xl border-none">
                                Salva Follow-up
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};
