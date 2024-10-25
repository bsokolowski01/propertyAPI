import express from 'express';
import fs from 'fs';
import validator from 'validator';

export const clientRouterPATCH = express.Router();

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
clientRouterPATCH.patch('/clients/:id', (req, res) => {
    const clientId = parseInt(req.params.id, 10);
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).send({ error: 'Invalid email address' });
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

        clients[clientIndex].email = email;

        fs.writeFile('data/client.json', JSON.stringify(clients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                return res.status(500).send('Error updating client email');
            }

            res.status(200).send({
                message: 'Client email updated successfully',
                links: {
                    self: `/clients/${clientId}`,
                    delete: `/clients/${clientId}`,
                    update: `/clients/${clientId}`,
                    list: '/clients'
                }
            });
        });
    });
});