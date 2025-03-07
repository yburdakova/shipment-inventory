import express from 'express';
import pool from '../db.config.js';
import dotenv from 'dotenv';

dotenv.config();
console.log('DB_NAME from env:', process.env.DB_NAME);
const dbname = process.env.DB_NAME;
const router = express.Router();

console.log('Auth route loaded');

router.post('/login', async (req, res) => {
    const { authCode } = req.body;

    if (!authCode) {
        return res.status(400).json({ error: 'AuthCode is required' });
    }

    try {
        const [rows] = await pool.query(
            `SELECT * FROM ${dbname}.tblccsinventoryuser WHERE AuthCode = ?`,
            [authCode]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = rows[0];

        if (user.UserRoleID !== 1) {
            return res.status(403).json({ error: 'Insufficient access level' });
        }

        res.json({
            id: user.ID,
            firstName: user.FirstName,
            lastName: user.LastName,
            role: user.UserRoleID
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
