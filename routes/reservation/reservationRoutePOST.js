import express from 'express';
import fs from 'fs';

export const reservationRouterPOST = express.Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservation]
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
 *     responses:
 *       201:
 *         description: Reservation created successfully 
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Property not found
 *       500:
 *         description: Error creating reservation
 */

reservationRouterPOST.post('/reservations', (req, res) => {
    const { propertyId, clientId } = req.body;

    if (typeof propertyId !== 'number' || typeof clientId !== 'number') {
        return res.status(400).send({ error: 'Invalid input' });
    }

    fs.readFile('data/property.json', 'utf8', (err, propertyData) => {
        if (err) {
            console.error('Error reading properties file:', err);
            return res.status(500).send('Error reading properties data');
        }

        let properties = [];
        try {
            properties = JSON.parse(propertyData);
        } catch (parseError) {
            console.error('Error parsing properties data:', parseError);
            return res.status(500).send('Error parsing properties data');
        }

        const property = properties.find(p => p.id === propertyId);

        if (!property) {
            return res.status(404).send({ error: 'Property not found' });
        }

        if (property.status !== 'for sale' && property.status !== 'for rent') {
            return res.status(400).send({ error: 'Reservation can only be made for properties with status "for sale" or "for rent"' });
        }

        fs.readFile('data/reservation.json', 'utf8', (err, reservationData) => {
            if (err) {
                console.error('Error reading reservations file:', err);
                return res.status(500).send('Error reading reservations data');
            }

            let reservations = [];
            try {
                reservations = JSON.parse(reservationData);
            } catch (parseError) {
                console.error('Error parsing reservations data:', parseError);
                return res.status(500).send('Error parsing reservations data');
            }

            const lastId = reservations.length > 0 ? reservations[reservations.length - 1].id : 0;
            const newId = lastId + 1;

            const newReservation = {
                id: newId,
                propertyId,
                clientId,
                date: {
                    start: new Date().toISOString(),
                    end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString() // 3 days later
                },
            };

            reservations.push(newReservation);

            fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
                if (writeError) {
                    console.error('Error writing reservations data:', writeError);
                    return res.status(500).send('Error saving reservation');
                }

                res.status(201).send({ message: 'Reservation created successfully', reservation: newReservation });
            });
        });
    });
});