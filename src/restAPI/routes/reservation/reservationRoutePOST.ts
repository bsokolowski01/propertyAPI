import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import { Reservation } from 'interfaces/reservationInterface';
import { Property } from 'interfaces/propertyInterface';
import { Client } from 'interfaces/clientInterface';

export const reservationRouterPOST: Router = express.Router();

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

reservationRouterPOST.post('/reservations', (req: Request, res: Response): void => {
    const { propertyId, clientId }: Reservation = req.body;

    try {
        if (typeof propertyId !== 'number' || typeof clientId !== 'number') {
            throw new Error('Invalid input');
        }
    }
    catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
    }


    fs.readFile('data/property.json', 'utf8', (err, propertyData) => {
        if (err) {
            console.error('Error reading properties file:', err);
            res.status(500).send({ error: 'Error reading properties data' });
            return;
        }

        let properties: Property[];
        try {
            properties = JSON.parse(propertyData);
        } catch (parseError) {
            console.error('Error parsing properties data:', parseError);
            res.status(500).send({ error: 'Error parsing properties data' });
            return;
        }

        const property = properties.find((p: Property) => p.id == propertyId);

        try {
            if (!property) {
                throw new Error('Property not found');
            }
            if (property.status !== 'for sale' && property.status !== 'for rent') {
                throw new Error('Reservation can only be made for properties with status "for sale" or "for rent"');
            }
        }
        catch (error) {
            res.status(404).json({ error: (error as Error).message });
            return;
        }

        fs.readFile('data/client.json', 'utf8', (err, clientData) => {
            if (err) {
                console.error('Error reading clients file:', err);
                res.status(500).send({ error: 'Error reading clients data' });
                return;
            }

            let clients: Client[]
            try {
                clients = JSON.parse(clientData);
            } catch (parseError) {
                console.error('Error parsing clients data:', parseError);
                res.status(500).send({ error: 'Error parsing clients data' });
                return;
            }

            const client = clients.find((c: Client) => c.id === clientId);

            try {
                if (!client) {
                    throw new Error('Client not found');
                }
            }
            catch (error) {
                res.status(404).json({ error: (error as Error).message });
                return;
            }

            fs.readFile('data/reservation.json', 'utf8', (err, reservationData) => {
                if (err) {
                    console.error('Error reading reservations file:', err);
                    res.status(500).send({ error: 'Error reading reservations data' });
                    return;
                }

                let reservations: Reservation[];
                try {
                    reservations = JSON.parse(reservationData);
                } catch (parseError) {
                    console.error('Error parsing reservations data:', parseError);
                    res.status(500).send({ error: 'Error parsing reservations data' });
                    return;
                }

                const lastId = reservations.length > 0 ? reservations[reservations.length - 1].id : 0;
                const newId = lastId + 1;

                const newReservation: Reservation = {
                    id: newId,
                    propertyId,
                    clientId,
                    date: {
                        start: new Date(),
                        end: new Date(new Date().setDate(new Date().getDate() + 3))
                    },
                };

                reservations.push(newReservation);

                fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
                    if (writeError) {
                        console.error('Error writing reservations data:', writeError);
                        res.status(500).send({ error: 'Error saving reservation' });
                        return;
                    }

                    res.status(201).send({
                        message: 'Reservation created successfully',
                        reservation: newReservation,
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
    });
});
