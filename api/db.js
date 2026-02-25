import { Pool } from '@neondatabase/serverless';

// Pool di connessione condiviso per tutte le API serverless.
// La stringa DATABASE_URL viene iniettata da Vercel come variabile d'ambiente.
let pool;

export function getPool() {
    if (!pool) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is not set.');
        }
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }
    return pool;
}
