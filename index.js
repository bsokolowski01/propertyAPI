import express from 'express';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { clientGenerator, propertyGenerator, clientIdGenerator } from './generator.js';

import { clientIdRouter } from './routes/clientByIdRoute.js';
import { clientRouterPOST } from './routes/clientRoutePOST.js';
import { clientsRouter } from './routes/clientsRoute.js';
import { clientIdRouterDEL } from './routes/clientByIdRouteDEL.js';
import { clientRouterPATCH } from './routes/clientByIdRoutePATCH.js';

import { propertiesRouter } from './routes/propertiesRoute.js';
import { propertyIdRouter } from './routes/propertyByIdRoute.js';
import { propertyIdRouterDEL } from './routes/propertyByIdRouteDEL.js';
import { propertyRouterPUT } from './routes/propertyRoutePUT.js';
import { propertyRouterPOST } from './routes/propertyRoutePOST.js';

const app = new express();

app.use(express.json());

const clientData = []
const propertyData = []

for (let id = 1; id <=10; id++) {
    clientData.push(clientGenerator(id));
    propertyData.push(propertyGenerator(id));
}

fs.writeFileSync('./data/client.json', JSON.stringify(clientData, null, 2));
fs.writeFileSync('./data/property.json', JSON.stringify(propertyData, null, 2));

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Property API',
            version: '1.0.0',
            description: 'API for managing properties and reservations',
        },
        servers: [
            {
                url: 'http://localhost:8989',
            },
        ],
    },
    apis: ['routes/*.js', 'index.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("", clientsRouter);
app.use("", clientIdRouter);
app.use("", clientRouterPOST);
app.use("", clientIdRouterDEL); 
app.use("", clientRouterPATCH);

app.use("", propertiesRouter);
app.use("", propertyIdRouter)
app.use("", propertyIdRouterDEL);
app.use("", propertyRouterPUT);
app.use("", propertyRouterPOST);


/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID of the property to reserve
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Property not found
 */
app.post('/reservations', (req, res) => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading reservations data');
        }

        let reservations = [];
        if (data) {
            try {
                reservations = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing reservations data:', parseError);
                return res.status(500).send('Error parsing reservations data');
            }
        }

        const propertyId = parseInt(req.query.propertyId, 10);

        if (isNaN(propertyId)) {
            return res.status(400).send({ error: 'Specify a valid property ID' });
        }
       
        const existingReservation = reservations.find(r => r.propertyId === propertyId);
        if (existingReservation) {
            return res.status(400).send({ error: 'Property is already reserved' });
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

            const lastId = reservations.length > 0 ? reservations[reservations.length - 1].id : 0;
            const newId = lastId + 1;

            const newReservation = {
                id: newId,
                propertyId,
                clientId: clientIdGenerator().clientId,
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
app.get('/reservations/:id', (req, res) => {
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
            res.json(reservation);
        } else {
            res.status(404).send('Reservation not found');
        }
    });
});

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
app.patch('/reservations/:id', (req, res) => {
    const days = parseInt(req.query.days, 10);

    if (isNaN(days) || days <= 0) {
        return res.status(400).send({ error: 'Invalid number of days' });
    }

    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let reservations = [];
        try {
            reservations = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing reservations or reservations not found');
            return res.status(500).send('Error parsing reservations or reservations not found');
        }

        const reservationIndex = reservations.findIndex(r => r.id == req.params.id);

        if (reservationIndex === -1) {
            return res.status(404).send('Reservation not found');
        }

        const reservation = reservations[reservationIndex];
        const endDate = new Date(reservation.date.end);
        endDate.setDate(endDate.getDate() + days);
        reservation.date.end = endDate.toISOString();

        fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing reservations data:', writeError);
                return res.status(500).send('Error updating reservation');
            }

            res.status(200).send({ message: 'Reservation extended successfully', reservation });
        });
    });
});

app.listen(8989, () => {
    console.log('Started on 8989');
}); 