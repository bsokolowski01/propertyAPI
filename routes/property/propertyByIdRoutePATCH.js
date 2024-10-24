import express from 'express';
import fs from 'fs';

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

propertyByIdRouterPATCH.patch('/properties/:id', (req, res) => {
    const propertyId = parseInt(req.params.id, 10);
    const { description } = req.body;

    if (!description) {
        return res.status(400).send({ error: 'Description is required' });
    }

    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let properties = JSON.parse(data);
        const propertyIndex = properties.findIndex(p => p.id === propertyId);

        if (propertyIndex === -1) {
            return res.status(404).send('Property not found');
        }

        properties[propertyIndex].description = description;

        fs.writeFile('data/property.json', JSON.stringify(properties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                return res.status(500).send('Error updating property description');
            }

            res.status(200).send({ message: 'Property description updated successfully' });
        });
    });
});
