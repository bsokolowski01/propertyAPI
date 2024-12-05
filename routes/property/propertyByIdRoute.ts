import express, { Request, Response, Router } from 'express';
import fs from 'fs';

import { Property } from '../../interfaces/propertyInterface';

export const propertyIdRouter: Router = express.Router();

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Retrieve a property by ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The property ID
 *     responses:
 *       200:
 *         description: A single property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 address:
 *                   type: string
 *                   example: 123 Main St
 *                 description:
 *                   type: string
 *                   example: A beautiful house with a garden
 *                 price:
 *                   type: string
 *                   example: 500000 zł
 *                 rooms:
 *                   type: integer
 *                   example: 3
 *                 surfaceArea:
 *                   type: integer
 *                   example: 120
 *                 pricePerMeter:
 *                   type: string
 *                   example: 4166.67 zł/m2
 *                 status:
 *                   type: string
 *                   example: for sale
 *                 type:
 *                   type: string
 *                   example: house
 *       404:
 *         description: Property not found
 *       500:
 *         description: Error reading data file
 */
propertyIdRouter.get('/properties/:id', (req: Request, res: Response): void => {

    const propertyId = parseInt(req.params.id, 10);

    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).send({ error: 'Error reading data file' });
            return;
        }

        let properties: Property[];
        try {
            properties = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing clients data:', parseError);
            res.status(500).send({ error: 'Error parsing clients data' });
            return;
        }

        const property = properties.find((p: Property) => p.id === propertyId);

        if (!property) {
            res.status(404).send({ error: 'Property not found' });
            return;
        }

        res.status(200).send({
            ...property,
            _links: {
                self: {
                    href: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                },
            }
        });
    });
});

