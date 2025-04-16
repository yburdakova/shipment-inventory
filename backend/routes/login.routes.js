import express from 'express';
import pool from '../db.config.js';

const router = express.Router();

console.log('Login route loaded');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('📨 Received from client:', { username, password }); 

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const query = `SELECT * FROM tblccsinventoryuser WHERE UserName = ? AND Password = ?`;
        const [rows] = await pool.query(query, [username, password]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = rows[0];

        res.json({
            id: user.ID,
            firstName: user.FirstName,
            lastName: user.LastName,
            role: user.UserRoleID,
            currentProjectId: user.CurrentProjectID
        });
    } catch (error) {
        console.error('Login database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
