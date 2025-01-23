import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import { Reservation } from 'interfaces/reservationInterface';
import { Property } from 'interfaces/propertyInterface';
import { Client } from 'interfaces/clientInterface';

export const reservationByIdRouterPUT: Router = express.Router();

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update reservation data by ID
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: integer
 *                 example: 1
 *               clientId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-01-01T00:00:00.000Z
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-01-04T00:00:00.000Z
 *     responses:
 *       200:
 *         description: Reservation data updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Error updating reservation data
 */

reservationByIdRouterPUT.put('/reservations/:id', (req: Request, res: Response): void => {
    const reservationId = parseInt(req.params.id, 10);
    const { propertyId, clientId, date }: Reservation = req.body;

    try {
        if (typeof propertyId !== 'number' || propertyId <= 0) {
            throw new Error('Invalid propertyId');
        }
        if (typeof clientId !== 'number' || clientId <= 0) {
            throw new Error('Invalid clientId');
        }
        if (!date || typeof date !== 'object' || !date.start || !date.end) {
            throw new Error('Invalid date');
        }
        if (isNaN(Date.parse(date.start.toString())) || isNaN(Date.parse(date.end.toString()))) {
            throw new Error('Invalid date format');
        }
    }
    catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
    }

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
            console.error('Error parsing reservations or reservations not found');
            res.status(500).send({ error: 'Error parsing reservations or reservations not found' });
            return;
        }

        const reservationIndex = reservations.findIndex((r: Reservation) => r.id === reservationId);

        if (reservationIndex === -1) {
            res.status(404).send({ error: 'Reservation not found' });
            return;
        }

        reservations[reservationIndex] = { ...reservations[reservationIndex], propertyId, clientId, date };

        fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing reservations data:', writeError);
                res.status(500).send({ error: 'Error updating reservation data' });
                return;
            }

            res.status(200).send({
                message: 'Reservation data updated successfully',
                links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    list: {
                        href: `${req.protocol}://${req.get('host')}/reservations`
                    }
                }
            });
        });
    });
});