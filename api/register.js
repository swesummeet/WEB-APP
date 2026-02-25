import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { username, password, name, surname, role, cascadeId } = req.body;

    if (!username || !password || !name || !surname) {
        return res.status(400).json({ error: 'Campi obbligatori mancanti.' });
    }

    try {
        const pool = getPool();

        // Check if username is already taken
        const existing = await pool.query(
            'SELECT id FROM users WHERE username = $1 LIMIT 1',
            [username]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        // Insert new user
        const result = await pool.query(
            `INSERT INTO users (username, password, name, surname, role, cascade_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [username, password, name, surname, role || 'USER', cascadeId || null]
        );

        const row = result.rows[0];
        const user = {
            id: row.id,
            name: row.name,
            surname: row.surname,
            username: row.username,
            role: row.role,
            cascadeId: row.cascade_id,
        };

        return res.status(201).json(user);
    } catch (err) {
        console.error('Register DB error:', err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username already taken' });
        }
        return res.status(500).json({ error: 'Errore interno del server.' });
    }
}
