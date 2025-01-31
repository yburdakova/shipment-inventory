import express from 'express';
import pool from '../db.config.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT ID, Description FROM tblccsinventoryproject');

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

router.get('/stats/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const [
            totalBoxes,
            boxed,
            delivered,
            inspected,
            prepInit,
            prepCompleted,
            scan1i,
            scan1c,
            scan2i,
            scan2c,
            reviewi,
            reviewc,
            finalized,
            uploaded,
            destroyed,
            returnedUns,
            returned,
            avgPages,
            deliveries
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ?', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 1', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 2', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 3', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 4', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 5', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 6', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 7', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 8', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 9', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 10', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 11', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 12', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 13', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 14', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 15', [projectId]),
            pool.query('SELECT COUNT(*) AS total FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND StatusID = 16', [projectId]),
            pool.query('SELECT AVG(NumberOfPages) AS avg_pages FROM ccscasefilescanning.tblbox WHERE ProjectID = ? AND NumberOfPages > 0', [projectId]),
            pool.query('CALL Get_ShipmentInv()')
        ]);

        res.json({
            total: totalBoxes[0][0]?.total || 0,
            statuses: {
                boxed: boxed[0][0]?.total || 0,
                delivered: delivered[0][0]?.total || 0,
                inspected: inspected[0][0]?.total || 0,
                prep_init: prepInit[0][0]?.total || 0,
                prep_completed: prepCompleted[0][0]?.total || 0,
                scan1i: scan1i[0][0]?.total || 0,
                scan1c: scan1c[0][0]?.total || 0,
                scan2i: scan2i[0][0]?.total || 0,
                scan2c: scan2c[0][0]?.total || 0,
                reviewi: reviewi[0][0]?.total || 0,
                reviewc: reviewc[0][0]?.total || 0,
                finalized: finalized[0][0]?.total || 0,
                uploaded: uploaded[0][0]?.total || 0,
                destroyed: destroyed[0][0]?.total || 0,
                returned_uns: returnedUns[0][0]?.total || 0,
                returned: returned[0][0]?.total || 0
            },
            average_pages: avgPages[0][0]?.avg_pages || 0,
            deliveries: deliveries[0] || []
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});