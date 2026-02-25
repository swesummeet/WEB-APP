import React, { useEffect, useState } from 'react';
import { User, Patient } from '../types';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { getMyPatients } from '../services/storageService';
import { ALL_CASCADES, EVENTS } from '../constants';
import {
  ClipboardList,
  LogOut,
  MapPin,
  PlusCircle,
  Search,
  ChevronRight,
  CheckCircle2,
  Clock,
  UserCircle
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onStartSurvey: () => void;
  onStartFollowup: (patient: Patient) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onStartSurvey, onStartFollowup }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const cascade = ALL_CASCADES.find(c => c.id === user.cascadeId);
  const event = EVENTS.find(e => e.id === cascade?.eventId);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await getMyPatients(user.id);
      setPatients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user.id]);

  const filteredPatients = patients.filter(p =>
    (p.clinicalCode || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedFollowups = patients.filter(p => !!p.followupAnswers).length;

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      <header className="bg-white shadow-sm border-b border-[#9BD7D1]/30 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center text-[#325D79]">
          <div className="flex items-center gap-2">
            <div className="scale-65 origin-left">
              <Logo />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold uppercase tracking-tighter opacity-60">Operatore</span>
              <span className="text-sm font-semibold">{user.name} {user.surname}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 rounded-lg bg-[#EFEEEE] hover:bg-[#F26627] hover:text-white font-bold text-sm transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-[#325D79] rounded-3xl p-8 mb-10 text-white relative overflow-hidden shadow-2xl shadow-[#325D79]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#9BD7D1] mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">{cascade?.city} — {event?.name}</span>
              </div>
              <h1 className="text-4xl font-black">{cascade?.label}</h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                  <span className="block text-[10px] uppercase font-bold text-[#F9A26C]">Schede Inserite</span>
                  <span className="text-2xl font-black">{patients.length}</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                  <span className="block text-[10px] uppercase font-bold text-[#9BD7D1]">Follow-up OK</span>
                  <span className="text-2xl font-black">{completedFollowups}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onStartSurvey}
              className="px-10 py-5 text-xl bg-[#F26627] hover:bg-[#d9561b] hover:scale-105 active:scale-95 shadow-xl shadow-[#F9A26C]/40 border-none transition-all"
            >
              <PlusCircle className="w-6 h-6 mr-3" />
              NUOVA SCHEDA
            </Button>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cerca per codice paziente (es. MR01)..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-[#9BD7D1]/30 focus:ring-4 focus:ring-[#F9A26C]/20 focus:border-[#F26627] outline-none text-[#325D79] font-medium shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-black text-[#325D79]/50 uppercase tracking-[0.2em] px-2 mb-4">Pazienti DMT2 Registrati</h2>

          {isLoading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#9BD7D1]">
              <div className="animate-spin w-10 h-10 border-4 border-[#F26627] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#325D79] font-bold">Caricamento dati...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#9BD7D1]">
              <ClipboardList className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium font-bold uppercase tracking-widest text-xs">Nessuna scheda trovata</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPatients.map(patient => (
                <div
                  key={patient.id}
                  className="bg-white rounded-2xl p-5 border border-[#9BD7D1]/30 shadow-sm hover:shadow-md hover:border-[#F26627]/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#325D79]/10 rounded-xl flex items-center justify-center text-[#325D79] font-black shrink-0">
                        {patient.clinicalCode?.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#325D79]">
                          CODICE: {patient.clinicalCode}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(patient.timestamp).toLocaleDateString()}
                          </span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span className="uppercase tracking-tighter">ID: {patient.id.slice(-8)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {patient.followupAnswers ? (
                        <div className="flex items-center gap-2 bg-[#9BD7D1]/20 text-[#325D79] px-4 py-2.5 rounded-xl font-bold text-sm grow md:grow-0 justify-center">
                          <CheckCircle2 className="w-4 h-4 text-[#F26627]" />
                          Follow-up Completo
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartFollowup(patient)}
                          className="flex items-center gap-2 bg-[#EFEEEE] hover:bg-[#F26627] text-[#325D79] hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all grow md:grow-0 justify-center group/btn"
                        >
                          Aggiungi Follow-up
                          <ChevronRight className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};