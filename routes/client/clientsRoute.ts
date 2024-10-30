import express, { Request, Response, Router } from 'express';
import fs from 'fs';

import { Client } from '../../interfaces/clientInterface';

export const clientsRouter: Router = express.Router();

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Retrieve a list of clients
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *                   phone:
 *                     type: string
 *                     example: 123-456-7890
 *                   address:
 *                     type: string
 *                     example: 123 Main St
 *       404:
 *         description: Empty client list
 *       500:
 *         description: Error reading clients file
 */

clientsRouter.get('/clients', (req: Request, res: Response): void => {
    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).send({ error: 'Error reading data file' });
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

        if (!clients || clients.length === 0) {
            res.status(204).send({ error: 'No content, empty client list' });
            return;
        }

        res.status(200).send({
            clientsList: clients.map(client => ({
                ...client,
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}/${client.id}`
                    }
                }
            })),
            _links: {
                self: {
                    href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                }
            }
        });
    });
});
