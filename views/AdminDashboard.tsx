import React, { useState, useEffect } from 'react';
import { getAllPatients } from '../services/storageService';
import { exportToExcel } from '../services/excelService';
import { Patient, User } from '../types';
import { Button } from '../components/Button';
import { EVENTS, ALL_CASCADES } from '../constants';
import { Logo } from '../components/Logo';
import {
  Download,
  Users,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  CheckCircle2,
  FileText,
  Clock,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedCascadeId, setSelectedCascadeId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPatients();
      setPatients(data);
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
      exportToExcel(filteredPatients);
    } catch (e) {
      console.error("Export failed", e);
      alert("Errore durante l'esportazione.");
    } finally {
      setIsExporting(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const cascade = ALL_CASCADES.find(c => c.id === p.cascadeId);

    const matchesEvent = !selectedEventId || cascade?.eventId === selectedEventId;
    const matchesCascade = !selectedCascadeId || p.cascadeId === selectedCascadeId;
    const matchesSearch = !searchTerm ||
      (p.clinicalCode || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesEvent && matchesCascade && matchesSearch;
  });

  const totalPatients = filteredPatients.length;
  const followupsDone = filteredPatients.filter(p => !!p.followupAnswers).length;
  const activeEventsCount = new Set(filteredPatients.map(p => {
    const c = ALL_CASCADES.find(x => x.id === p.cascadeId);
    return c?.eventId;
  }).filter(Boolean)).size;

  const currentEvent = EVENTS.find(e => e.id === selectedEventId);

  return (
    <div className="min-h-screen bg-[#EFEEEE]">
      <header className="bg-[#325D79] text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="scale-65 origin-left -ml-2">
              <Logo variant="light" />
            </div>
            <div className="hidden md:block h-8 w-px bg-white/20 mx-2"></div>
            <div className="hidden md:block">
              <h1 className="text-lg font-black tracking-widest uppercase">Admin Console</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Sessione attiva</span>
              <span className="text-sm font-bold text-[#9BD7D1]">{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-white/10 hover:bg-[#F26627] text-white px-5 py-2 rounded-xl font-bold text-sm transition-all border border-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#325D79]/60 font-black text-xs uppercase tracking-[0.2em] mb-2">
              <Activity className="w-3 h-3" />
              Monitoraggio Ricerca DMT2
            </div>
            <h2 className="text-4xl font-black text-[#325D79]">
              {currentEvent ? currentEvent.name : "Report Globale Clinico"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchData} variant="secondary" isLoading={isLoading} className="bg-white border-none shadow-md">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleExport} isLoading={isExporting} className="bg-[#F26627] border-none shadow-xl shadow-[#F9A26C]/30 px-8">
              <Download className="w-5 h-5 mr-3" />
              Esporta Dati Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9BD7D1]/30">
            <label className="block text-[10px] font-bold text-[#325D79]/50 uppercase tracking-widest mb-3">Filtra per Progetto</label>
            <select
              className="w-full p-3 bg-[#EFEEEE]/50 rounded-xl outline-none focus:ring-2 focus:ring-[#F9A26C] text-[#325D79] font-bold border-none"
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSelectedCascadeId('');
              }}
            >
              <option value="">Tutti i Progetti</option>
              {EVENTS.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9BD7D1]/30">
            <label className="block text-[10px] font-bold text-[#325D79]/50 uppercase tracking-widest mb-3">Sede Logistica</label>
            <select
              className="w-full p-3 bg-[#EFEEEE]/50 rounded-xl outline-none focus:ring-2 focus:ring-[#F9A26C] text-[#325D79] font-bold border-none disabled:opacity-50"
              value={selectedCascadeId}
              onChange={(e) => setSelectedCascadeId(e.target.value)}
              disabled={!selectedEventId}
            >
              <option value="">Tutte le Sedi</option>
              {currentEvent?.cascades.map(cas => <option key={cas.id} value={cas.id}>{cas.city}</option>)}
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9BD7D1]/30 relative">
            <label className="block text-[10px] font-bold text-[#325D79]/50 uppercase tracking-widest mb-3">Ricerca Codice Paziente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder="Es. MR01..."
                className="w-full pl-10 pr-4 py-3 bg-[#EFEEEE]/50 rounded-xl outline-none focus:ring-2 focus:ring-[#F9A26C] text-[#325D79] font-bold border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#9BD7D1]/20">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-[#F26627]" />
              <span className="text-[10px] font-black text-slate-300 uppercase">Schede</span>
            </div>
            <p className="text-4xl font-black text-[#325D79]">{totalPatients}</p>
            <p className="text-xs font-bold text-slate-400 mt-2 tracking-tight">Inserimenti totali</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#9BD7D1]/20">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#9BD7D1]" />
              <span className="text-[10px] font-black text-slate-300 uppercase">Follow-up</span>
            </div>
            <p className="text-4xl font-black text-[#325D79]">{followupsDone}</p>
            <p className="text-xs font-bold text-slate-400 mt-2 tracking-tight">{((followupsDone / (totalPatients || 1)) * 100).toFixed(1)}% completati</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#9BD7D1]/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-[#325D79]/40" />
              <span className="text-[10px] font-black text-slate-300 uppercase">Progetti</span>
            </div>
            <p className="text-4xl font-black text-[#325D79]">{activeEventsCount}</p>
            <p className="text-xs font-bold text-slate-400 mt-2 tracking-tight">Progetti con schede</p>
          </div>

          <div className="bg-[#325D79] p-8 rounded-3xl shadow-2xl shadow-[#325D79]/20 text-white group cursor-pointer" onClick={handleExport}>
            <div className="flex items-center justify-between mb-4">
              <Download className="w-8 h-8 text-[#F9A26C]" />
              <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-lg font-black leading-tight">Esporta Report Clinico</p>
            <p className="text-xs font-bold text-indigo-200 mt-1 opacity-60">Genera file .xlsx</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-[#325D79]/5 border border-[#9BD7D1]/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#EFEEEE] flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-black text-[#325D79] uppercase tracking-wider">Registri Clinici</h3>
            <span className="text-xs font-bold text-slate-400">{totalPatients} record trovati</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#EFEEEE]/30 text-[#325D79] font-black uppercase tracking-tighter border-b border-[#9BD7D1]/10">
                <tr>
                  <th className="px-8 py-5">Codice Clinico</th>
                  <th className="px-8 py-5 text-center">Fase 2</th>
                  <th className="px-8 py-5">Progetto / Sede</th>
                  <th className="px-8 py-5">Medico Op.</th>
                  <th className="px-8 py-5">Data Visita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEEEE]">
                {filteredPatients.map((p) => {
                  const cascade = ALL_CASCADES.find(c => c.id === p.cascadeId);
                  const event = EVENTS.find(e => e.id === cascade?.eventId);
                  return (
                    <tr key={p.id} className="hover:bg-[#EFEEEE]/50 transition-colors group">
                      <td className="px-8 py-5 font-black text-[#325D79]">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#325D79]/5 py-1 px-2 rounded">{p.clinicalCode}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {p.followupAnswers ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#9BD7D1]/20 text-[#325D79] uppercase tracking-tighter border border-[#9BD7D1]/50">
                            <CheckCircle2 className="w-3 h-3 text-[#F26627]" />
                            COMPLETO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-300 uppercase tracking-tighter">
                            PENDENTE
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#325D79]">{event?.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{cascade?.city}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-medium text-slate-500">
                        @{p.operatorUsername}
                      </td>
                      <td className="px-8 py-5 text-slate-400 font-bold">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(p.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};