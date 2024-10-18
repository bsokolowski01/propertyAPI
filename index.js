import express from 'express';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


import { clientGenerator, propertyGenerator, clientIdGenerator } from './generator.js';

import { clientsIdRouter } from './routes/clientsByIdRoute.js';
import { clientsRouter } from './routes/clientsRoute.js';

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

app.use("/client", clientsRouter);
app.use("/client/:id", clientsIdRouter);

/**
 * @swagger
 * /client/{id}:
 *   delete:
 *     summary: Delete client by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
app.delete('/client/:id', (req, res) => {
    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let clients = JSON.parse(data);
        const updatedClients = clients.filter(c => c.id != req.params.id);

        if (clients.length === updatedClients.length) {
            return res.status(404).send('Client not found');
        }

        fs.writeFile('data/client.json', JSON.stringify(updatedClients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                return res.status(500).send('Error deleting client');
            }

            res.status(200).send({ message: 'Client deleted successfully' });
        });
    });
});


/**
 * @swagger
 * /property/{id}:
 *   delete:
 *     summary: Delete a property by ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Property deleted successfully
 *       404:
 *         description: Property not found
 *       500:
 *         description: Error deleting property
 */
app.delete('/property/:id', (req, res) => {
    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let properties = JSON.parse(data);
        const updatedProperties = properties.filter(c => c.id != req.params.id);

        if (properties.length === updatedProperties.length) {
            return res.status(404).send('Property not found');
        }

        fs.writeFile('data/property.json', JSON.stringify(updatedProperties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                return res.status(500).send('Error deleting property');
            }

            res.status(200).send({ message: 'Property deleted successfully' });
        });
    });
});


/**
 * @swagger
 * /property/price-per-meter/{price}:
 *   get:
 *     summary: Get properties with price per meter less than or equal to the specified value
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: price
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of properties
 *       400:
 *         description: Invalid price per meter
 */
app.get('/property/price-per-meter/:price', (req, res) => {
    const pricePerMeter = parseFloat(req.params.price);

    if (isNaN(pricePerMeter) || pricePerMeter <= 0) {
        return res.status(400).send({ error: 'Invalid price per meter' });
    }

    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let properties = [];
        try {
            properties = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing properties data:', parseError);
            return res.status(500).send('Error parsing properties data');
        }

        const filteredProperties = properties.filter(p => {
            if (p.pricePerMeter) {
                const price = parseFloat(p.pricePerMeter.split(' ')[0]);
                return price <= pricePerMeter;
            }
            return false;
        });

        res.json(filteredProperties);
    });
});

/**
 * @swagger
 * /property/rent/{rent}:
 *   get:
 *     summary: Get properties with rent less than or equal to the specified value
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: rent
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of properties
 *       400:
 *         description: Invalid rent
 */
app.get('/property/rent/:rent', (req, res) => {
    const rent = parseFloat(req.params.rent);

    if (isNaN(rent) || rent <= 0) {
        return res.status(400).send({ error: 'Invalid rent' });
    }

    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let properties = [];
        try {
            properties = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing properties data:', parseError);
            return res.status(500).send('Error parsing properties data');
        }

        const filteredProperties = properties.filter(p => {
            if (p.rent) {
                const rentValue = parseFloat(p.rent.split(' ')[0]);
                return rentValue <= rent;
            }
            return false;
        });

        res.json(filteredProperties);
    });
});

/**
 * @swagger
 * /property/{id}:
 *   put:
 *     summary: Update property by ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *       - in: query
 *         name: rooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ "for_sale", "sold", "rented" ]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ "house", "apartment", "land" ]
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
app.put('/property/:id', (req, res) => {
    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let properties = JSON.parse(data);
        const propertyIndex = properties.findIndex(p => p.id == req.params.id);

        if (propertyIndex === -1) {
            return res.status(404).send('Property not found');
        }

        const updatedProperty = { ...properties[propertyIndex], ...req.query };
        properties[propertyIndex] = updatedProperty;

        fs.writeFile('data/property.json', JSON.stringify(properties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                return res.status(500).send('Error updating property');
            }

            res.status(200).send({ message: 'Property updated successfully', property: updatedProperty });
        });
    });
});

/**
 * @swagger
 * /reservation/create:
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
app.post('/reservation/create', (req, res) => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading reservations file:', err);
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
 * /reservation/{id}:
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
app.get('/reservation/:id', (req, res) => {
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
 * /reservation/{id}/extend:
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
app.patch('/reservation/:id/extend', (req, res) => {
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