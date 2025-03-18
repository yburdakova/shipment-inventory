import express from 'express';
import pool from '../db.config.js';

const router = express.Router();

router.get(`/`, async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT ID, Description FROM tblccsinventoryproject`);

        res.json(rows);
    } catch (error) {
        console.error(`Database error:`, error);
        res.status(500).json({ error: `Internal server error` });
    }
});

router.get(`/:projectId`, async (req, res) => {
    const { projectId } = req.params;
    
    try {
        const [rows] = await pool.query(
            `SELECT ID, Description FROM tblccsinventoryproject WHERE ID = ?`, 
            [projectId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(`Database error:`, error);
        res.status(500).json({ error: `Internal server error` });
    }
});

router.get(`/stats/:projectId`, async (req, res) => {
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
            scanned_pages,
            reviewed_pages
        ] = await Promise.all([
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ?`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 1`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 2`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 3`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 4`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 5`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 6`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 7`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 8`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 9`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 10`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 11`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 12`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 13`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 14`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 15`, [projectId]),
            pool.query(`SELECT COUNT(*) AS total FROM tblbox WHERE ProjectID = ? AND StatusID = 16`, [projectId]),
            pool.query(`SELECT AVG(NumberOfPages) AS avg_pages FROM tblbox WHERE ProjectID = ? AND NumberOfPages > 0`, [projectId]),
            pool.query(`SELECT SUM(NumberOfPages) AS scanned_pages FROM tblbox WHERE ProjectID = ? AND StatusID IN (7, 8, 9, 10, 11, 12, 13, 16)`, [projectId]),
            pool.query(`SELECT SUM(NumberOfPages) AS reviewed_pages FROM tblbox WHERE ProjectID = ? AND StatusID IN (11, 12, 13, 16)`, [projectId])   
        ]);

        const [deliveryResults] = await pool.query(`CALL Get_ShipmentInventory(?)`, [projectId]);

        const newdeliveries = deliveryResults[0] || []; 

        const processedDeliveries = newdeliveries.map(delivery => {

            let parsedBoxList;
            try {
                parsedBoxList = typeof delivery.box_list === "string" 
                    ? JSON.parse(delivery.box_list) 
                    : delivery.box_list;
            } catch (error) {
                console.error("Error parsing box_list:", error);
                parsedBoxList = [];
            }

            return {
                RegisterDate: delivery.RegisterDate,
                total_rows: delivery.total_rows,
                boxes: parsedBoxList,
                untouched: delivery.untouched,
                ip: delivery.ip,
                scanned: delivery.scanned,
                reviewed: delivery.reviewed,
                returned: delivery.returned
            };
        });

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
            scanned_pages: scanned_pages[0][0]?.scanned_pages || 0,
            reviewed_pages: reviewed_pages[0][0]?.reviewed_pages || 0,
            deliveries: processedDeliveries
        });

    } catch (error) {
        console.error(`Database error:`, error);
        res.status(500).json({ error: `Internal server error` });
    }
});

export default router;