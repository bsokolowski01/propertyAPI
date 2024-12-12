import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import { Client } from '../../../interfaces/clientInterface'

export const clientIdRouterDEL: Router = express.Router();

/**
 * @swagger
 * /clients/{id}:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client deleted successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error deleting client
 */

clientIdRouterDEL.delete('/clients/:id', (req: Request, res: Response): void => {
    const clientId = parseInt(req.params.id, 10);

    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).json({ error: 'Error reading data file' });
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

        const updatedClients = clients.filter((c: Client) => c.id !== clientId);

        if (clients.length === updatedClients.length) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }

        fs.writeFile('data/client.json', JSON.stringify(updatedClients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                res.status(500).json({ error: 'Error deleting client' });
                return;
            }

            res.status(200).json({
                message: 'Client deleted successfully',
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
