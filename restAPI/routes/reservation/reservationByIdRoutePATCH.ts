import express, { Request, Response, Router } from 'express';
import fs from "fs";
import { Reservation } from "../../../interfaces/reservationInterface";

export const reservationByIdRouterPATCH: Router = express.Router();

/**
 * @swagger
 * /reservations/{id}:
 *   patch:
 *     summary: Extend reservation by ID
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: days
 *         required: true
 *         schema:
 *           type: integer
 *           description: Number of days to extend the reservation
 *     responses:
 *       200:
 *         description: Reservation extended successfully
 *       400:
 *         description: Invalid number of days
 *       404:
 *         description: Reservation not found
 */
reservationByIdRouterPATCH.patch('/reservations/:id', (req: Request, res: Response): void => {
    const reservationId = parseInt(req.params.id, 10);
    const days = parseInt(req.query.days as string, 10);

    if (isNaN(days) || days <= 0) {
        res.status(400).send({ error: 'Invalid number of days' });
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

        const reservation = reservations[reservationIndex];
        const endDate = new Date(reservation.date.end);
        endDate.setDate(endDate.getDate() + days);
        reservation.date.end = endDate;

        fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing reservations data:', writeError);
                res.status(500).send({ error: 'Error updating reservation' });
                return;
            }

            res.status(200).send({
                message: 'Reservation extended successfully',
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
        });
    });
});