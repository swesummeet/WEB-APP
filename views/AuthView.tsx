import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ADMIN_CREDENTIALS, MOCK_EVENTS } from '../constants';
import { loginUser, registerUser } from '../services/storageService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { Eye, Shield } from 'lucide-react';

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
  const [signupPassword, setSignupPassword] = useState('');

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
      setError('Errore di connessione. Verifica la configurazione Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedEventId) {
      setError('Seleziona un evento.');
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
        eventId: selectedEventId
      });

      if (newUser) {
        onLogin(newUser);
      }
    } catch (err: any) {
       if (err.message && (err.message.includes('unique') || err.message.includes('taken'))) {
         setError('Utente già registrato con questo nome e cognome.');
       } else {
         setError('Errore durante la registrazione. Verifica Supabase.');
       }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    onLogin({
      id: 'demo_user_preview',
      name: 'Utente',
      surname: 'Demo',
      username: 'demouser',
      role: UserRole.USER,
      eventId: MOCK_EVENTS[0]?.id || 'ev_001'
    });
  };

  const handleDemoAdmin = () => {
    onLogin({
      id: 'demo_admin_preview',
      name: 'Admin',
      surname: 'Demo',
      username: ADMIN_CREDENTIALS.username,
      role: UserRole.ADMIN,
    });
  };

  return (
    <div className="min-h-screen bg-[#EFEEEE] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#325D79] z-0"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header Section */}
        <div className="bg-white pt-10 pb-6 text-center border-b border-[#EFEEEE]">
          <Logo className="scale-75 transform" />
          <p className="text-[#325D79] mt-2 text-sm font-medium tracking-wide">SURVEY PLATFORM</p>
        </div>

        {/* Form Section */}
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
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
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
              <Button type="submit" isLoading={isLoading} className="w-full">Accedi</Button>
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

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#325D79]">Seleziona Evento</label>
                <select
                  className="px-3 py-2 bg-white border border-[#9BD7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A26C] text-[#325D79]"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  required
                >
                  <option value="">-- Scegli evento --</option>
                  {MOCK_EVENTS.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.date})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Password"
                type="password"
                placeholder="Crea una password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />

              <div className="text-xs text-slate-500 bg-[#EFEEEE] p-2 rounded border border-[#9BD7D1]/30">
                Il tuo nome utente sarà: <strong>{(name + surname).toLowerCase() || '...'}</strong>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full">Crea Account</Button>
            </form>
          )}

          {/* Demo Access Buttons */}
          <div className="mt-8 pt-6 border-t border-[#EFEEEE]">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleDemoAccess}
                className="w-full text-xs"
              >
                <Eye className="w-3 h-3 mr-2" />
                User Demo
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleDemoAdmin}
                className="w-full text-xs"
              >
                <Shield className="w-3 h-3 mr-2" />
                Admin Demo
              </Button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">
              Accesso rapido per testare le funzionalità
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};