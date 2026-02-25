import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { patientId, followupAnswers } = req.body;

    if (!patientId) {
        return res.status(400).json({ error: 'patientId è obbligatorio.' });
    }

    try {
        const pool = getPool();
        const result = await pool.query(
            `UPDATE patients SET followup_answers = $1 WHERE id = $2 RETURNING id`,
            [JSON.stringify(followupAnswers), patientId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paziente non trovato.' });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Save-followup DB error:', err);
        return res.status(500).json({ error: err.message || 'Errore interno del server.' });
    }
}
