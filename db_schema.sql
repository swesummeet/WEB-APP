-- COPIA E INCOLLA QUESTO CODICE NELL'SQL EDITOR DI NEON
-- (Neon Console → progetto → SQL Editor)

-- 1. Tabella USERS (Utenti)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  surname TEXT,
  role TEXT,
  event_id TEXT
);

-- 2. Tabella RESPONSES (Risposte Sondaggi)
CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES users(id),
  event_id TEXT,
  username TEXT,
  answers JSONB,
  timestamp TIMESTAMPTZ
);

-- 3. Creazione Utente Admin di Default
-- Sostituisci 'summeet' e 'maspero05' con le tue credenziali admin se vuoi cambiarle.
INSERT INTO users (username, password, name, surname, role)
VALUES ('summeet', 'maspero05', 'Admin', 'User', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
