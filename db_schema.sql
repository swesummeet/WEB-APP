-- NUOVO SCHEMA - COPIA E INCOLLA NELL'SQL EDITOR DI NEON
-- ATTENZIONE: questo schema sostituisce il precedente.
-- Se hai dati da preservare, esegui prima un backup.

-- 1. Rimuovi tabelle vecchie (se esistono)
DROP TABLE IF EXISTS responses CASCADE;

-- 2. Tabella USERS (aggiornata con cascade_id al posto di event_id)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  surname TEXT,
  role TEXT DEFAULT 'USER',
  cascade_id TEXT  -- es. 'cas_001_mi' - riferisce alla cascata in constants.ts
);

-- 3. Tabella PATIENTS (sostituisce 'responses')
-- Ogni riga è un paziente inserito da un operatore durante lo screening
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,                        -- UUID generato dal client
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES users(id),          -- operatore che ha inserito
  cascade_id TEXT NOT NULL,                   -- cascata di appartenenza
  operator_username TEXT,                     -- username operatore (denormalizzato)
  name TEXT NOT NULL,                         -- nome paziente
  surname TEXT NOT NULL,                      -- cognome paziente
  answers JSONB NOT NULL,                     -- risposte domande principali
  followup_answers JSONB,                     -- risposte follow-up (nullable, aggiunto dopo)
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- 4. Indici per performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_cascade_id ON patients(cascade_id);

-- 5. Utente Admin di Default
INSERT INTO users (username, password, name, surname, role)
VALUES ('summeet', 'maspero05', 'Admin', 'Summeet', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
