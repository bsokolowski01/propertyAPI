import express from 'express';
import fs from 'fs';

export const propertiesRouter = express.Router();

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Retrieve a list of properties
 *     tags: [Property]
 *     parameters:
 *       - in: query
 *         name: maxPricePerMeter
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum price per meter
 *       - in: query
 *         name: maxRent
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum rent
 *     responses:
 *       200:
 *         description: A list of properties
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
 *                   address:
 *                     type: string
 *                     example: 123 Main St
 *                   description:
 *                     type: string
 *                     example: A beautiful house with a garden
 *                   price:
 *                     type: string
 *                     example: 500000 zł
 *                   rooms:
 *                     type: integer
 *                     example: 3
 *                   surfaceArea:
 *                     type: integer
 *                     example: 120
 *                   pricePerMeter:
 *                     type: string
 *                     example: 4166.67 zł/m2
 *                   status:
 *                     type: string
 *                     example: for sale
 *                   type:
 *                     type: string
 *                     example: house
 *       404:
 *         description: No properties found matching the criteria
 *       500:
 *         description: Error reading data file
 */
propertiesRouter.get('/properties', (req, res) => {
    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).send({ error:'Error reading data file' });
            return;
        }

        let properties = JSON.parse(data);
        const { maxPricePerMeter, maxRent } = req.query;

        if (maxPricePerMeter) {
            properties = properties.filter(property => {
                if (property.pricePerMeter) {
                    const pricePerMeter = parseFloat(property.pricePerMeter.split(' ')[0]);
                    return pricePerMeter <= parseFloat(maxPricePerMeter);
                }
                return false;
            });
        }

        if (maxRent) {
            properties = properties.filter(property => {
                if (property.rent) {
                    const rent = parseFloat(property.rent.split(' ')[0]);
                    return rent <= parseFloat(maxRent);
                }
                return false;
            });
        }

        if (properties.length === 0) {
            res.status(404).send({ message: 'No properties found matching the criteria' });
            return;
        }

        res.status(200).send({
            propertiesList: properties.map(p => ({
                ...p,
                _links: {
                    self: {
                        href: `${req.protocol}://${req.get('host')}${req.originalUrl}/${p.id}`
                    }
                }
            })),
            _links: {
                self: {
                    href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                }
            }
        });
    });
});
