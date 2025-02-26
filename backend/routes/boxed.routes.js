import express from 'express';
import pool from '../db.config.js';
import dotenv from 'dotenv';

dotenv.config();
const dbname = process.env.DB_NAME;
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT ID, BoxGUID FROM ${dbname}.tblbox WHERE StatusID = 1;`);

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/update-status', async (req, res) => {
    const { deliveredList } = req.body;

    if (!Array.isArray(deliveredList) || deliveredList.length === 0) {
        return res.status(400).json({ error: 'Invalid request: deliveredList must be a non-empty array' });
    }

    try {
        const connection = await pool.getConnection();

        await connection.beginTransaction();

        const results = [];
        
        for (const box of deliveredList) {
            const [updateResult] = await connection.query(
                `UPDATE ${dbname}.tblbox 
                 SET StatusID = 2, DateRegistered = NOW() 
                 WHERE ID = ? AND StatusID = 1;`,
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
