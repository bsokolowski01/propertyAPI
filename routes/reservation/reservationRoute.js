import express from 'express';
import fs from 'fs';

export const reservationsRouter = express.Router();

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Retrieve a list of reservations
 *     tags: [Reservation]
 *     responses:
 *       200:
 *         description: A list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   propertyId:
 *                     type: integer
 *                     example: 6
 *                   clientId:
 *                     type: integer
 *                     example: 3
 *                   date:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-10-16T14:39:31.088Z
 *                       end:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-10-21T14:39:31.088Z
 *       500:
 *         description: Error reading data file
 */

reservationsRouter.get('/reservations', (req, res) => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let reservations = [];
        try {
            reservations = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing reservations data:', parseError);
            return res.status(500).send('Error parsing reservations data');
        }

        res.json({
            ...reservations,
            links: {
                post: '/reservations',
            }
        });
    });
});