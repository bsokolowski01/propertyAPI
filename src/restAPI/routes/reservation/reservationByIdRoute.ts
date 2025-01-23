import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import { Reservation } from 'interfaces/reservationInterface';

export const reservationByIdRouter: Router = express.Router();

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation data
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Error reading reservations file
 */
reservationByIdRouter.get('/reservations/:id', (req: Request, res: Response) => {

    const reservationId = parseInt(req.params.id);

    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file');
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

        const reservation = reservations.find((r: Reservation) => r.id == reservationId);

        if (reservation) {
            res.json({
                ...reservation,
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    list: {
                        href: `${req.protocol}://${req.get('host')}/reservations`
                    }
                }
            });
        } else {
            res.status(404).send({ error: 'Reservation not found' });
        }
    });
});
