import React, { useState, useEffect } from 'react';
import { getResponses } from '../services/storageService';
import { exportToExcel } from '../services/excelService';
import { SurveyResponse, User } from '../types';
import { Button } from '../components/Button';
import { MOCK_EVENTS } from '../constants';
import { Logo } from '../components/Logo';
import { Download, Users, Calendar, MapPin, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getResponses();
      setResponses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportToExcel(responses);
    } catch (e) {
      console.error("Export failed", e);
      alert("Errore durante l'esportazione.");
    } finally {
      setIsExporting(false);
    }
  };

  // Stats Logic
  const totalResponses = responses.length;
  const uniqueEvents = new Set(responses.map(r => r.eventId)).size;
  
  // Calculate per-event stats
  const eventStats = MOCK_EVENTS.map(event => {
    const count = responses.filter(r => r.eventId === event.id).length;
    return { ...event, count };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      {/* Header */}
      <header className="bg-[#325D79] text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Logo - Force White text for dark header */}
             <div className="scale-50 origin-left -ml-2">
                <Logo variant="light" />
             </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#9BD7D1] hidden sm:block">Benvenuto, {user.username}</span>
            <button 
              onClick={onLogout}
              className="text-sm bg-[#24465F] hover:bg-[#F26627] text-white px-3 py-1.5 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#325D79]">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Monitoraggio eventi e risposte.</p>
          </div>
          <div className="flex gap-2">
             <Button onClick={fetchData} variant="secondary" isLoading={isLoading} className="shadow-sm border-[#9BD7D1]">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
             </Button>
            <Button onClick={handleExport} isLoading={isExporting} className="shadow-lg shadow-[#F9A26C]/30">
              <Download className="w-4 h-4 mr-2" />
              Esporta Excel
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#9BD7D1]/50">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-slate-500">Totale Risposte</h3>
              <Users className="w-5 h-5 text-[#F26627]" />
            </div>
            <p className="text-3xl font-bold text-[#325D79]">{totalResponses}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#9BD7D1]/50">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-slate-500">Eventi Attivi</h3>
              <Calendar className="w-5 h-5 text-[#F26627]" />
            </div>
            <p className="text-3xl font-bold text-[#325D79]">{uniqueEvents}</p>
            <p className="text-xs text-slate-400 mt-2">Su {MOCK_EVENTS.length} totali</p>
          </div>
        </div>

        {/* Event List */}
        <div className="bg-white rounded-xl shadow-sm border border-[#9BD7D1]/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-[#EFEEEE]">
            <h3 className="text-lg font-semibold text-[#325D79]">Dettaglio per Evento</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-[#EFEEEE] text-[#325D79] font-semibold border-b border-[#9BD7D1]/30">
                <tr>
                  <th className="px-6 py-4">Nome Evento</th>
                  <th className="px-6 py-4">Città</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Compilazioni</th>
                  <th className="px-6 py-4 text-right">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEEEE]">
                {eventStats.map((event) => (
                  <tr key={event.id} className="hover:bg-[#EFEEEE]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#325D79]">{event.name}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#9BD7D1]" />
                      {event.city}
                    </td>
                    <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#F26627]">{event.count}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.count > 0 ? 'bg-[#9BD7D1]/20 text-[#325D79]' : 'bg-slate-100 text-slate-800'}`}>
                        {event.count > 0 ? 'Attivo' : 'In attesa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};