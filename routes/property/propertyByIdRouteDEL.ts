import express, { Request, Response } from 'express';
import fs from 'fs';

import { Property } from '../../interfaces/propertyInterface';

export const propertyIdRouterDEL = express.Router();

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete a property by ID
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
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Property deleted successfully
 *       404:
 *         description: Property not found
 *       500:
 *         description: Error deleting property
 */
propertyIdRouterDEL.delete('/properties/:id', (req: Request, res: Response): void => {

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

        const updatedProperties = properties.filter(property => property.id !== propertyId);

        if (properties.length === updatedProperties.length) {
            res.status(404).send({ error: 'Property not found' });
            return;
        }

        fs.writeFile('data/property.json', JSON.stringify(updatedProperties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                res.status(500).send({ error: 'Error deleting property' })
                return;
            }

            res.status(200).send({
                message: 'Property deleted successfully',
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
