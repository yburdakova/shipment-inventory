import express from 'express';
import pool from '../db.config.js';

const router = express.Router();

router.post('/mark-converted', async (req, res) => {
  const { caseNumbers, userId } = req.body;

  if (!Array.isArray(caseNumbers) || caseNumbers.length === 0 || typeof userId !== 'number') {
    return res.status(400).json({ error: 'Invalid request: caseNumbers and userId are required' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [allCasesRows] = await connection.query(
      `SELECT CaseNumber, Converted FROM tblcases`
    );

    const allCaseMap = new Map();
    allCasesRows.forEach(row => {
      allCaseMap.set(row.CaseNumber, row.Converted);
    });

    const normalizedToOriginalMap = new Map();
    allCasesRows.forEach(row => {
      normalizedToOriginalMap.set(row.CaseNumber.replace(/-/g, ''), row.CaseNumber);
    });

    const toUpdate = [];
    const alreadyConverted = [];
    const notFound = [];
    const similarFound = [];

    for (const raw of caseNumbers) {
      const normalized = raw.replace(/-/g, '');

      if (allCaseMap.has(raw)) {
        const isAlready = allCaseMap.get(raw) === 1;
        if (isAlready) {
          alreadyConverted.push(raw);
        } else {
          toUpdate.push(raw);
        }
      } else if (normalizedToOriginalMap.has(normalized)) {
        const match = normalizedToOriginalMap.get(normalized);
        const isAlready = allCaseMap.get(match) === 1;
        similarFound.push({ original: raw, match, converted: isAlready });
      } else {
        notFound.push(raw);
      }
    }

    let updatedRows = 0;
    if (toUpdate.length > 0) {
      const placeholders = toUpdate.map(() => '?').join(',');
      const [result] = await connection.query(
        `UPDATE tblcases SET Converted = 1, UserID = ? WHERE CaseNumber IN (${placeholders})`,
        [userId, ...toUpdate]
      );
      updatedRows = result.affectedRows;
    }

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      updatedRows,
      toUpdate,
      alreadyConverted,
      notFound,
      similarFound
    });
  } catch (error) {
    console.error('Error updating cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/check-existing', async (req, res) => {
  const { caseNumbers } = req.body;

  if (!Array.isArray(caseNumbers) || caseNumbers.length === 0) {
    return res.status(400).json({ error: 'caseNumbers must be a non-empty array' });
  }

  try {
    const placeholders = caseNumbers.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT CaseNumber FROM tblcases WHERE CaseNumber IN (${placeholders})`,
      caseNumbers
    );
    const existing = rows.map(r => r.CaseNumber);
    res.json({ existing });
  } catch (error) {
    console.error('Error checking existing cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;