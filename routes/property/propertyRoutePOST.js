import express from 'express';
import fs from 'fs';

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
propertyRouterPOST.post('/properties', (req, res) => {
    const { address, description, rooms, surfaceArea, status, type, rent, price } = req.body;

    const validStatuses = ["for rent", "sold", "rented", "for sale"];
    const validTypes = ["house", "apartment", "land"];

    if (!address || !description || typeof rooms !== 'number' || typeof surfaceArea !== 'number' || !status || !type) {
        return res.status(400).send({ error: 'All fields are required and must be valid' });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).send({ error: 'Invalid status value' });
    }

    if (!validTypes.includes(type)) {
        return res.status(400).send({ error: 'Invalid type value' });
    }

    if ((!price && !rent) || (price && rent)) {
        return res.status(400).send({ error: 'Either price or rent must be provided, but not both' });
    }

    const surfaceAreaStr = `${surfaceArea} m2`;
    let priceStr = price ? `${price} zł` : undefined;
    let rentStr = rent ? `${rent} zł` : undefined;
    let pricePerMeter;

    if (price) {
        pricePerMeter = `${(price / surfaceArea).toFixed(2)} zł/m2`;
    }

    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading properties file:', err);
            return res.status(500).send('Error reading properties data');
        }

        let properties = [];
        if (data) {
            try {
                properties = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing properties data:', parseError);
                return res.status(500).send('Error parsing properties data');
            }
        }

        const lastId = properties.length > 0 ? properties[properties.length - 1].id : 0;
        const newId = lastId + 1;

        const newProperty = {
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
                return res.status(500).send('Error saving property');
            }

            res.status(201).send({ 
                message: 'Property created successfully', 
                property: newProperty,
                links: {
                    getList: "properties"
                }
            });
        });
    });
});