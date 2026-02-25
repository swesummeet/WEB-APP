import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId è obbligatorio.' });
    }

    try {
        const pool = getPool();
        const result = await pool.query(
            'SELECT COUNT(*) AS count FROM responses WHERE user_id = $1',
            [userId]
        );

        const count = parseInt(result.rows[0].count, 10);
        return res.status(200).json({ count });
    } catch (err) {
        console.error('User-response-count DB error:', err);
        return res.status(500).json({ error: 'Errore interno del server.' });
    }
}
