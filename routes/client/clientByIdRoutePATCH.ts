import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import validator from 'validator';

import { Client } from '../../interfaces/clientInterface';

export const clientRouterPATCH: Router = express.Router();

/**
 * @swagger
 * /clients/{id}:
 *   patch:
 *     summary: Update client's email by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client email updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error updating client email
 */
clientRouterPATCH.patch('/clients/:id', (req: Request, res: Response): void => {
    const clientId = parseInt(req.params.id, 10);
    const { email } = req.body;

    try {
        if (!email || !validator.isEmail(email)) {
            throw new Error('Invalid email address');
        }
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
    }

    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading clients file:', err);
            res.status(500).json({ error: 'Error reading clients data' });
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

        const clientIndex = clients.findIndex((client) => client.id === clientId);

        if (clientIndex === -1) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }

        clients[clientIndex].email = email;

        fs.writeFile('data/client.json', JSON.stringify(clients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                res.status(500).json({ error: 'Error updating client email' });
                return;
            }

            res.status(200).json({
                message: 'Client email updated successfully',
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
