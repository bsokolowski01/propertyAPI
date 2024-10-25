import express from 'express';
import fs from 'fs';

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
 *                 enum: [ "for_sale", "sold", "rented" ]
 *               type:
 *                 type: string
 *                 enum: [ "house", "apartment", "land" ]
 *               price:
 *                type: number
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
propertyRouterPUT.put('/properties/:id', (req, res) => {
    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let properties = JSON.parse(data);
        const propertyIndex = properties.findIndex(p => p.id == req.params.id);

        if (propertyIndex === -1) {
            return res.status(404).send('Property not found');
        }

        const updatedProperty = { ...properties[propertyIndex], ...req.body };
        properties[propertyIndex] = updatedProperty;

        fs.writeFile('data/property.json', JSON.stringify(properties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                return res.status(500).send('Error updating property');
            }

            res.status(200).send({ 
                message: 'Property updated successfully', 
                property: updatedProperty,
                links: {
                    getById: `/properties/${propertyId}`,
                    getList: '/properties',
                    delete: `/properties/${propertyId}`,
                    patch: `/properties/${propertyId}`,
                    post: `/properties`
                }
            });
        });
    });
});
