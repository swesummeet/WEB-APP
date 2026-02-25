import { getPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId, cascadeId } = req.query;

    try {
        const pool = getPool();
        let result;

        if (cascadeId) {
            // Admin: get all patients for a specific cascade
            result = await pool.query(
                'SELECT * FROM patients WHERE cascade_id = $1 ORDER BY timestamp DESC',
                [cascadeId]
            );
        } else if (userId) {
            // User: get their own patients
            result = await pool.query(
                'SELECT * FROM patients WHERE user_id = $1 ORDER BY timestamp DESC',
                [userId]
            );
        } else {
            // Admin: get all patients
            result = await pool.query(
                'SELECT * FROM patients ORDER BY timestamp DESC'
            );
        }

        const patients = result.rows.map((row) => ({
            id: row.id,
            userId: row.user_id,
            cascadeId: row.cascade_id,
            operatorUsername: row.operator_username,
            name: row.name,
            surname: row.surname,
            clinicalCode: row.clinical_code,
            answers: row.answers,
            followupAnswers: row.followup_answers,
            timestamp: row.timestamp,
        }));

        return res.status(200).json(patients);
    } catch (err) {
        console.error('Patients DB error:', err);
        return res.status(500).json({ error: 'Errore interno del server.' });
    }
}
