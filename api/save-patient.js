import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id, userId, cascadeId, operatorUsername, name, surname, answers, timestamp } = req.body;

    if (!id || !userId || !cascadeId || !name || !surname || !answers) {
        return res.status(400).json({ error: 'Campi obbligatori mancanti.' });
    }

    try {
        const pool = getPool();
        await pool.query(
            `INSERT INTO patients (id, user_id, cascade_id, operator_username, name, surname, answers, timestamp)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                id,
                userId,
                cascadeId,
                operatorUsername || null,
                name,
                surname,
                JSON.stringify(answers),
                timestamp || new Date().toISOString()
            ]
        );

        return res.status(201).json({ success: true });
    } catch (err) {
        console.error('Save-patient DB error:', err);
        return res.status(500).json({ error: err.message || 'Errore interno del server.' });
    }
}
