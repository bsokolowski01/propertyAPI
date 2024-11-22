import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import validator from 'validator';

export const clientByIdRouterPUT: Router = express.Router();

import { Client } from '../../interfaces/clientInterface'

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update client data by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: 123-456-7890
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *     responses:
 *       200:
 *         description: Client data updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error updating client data
 */

clientByIdRouterPUT.put('/clients/:id', (req: Request, res: Response): void => {
    const clientId = parseInt(req.params.id, 10);
    const { name, email, phone, address }: Client = req.body;

    if (!validator.isLength(name, { min: 1 }) || !validator.isAlpha(name.replace(/\s/g, ''))) {
        res.status(400).json({ error: 'Invalid name' });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({ error: 'Invalid email address' });
        return;
    }

    if (!validator.isMobilePhone(phone, 'any')) {
        res.status(400).json({ error: 'Invalid phone' });
        return;
    }

    if (!validator.isLength(address, { min: 1 })) {
        res.status(400).json({ error: 'Invalid address' });
        return;
    }

    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading clients file:', err);
            return res.status(500).json({ error: 'Error reading clients data' });
        }
        
        let clients: Client[];
        try {
            clients = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing clients data:', parseError);
            res.status(500).send({ error: 'Error parsing clients data' });
            return;
        }

        const clientIndex = clients.findIndex((c: Client) => c.id === clientId);

        if (clientIndex === -1) {
            return res.status(404).json({ error: 'Client not found' });
        }

        clients[clientIndex] = { ...clients[clientIndex], name, email, phone, address };

        fs.writeFile('data/client.json', JSON.stringify(clients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                return res.status(500).json({ error: 'Error updating client data' });
            }

            res.status(200).json({
                message: 'Client data updated successfully',
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
