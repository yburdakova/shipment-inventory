import express from 'express';
import pool from '../db.config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { authCode } = req.body;

    if (!authCode) {
        return res.status(400).json({ error: 'AuthCode is required' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM tblccsinventoryuser WHERE AuthCode = ?',
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
