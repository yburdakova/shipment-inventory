import express from 'express';
import pool from '../db.config.js';
const router = express.Router();

router.get('/case-types', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT ID, Description, Abbreviation
      FROM enumcasetype
    `);
    res.json(results);
  } catch (error) {
    console.error('Case type fetch error:', error);
    res.status(500).json({ error: 'Failed to load case types' });
  }
});


router.get('/autocomplete', async (req, res) => {
  const { query, caseTypeAbbr } = req.query;

  if (!query || !caseTypeAbbr) {
    return res.status(400).json({ error: 'Missing query or caseTypeAbbr' });
  }

  const normalized = query.replace(/^0+/, '');

  const [results] = await pool.query(
    `
    SELECT DISTINCT
      CONCAT(ct.Abbreviation, ' ', c.CaseNumber) AS DisplayValue
    FROM tblcases c
    JOIN enumcasetype ct ON c.CaseTypeID = ct.ID
    WHERE REPLACE(LPAD(c.CaseNumber, 6, '0'), '-', '') LIKE CONCAT('%', ?, '%')
      AND ct.Abbreviation = ?
    ORDER BY DisplayValue
    LIMIT 20
    `,
    [normalized, caseTypeAbbr]
  );

  res.json(results.map(r => r.DisplayValue));
});


  router.get('/details', async (req, res) => {
    try {
      const { caseNumber, caseTypeAbbr } = req.query;
  
      if (!caseNumber || !caseTypeAbbr) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
  
      const [results] = await pool.query(
        `
        SELECT
          c.CaseNumber,
          ct.Abbreviation AS CaseType,
          b.BoxGuid,
          e.Description AS BoxStatus,
          c.Converted,
          c.Uploaded
        FROM tblcases c
        JOIN enumcasetype ct ON c.CaseTypeID = ct.ID
        LEFT JOIN tblbox b ON c.BoxID = b.ID
        LEFT JOIN enumstatus e ON b.StatusID = e.ID
        WHERE LPAD(c.CaseNumber, 6, '0') = LPAD(?, 6, '0')
          AND ct.Abbreviation = ?
        `,
        [caseNumber, caseTypeAbbr]
      );
  
      res.json(results.map(r => ({
        fileNumber: `${r.CaseType} ${r.CaseNumber}`,
        boxGuid: r.BoxGuid,
        boxStatus: r.BoxStatus,
        converted: !!r.Converted,
        uploaded: !!r.Uploaded
      })));
    } catch (error) {
      console.error('Details error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  function isCaseMissing(caseNumber, missingFiles) {
    const number = parseInt(caseNumber, 10);
    if (isNaN(number) || !missingFiles) return false;
  
    const parts = missingFiles.split(',');
  
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end) && number >= start && number <= end) {
          return true;
        }
      } else {
        const single = parseInt(part.trim(), 10);
        if (!isNaN(single) && single === number) {
          return true;
        }
      }
    }
  
    return false;
  }
  
  
  router.get('/find-box-case', async (req, res) => {
    try {
      const { caseNumber, caseTypeAbbr } = req.query;
  
      if (!caseNumber || !caseTypeAbbr) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
  
      const [typeResult] = await pool.query(
        `SELECT ID FROM enumcasetype WHERE Abbreviation = ?`,
        [caseTypeAbbr]
      );
  
      if (typeResult.length === 0) {
        return res.status(404).json({ error: 'Unknown case type' });
      }
  
      const caseTypeId = typeResult[0].ID;
  
      const [boxResults] = await pool.query(
        `
        SELECT b.BoxGuid, s.Description AS BoxStatus, b.MissingFiles
        FROM tblbox b
        LEFT JOIN enumstatus s ON b.StatusID = s.ID
        WHERE LPAD(?, 6, '0') BETWEEN LPAD(b.StartFileNumber, 6, '0') AND LPAD(b.EndFileNumber, 6, '0')
          AND b.CaseTypeID = ?
        LIMIT 1
        `,
        [caseNumber, caseTypeId, ]
      );
  
      if (boxResults.length === 0) {
        return res.status(404).json({ error: 'Case not found in boxes' });
      }
  
      const box = boxResults[0];
      const isMissing = isCaseMissing(caseNumber, box.MissingFiles);
  
      res.json({
        boxGuid: box.BoxGuid,
        status: box.BoxStatus,
        isMissing
      });
    } catch (error) {
      console.error('Find box case error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  
  export default router;