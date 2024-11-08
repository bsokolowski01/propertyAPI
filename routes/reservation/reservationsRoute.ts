import express, { Request, Response } from 'express';
import fs from 'fs';

import { Reservation } from '../../interfaces/reservationInterface';

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
 *       404:
 *         description: Empty reservation list
 *       500:
 *         description: Error reading data file
 */

reservationsRouter.get('/reservations', (req: Request, res: Response): void => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).send({ error: 'Error reading data file' });
            return;
        }

        let reservations: Reservation[];
        try {
            reservations = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing clients data:', parseError);
            res.status(500).send({ error: 'Error parsing clients data' });
            return;
        }

        if (!reservations || reservations.length === 0) {
            res.status(404).send({ error: 'Empty reservation list' });
            return;
        }

        res.status(200).send({
            reservationsList: reservations.map(r => ({
                ...r,
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}/${r.id}`
                    }
                }
            })),
            _links: {
                self: {
                    href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                }
            }
        });
    });
});
