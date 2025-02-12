import express from 'express';
import pool from '../db.config.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT ID, BoxGUID 
            FROM ccscasefilescanning.tblbox 
            WHERE StatusID IN (11, 12, 13);
        `);

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/update-status', async (req, res) => {
    const { returnedList } = req.body;

    if (!Array.isArray(returnedList) || returnedList.length === 0) {
        return res.status(400).json({ error: 'Invalid request: returnedList must be a non-empty array' });
    }

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        const results = [];

        for (const box of returnedList) {
            const [updateResult] = await connection.query(
                'UPDATE ccscasefilescanning.tblbox SET StatusID = 16 WHERE ID = ? AND StatusID IN (11, 12, 13);',
                [box.ID]
            );

            if (updateResult.affectedRows > 0) {
                results.push({ ID: box.ID, message: 'Status updated successfully' });
            } else {
                results.push({ ID: box.ID, message: 'Update failed (already updated or not found)' });
            }
        }

        await connection.commit();
        connection.release();

        res.json({ success: true, results });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
