import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { getUserResponseCount } from '../services/storageService';
import { MOCK_EVENTS } from '../constants';
import { ClipboardList, LogOut, MapPin, Calendar, User as UserIcon } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onStartSurvey: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onStartSurvey }) => {
  const [count, setCount] = useState<number | null>(null);
  const event = MOCK_EVENTS.find(e => e.id === user.eventId);

  useEffect(() => {
    const fetchStats = async () => {
      if (user.id === 'demo_user_preview') {
        const demoCount = await getUserResponseCount(user.id);
        setCount(demoCount); 
        return;
      }
      const num = await getUserResponseCount(user.id);
      setCount(num);
    };
    fetchStats();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#9BD7D1]/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
             {/* Small inline logo version */}
             <div className="scale-50 origin-left">
                <Logo />
             </div>
          </div>
          <button 
            onClick={onLogout} 
            className="flex items-center text-sm font-medium text-[#325D79] hover:text-[#F26627] transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Esci
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#325D79]">Ciao, {user.name}</h1>
          <p className="text-slate-500 mt-2">Benvenuto nella tua dashboard personale.</p>
        </div>

        {/* Stats & Event Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9BD7D1]/50 flex flex-col justify-between h-48">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Schede Compilate</p>
                <h3 className="text-4xl font-bold text-[#F26627] mt-2">
                  {count === null ? '-' : count}
                </h3>
              </div>
              <div className="p-3 bg-[#EFEEEE] rounded-xl">
                <ClipboardList className="w-6 h-6 text-[#325D79]" />
              </div>
            </div>
            <p className="text-sm text-slate-400">Totale inserimenti effettuati per questo evento.</p>
          </div>

          {/* Event Card */}
          <div className="bg-[#325D79] p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between h-48 relative overflow-hidden">
            {/* Abstract Circle Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9BD7D1] opacity-20 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
            
            <div>
              <p className="text-[#9BD7D1] text-sm font-medium uppercase tracking-wider mb-2">Evento Attivo</p>
              <h3 className="text-xl font-bold leading-tight text-white">{event?.name || 'Evento non assegnato'}</h3>
            </div>
            
            <div className="space-y-2 text-sm text-indigo-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F9A26C]" />
                <span>{event?.city || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F9A26C]" />
                <span>{event?.date ? new Date(event.date).toLocaleDateString() : '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#9BD7D1]/50 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-[#EFEEEE] rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-[#325D79]" />
          </div>
          <h2 className="text-xl font-bold text-[#325D79] mb-2">Nuovo Paziente</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Inizia una nuova sessione di screening. I dati verranno salvati automaticamente nel database.
          </p>
          <Button 
            onClick={onStartSurvey} 
            className="w-full sm:w-auto px-12 py-3 text-lg bg-[#F26627] hover:bg-[#d9561b] shadow-lg shadow-[#F9A26C]/50"
          >
            Compila Scheda
          </Button>
        </div>

      </main>
    </div>
  );
};