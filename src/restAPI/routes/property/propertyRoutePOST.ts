import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import { Property, PropertyStatus, PropertyType } from 'interfaces/propertyInterface';

export const propertyRouterPOST: Router = express.Router();

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
 *                 example: 3
 *               surfaceArea:
 *                 type: number
 *                 example: 70
 *               status:
 *                 type: string
 *                 enum: [ "for sale", "sold", "rented", "for rent" ]
 *               type:
 *                 type: string
 *                 enum: [ "house", "apartment", "land" ]
 *               rent:
 *                 type: number
 *                 example: 2500
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error saving property
 */
propertyRouterPOST.post('/properties', (req: Request, res: Response): void => {

    let {
        address,
        description,
        rooms,
        surfaceArea,
        status,
        type,
        price,
        rent
    }: {
        address: string,
        description: string,
        rooms: number,
        surfaceArea: number,
        status: PropertyStatus,
        type: PropertyType,
        price: number,
        rent: number
    } = req.body;

    try {
        if (typeof address !== 'string' || typeof description !== 'string' || typeof rooms !== 'number' || typeof surfaceArea !== 'number' || !status || !type) {
            throw new Error('All fields are required and must be valid')
        }
        if (rooms < 1) {
            throw new Error('Rooms must be greater than zero')
        }
        if (surfaceArea < 1) {
            throw new Error('Surface area must be greater than zero')
        }
        if (price && price < 1) {
            throw new Error('Price must be greater than zero')
        }
        if (rent && rent < 1) {
            throw new Error('Rent must be greater than zero')
        }
        if (!Object.values(PropertyStatus).includes(status as PropertyStatus)) {
            throw new Error('Invalid status value')
        }
        if (!Object.values(PropertyType).includes(type as PropertyType)) {
            throw new Error('Invalid type value')
        }
        if ((!price && !rent) || (price && rent)) {
            throw new Error('Either price or rent must be provided, but not both')
        }
    }
    catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
    }

    let surfaceAreaString = `${surfaceArea} m2`;
    let priceString = price ? `${price} zł` : undefined;
    let rentString = rent ? `${rent} zł` : undefined;
    let pricePerMeter = price ? `${(price / surfaceArea).toFixed(2)} zł/m2` : undefined;

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
            console.error('Error parsing properties data:', parseError);
            res.status(500).send({ error: 'Error parsing properties data' });
            return;
        }

        const lastId = properties.length > 0 ? properties[properties.length - 1].id : 0;
        const newId = lastId + 1;

        const newProperty: Property = {
            id: newId,
            address,
            description,
            rooms,
            surfaceArea: surfaceAreaString,
            status,
            type,
            ...(priceString && { price: priceString }),
            ...(rentString && { rent: rentString }),
            ...(pricePerMeter && { pricePerMeter })
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
