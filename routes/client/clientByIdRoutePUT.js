import express from 'express';
import fs from 'fs';
import validator from 'validator';

export const clientByIdRouterPUT = express.Router();

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

clientByIdRouterPUT.put('/clients/:id', (req, res) => {
    const clientId = parseInt(req.params.id);
    const { name, email, phone, address } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).send({ error: 'Invalid name' });
    }
    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
        return res.status(400).send({ error: 'Invalid email' });
    }
    if (!phone || typeof phone !== 'string') {
        return res.status(400).send({ error: 'Invalid phone' });
    }
    if (!address || typeof address !== 'string' || address.trim() === '') {
        return res.status(400).send({ error: 'Invalid address' });
    }

    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading clients file:', err);
            return res.status(500).send('Error reading clients data');
        }

        let clients = [];
        try {
            clients = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing clients data:', parseError);
            return res.status(500).send('Error parsing clients data');
        }

        const clientIndex = clients.findIndex(c => c.id === clientId);

        if (clientIndex === -1) {
            return res.status(404).send({ error: 'Client not found' });
        }

        clients[clientIndex] = { ...clients[clientIndex], name, email, phone, address };

        fs.writeFile('data/client.json', JSON.stringify(clients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                return res.status(500).send('Error updating client data');
            }

        res.status(200).send({
            message: 'Client data updated successfully',
            links: {
                getById: `/clients/${clientId}`,
                getList: '/clients',
                delete: `/clients/${clientId}`,
                post: '/clients',
                update: `/clients/${clientId}`,
            }
        });
    });
});
});
