import express from 'express';
import fs from 'fs';

export const reservationByIdRouterDEL = express.Router();

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

reservationByIdRouterDEL.delete('/reservations/:id', (req, res) => {
    const reservationId = parseInt(req.params.id, 10);

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

        reservations.splice(reservationIndex, 1);

        fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing reservations data:', writeError);
                return res.status(500).send('Error deleting reservation');
            }

            res.status(200).send({ message: 'Reservation deleted successfully' });
        });
    });
});
