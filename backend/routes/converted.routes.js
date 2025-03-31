import express from 'express';
import pool from '../db.config.js';

const router = express.Router();

router.post('/mark-converted', async (req, res) => {
  const { caseNumbers } = req.body;

  if (!Array.isArray(caseNumbers) || caseNumbers.length === 0) {
    return res.status(400).json({ error: 'Invalid request: caseNumbers must be a non-empty array' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const placeholders = caseNumbers.map(() => '?').join(',');
    const query = `UPDATE tblcases SET Uploaded = 1 WHERE CaseNumber IN (${placeholders});`;

    const [result] = await connection.query(query, caseNumbers);

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      updatedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error updating cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
