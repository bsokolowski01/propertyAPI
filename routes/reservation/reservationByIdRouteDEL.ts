import express, { Request, Response, Router } from 'express';
import fs from 'fs';

import { Reservation } from '../../interfaces/reservationInterface';

export const reservationByIdRouterDEL: Router = express.Router();

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Error deleting reservation
 */

reservationByIdRouterDEL.delete('/reservations/:id', (req: Request, res: Response): void => {
    const reservationId = parseInt(req.params.id, 10);

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

        reservations.splice(reservationIndex, 1);

        fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing reservations data:', writeError);
                res.status(500).send({ error: 'Error deleting reservation' });
                return;
            }

            res.status(200).send({
                message: 'Reservation deleted successfully',
                _links: {
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
