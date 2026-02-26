import React, { useState } from 'react';
import { User, UserRole, Cascade } from '../types';
import { ADMIN_CREDENTIALS, EVENTS } from '../constants';
import { loginUser, registerUser } from '../services/storageService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { Eye, MapPin, ChevronRight } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  // Signup State
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedCascadeId, setSelectedCascadeId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const selectedEvent = EVENTS.find(e => e.id === selectedEventId);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await loginUser(loginUsername, loginPassword);
      if (user) {
        onLogin(user);
      } else {
        setError('Credenziali non valide. Riprova.');
      }
    } catch (e) {
      setError('Errore di connessione al database. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCascadeId) {
      setError('Seleziona la tua città (evento).');
      return;
    }

    const username = (name + surname).toLowerCase().replace(/\s/g, '');

    if (username === ADMIN_CREDENTIALS.username) {
      setError('Questo nome utente è riservato.');
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await registerUser({
        name,
        surname,
        username,
        password: signupPassword,
        role: UserRole.USER,
        cascadeId: selectedCascadeId
      });

      if (newUser) {
        onLogin(newUser);
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('unique') || err.message.includes('taken'))) {
        setError('Utente già registrato con questo nome e cognome.');
      } else {
        setError('Errore durante la registrazione. Riprova più tardi.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#EFEEEE] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#325D79] z-0"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 transition-all duration-300">
        <div className="bg-white pt-10 pb-6 text-center border-b border-[#EFEEEE]">
          <Logo className="scale-75 transform mx-auto block" />
          <p className="text-[#325D79] mt-2 text-sm font-medium tracking-wide uppercase">Multi-Event Survey Platform</p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8 p-1.5 bg-[#EFEEEE] rounded-lg">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white text-[#325D79] shadow-sm' : 'text-slate-500 hover:text-[#325D79]'}`}
            >
              Accedi
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white text-[#325D79] shadow-sm' : 'text-slate-500 hover:text-[#325D79]'}`}
            >
              Registrati
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg animate-pulse">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <Input
                label="Nome Utente"
                type="text"
                placeholder="es. mariorossi"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <Button type="submit" isLoading={isLoading} className="w-full">Entra nella Dashboard</Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  type="text"
                  placeholder="Mario"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Cognome"
                  type="text"
                  placeholder="Rossi"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#325D79] uppercase tracking-wider">1. Seleziona Evento</label>
                  <select
                    className="px-3 py-2.5 bg-white border border-[#9BD7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A26C] text-[#325D79] font-medium transition-all"
                    value={selectedEventId}
                    onChange={(e) => {
                      setSelectedEventId(e.target.value);
                      setSelectedCascadeId('');
                    }}
                    required
                  >
                    <option value="">-- Scegli evento --</option>
                    {EVENTS.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                {selectedEvent && (
                  <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-[#325D79] uppercase tracking-wider">2. Seleziona Città (evento)</label>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedEvent.cascades.map(cas => (
                        <button
                          key={cas.id}
                          type="button"
                          onClick={() => setSelectedCascadeId(cas.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedCascadeId === cas.id
                            ? 'bg-[#F26627] border-[#F26627] text-white shadow-md'
                            : 'bg-[#EFEEEE] border-[#9BD7D1]/50 text-[#325D79] hover:border-[#F9A26C]'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-4 h-4 ${selectedCascadeId === cas.id ? 'text-white' : 'text-[#F9A26C]'}`} />
                            <span className="font-semibold">{cas.city}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Scegli una Password"
                type="password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />

              <div className="text-[10px] text-slate-500 bg-[#EFEEEE] p-2.5 rounded border border-[#9BD7D1]/30 flex justify-between items-center">
                <span>IL TUO NOME UTENTE:</span>
                <strong className="text-[#325D79]">{(name + surname).toLowerCase().replace(/\s/g, '') || '...'}</strong>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full py-3">Registrati</Button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};