import express from 'express';
import fs from 'fs';

import { clientGenerator, propertyGenerator } from './generator.js';
const app = new express();

app.use(express.json());

const clientData = []
const propertyData = []

for (let id = 1; id <=10; id++) {
    clientData.push(clientGenerator(id));
    propertyData.push(propertyGenerator(id));
}

fs.writeFileSync('./data/client.json', JSON.stringify(clientData, null, 2));
fs.writeFileSync('./data/property.json', JSON.stringify(propertyData, null, 2));

// Wyświetlanie klientów po ich ID
app.get('/client/:id', (req, res) => {
  fs.readFile('data/client.json', 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Error reading data file');
          return;
      }

      const clients = JSON.parse(data);
      const client = clients.find(c => c.id == req.params.id);

      if (client) {
          res.json(client);
      } else {
          res.status(404).send('Client not found');
      }
  });
});


app.post('/createReservation', (req, res) => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading reservations file:', err);
            return res.status(500).send('Error reading reservations data');
        }

        let reservations = [];
        try {
            reservations = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing reservations data:', parseError);
            return res.status(500).send('Error parsing reservations data');
        }

        const { propertyId, rooms, date } = req.body;

        if (typeof propertyId !== 'number' || typeof rooms !== 'number' || !date || typeof date.end !== 'string') {
            return res.status(400).send({ error: 'Invalid reservation data format' });
        }

        fs.readFile('data/property.json', 'utf8', (err, propertyData) => {
            if (err) {
                console.error('Error reading properties file:', err);
                return res.status(500).send('Error reading properties data');
            }

            let properties = [];
            try {
                properties = JSON.parse(propertyData);
            } catch (parseError) {
                console.error('Error parsing properties data:', parseError);
                return res.status(500).send('Error parsing properties data');
            }

            const property = properties.find(p => p.id === propertyId);

            if (!property) {
                return res.status(404).send({ error: 'Property not found' });
            }

            if (property.status !== 'for sale' && property.status !== 'for rent') {
                return res.status(400).send({ error: 'Reservation can only be made for properties with status "for sale" or "for rent"' });
            }

            const lastId = reservations.length > 0 ? reservations[reservations.length - 1].id : 0;
            const newId = lastId + 1;

            const newReservation = {
                id: newId,
                propertyId,
                rooms,
                date: {
                    start: new Date(),
                    end: new Date(new Date().setDate(new Date().getDate() + 3))
                },
                status: property.status
            };

            reservations.push(newReservation);

            fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
                if (writeError) {
                    console.error('Error writing reservations data:', writeError);
                    return res.status(500).send('Error saving reservation');
                }

                res.status(201).send({ message: 'Reservation created successfully', reservation: newReservation });
            });
        });
    });
});

app.listen(8989, () => {
    console.log('Started on 8989');
});