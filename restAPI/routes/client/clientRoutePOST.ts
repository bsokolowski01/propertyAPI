import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import validator from 'validator';
import { Client } from '../../../interfaces/clientInterface'

export const clientRouterPOST: Router = express.Router();

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client created successfully
 *                 client:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     phone:
 *                       type: string
 *                       example: +48123456789
 *                     address:
 *                       type: string
 *                       example: 123 Main St
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error saving client
 */

clientRouterPOST.post('/clients', (req: Request, res: Response): void => {
    const { name, email, phone, address }: Client = req.body;

    if (!name || !email || !phone || !address) {
        res.status(400).send({ error: 'All fields are required' });
        return;
    }

    try {
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email address');
        }

        if (!validator.isMobilePhone(phone)) {
            throw new Error('Invalid phone number');
        }
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
    }

    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading clients file:', err);
            res.status(500).send({ error: 'Error reading clients data' });
            return;
        }

        let clients: Client[];
        try {
            clients = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing clients data:', parseError);
            res.status(500).send({ error: 'Error parsing clients data' });
            return;
        }

        const lastId = clients.length > 0 ? clients[clients.length - 1].id : 0;
        const newId = lastId + 1;

        const newClient: Client = {
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
                res.status(500).send({ error: 'Error saving client' });
                return;
            }

            res.status(201).send({
                message: 'Client created successfully',
                client: newClient,
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    list: {
                        href: `${req.protocol}://${req.get('host')}/clients`
                    }
                }
            });
        });
    });
});