-- COPIA E INCOLLA QUESTO CODICE NELL'EDITOR SQL DI SUPABASE

-- 1. Tabella USERS (Utenti)
-- Gestisce gli operatori che fanno il login
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Nota: in produzione usare hash, qui è plain text come da tuo codice
  name TEXT,
  surname TEXT,
  role TEXT,
  event_id TEXT
);

-- 2. Tabella RESPONSES (Risposte Sondaggi)
-- Gestisce le schede anamnestiche
CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY, -- Importante: TEXT per supportare ID tipo "paz_xyz" generati dal frontend
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES users(id), -- Collega la risposta all'operatore
  event_id TEXT,
  username TEXT, -- Nome operatore denormalizzato per facilitare l'export
  answers JSONB, -- Salva tutte le risposte come oggetto JSON flessibile
  timestamp TIMESTAMPTZ
);

-- 3. SICUREZZA (Row Level Security)
-- Fondamentale: abilita lettura/scrittura pubblica per far funzionare l'app
-- senza l'autenticazione nativa complessa di Supabase (Auth).

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Rimuove policy vecchie se esistono per evitare errori
DROP POLICY IF EXISTS "Public Users Access" ON users;
DROP POLICY IF EXISTS "Public Responses Access" ON responses;

-- Crea nuove policy permissive
CREATE POLICY "Public Users Access" 
ON users FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public Responses Access" 
ON responses FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Creazione Utente Admin di Default (Opzionale)
-- Se non riesci a fare login, questo crea l'admin manualmente
INSERT INTO users (username, password, name, surname, role)
VALUES ('summeet', 'maspero05', 'Admin', 'User', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
