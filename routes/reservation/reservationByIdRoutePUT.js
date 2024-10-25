import express from 'express';
import fs from 'fs';

export const reservationByIdRouterPUT = express.Router();

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

reservationByIdRouterPUT.put('/reservations/:id', (req, res) => {
    const reservationId = parseInt(req.params.id, 10);
    const { propertyId, clientId, date } = req.body;

    // Walidacja pól
    if (typeof propertyId !== 'number' || propertyId <= 0) {
        return res.status(400).send({ error: 'Invalid propertyId' });
    }
    if (typeof clientId !== 'number' || clientId <= 0) {
        return res.status(400).send({ error: 'Invalid clientId' });
    }
    if (!date || typeof date !== 'object' || !date.start || !date.end) {
        return res.status(400).send({ error: 'Invalid date' });
    }
    if (isNaN(Date.parse(date.start)) || isNaN(Date.parse(date.end))) {
        return res.status(400).send({ error: 'Invalid date format' });
    }

    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let reservations = JSON.parse(data);
        const reservationIndex = reservations.findIndex(r => r.id === reservationId);

        if (reservationIndex === -1) {
            return res.status(404).send('Reservation not found');
        }

        reservations[reservationIndex] = { ...reservations[reservationIndex], propertyId, clientId, date };

        fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing reservations data:', writeError);
                return res.status(500).send('Error updating reservation data');
            }

            res.status(200).send({ 
                message: 'Reservation data updated successfully', 
                links: {
                    getById: `/reservations/${reservationId}`,
                    getList: '/reservations',
                    delete: `/reservations/${reservationId}`,
                    patch: `/reservations/${reservationId}`,
                    post: `/reservations`                }
            });
        });
    });
});