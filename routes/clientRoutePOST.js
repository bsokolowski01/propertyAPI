import express from 'express';
import fs from 'fs';
import validator from 'validator';

export const clientRouterPOST = express.Router();

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a client
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error saving client
 */


clientRouterPOST.post("/clients", (req, res) => {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).send({ error: 'Invalid email address' });
    }

    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading clients file:', err);
            return res.status(500).send('Error reading clients data');
        }

        let clients = [];
        if (data) {
            try {
                clients = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing clients data:', parseError);
                return res.status(500).send('Error parsing clients data');
            }
        }

        const lastId = clients.length > 0 ? clients[clients.length - 1].id : 0;
        const newId = lastId + 1;

        const newClient = {
            id: newId,
            name,
            email,
            phone,
            address
        };

        clients.push(newClient);

        fs.writeFile('data/client.json', JSON.stringify(clients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                return res.status(500).send('Error saving client');
            }

            res.status(201).send({ message: 'Client created successfully', client: newClient });
        });
    });
});