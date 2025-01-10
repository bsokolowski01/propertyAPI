import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import { Client } from '../../interfaces/clientInterface'

export const clientIdRouter: Router = express.Router();

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client data
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error reading clients file
 */


clientIdRouter.get('/clients/:id', (req: Request, res: Response) => {

    const clientId = parseInt(req.params.id);

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

        const client = clients.find((c: Client) => c.id === clientId);

        if (client) {
            res.status(200).send({
                ...client,
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    list: {
                        href: `${req.protocol}://${req.get('host')}/clients`
                    }
                }
            });
        } else {
            res.status(404).send({ error: 'Client not found' });
        }
    });
});