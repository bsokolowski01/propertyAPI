import express from 'express';

/**
 * @swagger
 * /client/{id}:
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
 */

export const clientsIdRouter = express.Router();

clientsIdRouter.get('/', (req, res) => {
    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        const clients = JSON.parse(data);
        const client = clients.find(c => c.id == req.params.id);

        if (client) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.json({
                ...client,
                links: {
                    delete: `/client/${client.id}`                }
            });
        } else {
            res.status(404).send('Client not found');
        }
    });
});