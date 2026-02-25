import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const pool = getPool();
        const result = await pool.query(
            'SELECT * FROM responses ORDER BY timestamp DESC'
        );

        const responses = result.rows.map((row) => ({
            id: row.id,
            userId: row.user_id,
            eventId: row.event_id,
            username: row.username,
            answers: row.answers,
            timestamp: row.timestamp,
        }));

        return res.status(200).json(responses);
    } catch (err) {
        console.error('Responses DB error:', err);
        return res.status(500).json({ error: 'Errore interno del server.' });
    }
}
