import express, { Request, Response } from 'express';
import fs from 'fs';

import { Property } from '../../interfaces/propertyInterface';

export const propertyRouterPOST = express.Router();

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Property]
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
 *                 type: number
 *               surfaceArea:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [ "for sale", "sold", "rented", "for rent" ]
 *               type:
 *                 type: string
 *                 enum: [ "house", "apartment", "land" ]
 *               rent:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error saving property
 */
propertyRouterPOST.post('/properties', (req: Request, res: Response): void => {
    const { address, description, rooms, surfaceArea, status, type, rent, price }: Property = req.body;

    const validStatuses = ["for rent", "sold", "rented", "for sale"];
    const validTypes = ["house", "apartment", "land"];

    if (!address || !description || typeof rooms !== 'number' || typeof surfaceArea !== 'number' || !status || !type) {
        res.status(400).send({ error: 'All fields are required and must be valid' });
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

    if ((!price && !rent) || (price && rent)) {
        res.status(400).send({ error: 'Either price or rent must be provided, but not both' });
        return; 
    }

    const surfaceAreaStr = `${surfaceArea} m2`;
    const priceStr = price ? `${price} zł` : undefined;
    const rentStr = rent ? `${rent} zł` : undefined;
    const pricePerMeter = price ? `${(price / surfaceArea).toFixed(2)} zł/m2` : undefined;

    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading properties file:', err);
            res.status(500).send({ error: 'Error reading properties data' });
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

        const lastId = properties.length > 0 ? properties[properties.length - 1].id : 0;
        const newId = lastId + 1;

        const newProperty: Property = {
            id: newId,
            address,
            description,
            rooms,
            surfaceArea: surfaceAreaStr,
            status,
            type,
            rent: rentStr,
            price: priceStr,
            pricePerMeter
        };

        properties.push(newProperty);

        fs.writeFile('data/property.json', JSON.stringify(properties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                res.status(500).send({ error: 'Error saving property' });
                return; 
            }

            res.status(201).send({
                message: 'Property created successfully',
                property: newProperty,
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}/${newId}`
                    },
                    list: {
                        href: `${req.protocol}://${req.get('host')}/properties`
                    }
                }
            });
        });
    });
});
