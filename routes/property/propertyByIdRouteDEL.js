import express from 'express';
import fs from 'fs';

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
propertyIdRouterDEL.delete('/properties/:id', (req, res) => {
    fs.readFile('data/property.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let properties = JSON.parse(data);
        const updatedProperties = properties.filter(c => c.id != req.params.id);

        if (properties.length === updatedProperties.length) {
            return res.status(404).send('Property not found');
        }

        fs.writeFile('data/property.json', JSON.stringify(updatedProperties, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing properties data:', writeError);
                return res.status(500).send('Error deleting property');
            }

            res.status(200).send({ 
                message: 'Property deleted successfully',
                links: {
                    geteById: `/properties/${req.params.id}`,
                    getList: '/properties',
                    patch: `properties/${req.params.id}`,
                    post: '/properties',
                    put: `/properties/${req.params.id}`
                }
             });
        });
    });
});