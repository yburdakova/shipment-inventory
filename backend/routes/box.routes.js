import express from 'express'; 
import pool from '../db.config.js';

const router = express.Router();

router.get('/:barcode', async (req, res) => {
    const { barcode } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT ID, BoxGUID FROM tblbox WHERE BoxGUID = ?;`, 
            [barcode]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Box not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/id/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT ID, BoxGUID FROM tblbox WHERE ID = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Box not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


export default router;
