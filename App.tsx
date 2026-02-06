import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { AuthView } from './views/AuthView';
import { SurveyForm } from './views/SurveyForm';
import { AdminDashboard } from './views/AdminDashboard';
import { UserDashboard } from './views/UserDashboard';
import { initStorage } from './services/storageService';

// Initialize storage (mock db)
initStorage();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'survey'>('dashboard');

  // Check for session in local storage on mount (simple persistency)
  useEffect(() => {
    const sessionUser = localStorage.getItem('logica_session');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard'); // Reset view on login
    localStorage.setItem('logica_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    localStorage.removeItem('logica_session');
  };

  // Routing Logic
  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  if (user.role === UserRole.ADMIN) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  // Standard User Routing
  if (view === 'survey') {
    return <SurveyForm user={user} onBack={() => setView('dashboard')} />;
  }

  return (
    <UserDashboard 
      user={user} 
      onLogout={handleLogout} 
      onStartSurvey={() => setView('survey')} 
    />
  );
}

export default App;