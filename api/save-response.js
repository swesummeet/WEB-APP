import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id, userId, eventId, username, answers, timestamp } = req.body;

    if (!id || !userId) {
        return res.status(400).json({ error: 'Campi obbligatori mancanti.' });
    }

    try {
        const pool = getPool();
        await pool.query(
            `INSERT INTO responses (id, user_id, event_id, username, answers, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, userId, eventId || null, username || null, JSON.stringify(answers), timestamp || new Date().toISOString()]
        );

        return res.status(201).json({ success: true });
    } catch (err) {
        console.error('Save-response DB error:', err);
        return res.status(500).json({ error: err.message || 'Errore interno del server.' });
    }
}
