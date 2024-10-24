import express from 'express';
import fs from 'fs';

export const clientIdRouterDEL = express.Router();

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
 *       404:
 *         description: Client not found
 */
clientIdRouterDEL.delete('/clients/:id', (req, res) => {
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