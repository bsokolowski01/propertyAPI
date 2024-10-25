import express from 'express';
import fs from 'fs';

export const propertyIdRouter = express.Router();

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
propertyIdRouter.get('/properties/:id', (req, res) => {
    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        const properties = JSON.parse(data);
        const property = properties.find(c => c.id == req.params.id);

        if (!property) {
            return res.status(404).send('Property not found');
        }

        res.json({
            ...property,
            links: {
                getList: '/properties',
                delete: `/properties/${property.id}`,
                patch: `/properties/${property.id}`,
                post: '/properties',
                put: `/properties/${property.id}`
            }
        });
    });
});