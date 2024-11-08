import express, { Request, Response } from 'express';
import fs from 'fs';

import { Property } from '../../interfaces/propertyInterface';

export const propertyByIdRouterPATCH = express.Router();

/**
 * @swagger
 * /properties/{id}:
 *   patch:
 *     summary: Update the description of a property by ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: A newly renovated apartment with modern amenities
 *     responses:
 *       200:
 *         description: Property description updated successfully
 *       404:
 *         description: Property not found
 *       500:
 *         description: Error updating property description
 */

propertyByIdRouterPATCH.patch('/properties/:id', (req: Request, res: Response): void => {

    const propertyId = parseInt(req.params.id, 10);
    const { description }: Property = req.body;

    if (!description) {
        res.status(400).send({ error: 'Description is required' });
        return;
    }

    if (typeof description !== "string") {
        res.status(400).send({ error: 'Description must be a string' });
        return;
    }

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

        const propertyIndex = properties.findIndex((p: Property) => p.id === propertyId);

        if (propertyIndex === -1) {
            res.status(404).send({ error: 'Property not found' });
            return;
        }

        properties[propertyIndex].description = description;

        fs.writeFile('data/property.json', JSON.stringify(properties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                res.status(500).send({ error: 'Error updating property description' });
                return;
            }

            res.status(200).send({
                message: 'Property description updated successfully',
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    list: {
                        href: `${req.protocol}://${req.get('host')}/properties`
                    }
                }
            });
        });
    });
});
