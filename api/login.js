import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password sono obbligatori.' });
    }

    try {
        const pool = getPool();
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2 LIMIT 1',
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenziali non valide.' });
        }

        const row = result.rows[0];
        const user = {
            id: row.id,
            name: row.name,
            surname: row.surname,
            username: row.username,
            role: row.role,
            eventId: row.event_id,
        };

        return res.status(200).json(user);
    } catch (err) {
        console.error('Login DB error:', err);
        return res.status(500).json({ error: 'Errore interno del server.' });
    }
}
