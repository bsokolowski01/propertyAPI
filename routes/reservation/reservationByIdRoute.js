import express from 'express';
import fs from 'fs';

export const reservationByIdRouter = express.Router();

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
 */
reservationByIdRouter.get('/reservations/:id', (req, res) => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let reservations = []

        try {
            reservations = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing reservations or reservations not found');
            return res.status(500).send('Error parsing reservations or reservations not found');
        }

        const reservation = reservations.find(r => r.id == req.params.id);

        if (reservation) {
            res.json({
                ...reservation,
                links: {
                    getList: '/reservations',
                    delete: `/reservations/${req.params.id}`,
                    patch: `/reservations/${req.params.id}`,
                    post: `/reservations`,
                    put: `/reservations/${req.params.id}`
                }
            });
        } else {
            res.status(404).send('Reservation not found');
        }
    });
});