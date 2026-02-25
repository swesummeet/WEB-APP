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
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES users(id),
  cascade_id TEXT NOT NULL,
  operator_username TEXT,
  name TEXT,                                  -- reso opzionale
  surname TEXT,                               -- reso opzionale
  clinical_code TEXT,                         -- Nuovo campo per codice MR01
  answers JSONB NOT NULL,
  followup_answers JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- 4. Indici per performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_cascade_id ON patients(cascade_id);
CREATE INDEX IF NOT EXISTS idx_patients_clinical_code ON patients(clinical_code);

-- 5. Utente Admin di Default
INSERT INTO users (username, password, name, surname, role)
VALUES ('summeet', 'maspero05', 'Admin', 'Summeet', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
