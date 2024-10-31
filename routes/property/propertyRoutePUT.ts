import express, { Request, Response } from 'express';
import fs from 'fs';

import { Property } from '../../interfaces/propertyInterface';

export const propertyRouterPUT = express.Router();

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update property by ID
 *     tags: [Property]
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
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *               rooms:
 *                 type: integer
 *               surfaceArea:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [ "for sale", "sold", "rented" ]
 *               type:
 *                 type: string
 *                 enum: [ "house", "apartment", "land" ]
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
propertyRouterPUT.put('/properties/:id', (req: Request, res: Response): void => {

    const propertyId = parseInt(req.params.id, 10);
    let { address, description, rooms, surfaceArea, status, type, price, pricePerMeter, rent } = req.body;

    const validStatuses = ["for rent", "sold", "rented", "for sale"];
    const validTypes = ["house", "apartment", "land"];

    if (!address || !description || typeof rooms !== 'number' || typeof surfaceArea !== 'number' || !status || !type) {
        res.status(400).send({ error: 'All fields are required and must be valid' });
        return;
    }

    if (rooms < 1) {
        res.status(400).send({ error: 'Rooms must be a greater than zero' });
        return;
    }

    if (surfaceArea < 1) {
        res.status(400).send({ error: 'Surface area must be greater than zero' });
        return;
    }

    if (price < 1) {
        res.status(400).send({ error: 'Price must be greater than zero' });
        return;
    }

    if (!validStatuses.includes(status)) {
        res.status(400).send({ error: 'Invalid status value' });
        return;
    }

    if (!validTypes.includes(type)) {
        res.status(400).send({ error: 'Invalid type value' });
        return;
    }

    pricePerMeter = price ? `${(price / surfaceArea).toFixed(2)} zł/m2` : undefined;
    price = price ? `${price} zł` : undefined;
    surfaceArea = `${surfaceArea} m2`;
    rent = rent ? `${rent} zł` : undefined;

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

        const property = properties.findIndex((p: Property) => p.id === propertyId);

        if (property === -1) {
            res.status(404).send({ error: 'Property not found' });
            return;
        }

        properties[property] = { ...properties[property], address, description, rooms, surfaceArea, status, type, price, pricePerMeter, rent };

        fs.writeFile('data/property.json', JSON.stringify(properties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                res.status(500).send({ error: 'Error updating property' });
                return;
            }

            res.status(200).send({
                message: 'Property updated successfully',
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
