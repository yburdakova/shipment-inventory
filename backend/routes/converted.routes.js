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

    const selectPlaceholders = caseNumbers.map(() => '?').join(',');
    const [existingRows] = await connection.query(
      `SELECT CaseNumber FROM tblcases WHERE CaseNumber IN (${selectPlaceholders})`,
      caseNumbers
    );
    const existingCases = existingRows.map(row => row.CaseNumber);
    const missingCases = caseNumbers.filter(cn => !existingCases.includes(cn));

    let updatedRows = 0;
    if (existingCases.length > 0) {
      const updatePlaceholders = existingCases.map(() => '?').join(',');
      const [updateResult] = await connection.query(
        `UPDATE tblcases SET Converted = 1 WHERE CaseNumber IN (${updatePlaceholders})`,
        existingCases
      );
      updatedRows = updateResult.affectedRows;
    }

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      updatedRows,
      missingCases
    });
  } catch (error) {
    console.error('Error updating cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
