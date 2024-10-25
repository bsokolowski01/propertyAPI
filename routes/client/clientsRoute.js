import express from 'express';
import fs from 'fs';

export const clientsRouter = express.Router();

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
 *       500:
 *         description: Error reading data file
 */

clientsRouter.get('/clients', (req, res) => {
    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        const clients = JSON.parse(data);

        res.json({
            ...clients,
            links: {
                getList: '/clients'
            }
        });
    });
});