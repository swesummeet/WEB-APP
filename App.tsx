import React, { useState, useEffect } from 'react';
import { User, UserRole, Patient } from './types';
import { AuthView } from './views/AuthView';
import { SurveyForm } from './views/SurveyForm';
import { FollowupForm } from './views/FollowupForm';
import { AdminDashboard } from './views/AdminDashboard';
import { UserDashboard } from './views/UserDashboard';
import { initStorage } from './services/storageService';

// Initialize storage services
initStorage();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'survey' | 'followup'>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Check for session in local storage on mount (simple persistency)
  useEffect(() => {
    const sessionUser = localStorage.getItem('logica_session');
    if (sessionUser) {
      try {
        setUser(JSON.parse(sessionUser));
      } catch (e) {
        localStorage.removeItem('logica_session');
      }
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
    localStorage.setItem('logica_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    setSelectedPatient(null);
    localStorage.removeItem('logica_session');
  };

  const startFollowup = (patient: Patient) => {
    setSelectedPatient(patient);
    setView('followup');
  };

  // Routing Logic
  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  if (user.role === UserRole.ADMIN) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  // Standard User Routing
  switch (view) {
    case 'survey':
      return <SurveyForm user={user} onBack={() => setView('dashboard')} />;

    case 'followup':
      if (!selectedPatient) {
        setView('dashboard');
        return null;
      }
      return (
        <FollowupForm
          user={user}
          patient={selectedPatient}
          onBack={() => {
            setView('dashboard');
            setSelectedPatient(null);
          }}
        />
      );

    case 'dashboard':
    default:
      return (
        <UserDashboard
          user={user}
          onLogout={handleLogout}
          onStartSurvey={() => setView('survey')}
          onStartFollowup={startFollowup}
        />
      );
  }
}

export default App;