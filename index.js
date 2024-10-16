import express from 'express';
import fs from 'fs';

import { clientGenerator, propertyGenerator, clientIdGenerator } from './generator.js';
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

// Usuwanie klienta
app.delete('/client/:id', (req, res) => {
    fs.readFile('data/client.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let clients = JSON.parse(data);
        const updatedClients = clients.filter(c => c.id != req.params.id);

        if (clients.length === updatedClients.length) {
            return res.status(404).send('Client not found');
        }

        fs.writeFile('data/client.json', JSON.stringify(updatedClients, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing clients data:', writeError);
                return res.status(500).send('Error deleting client');
            }

            res.status(200).send({ message: 'Client deleted successfully' });
        });
    });
});

// Aktualizacja nieruchomości
app.put('/property/:id', (req, res) => {
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

            res.status(200).send({ message: 'Property updated successfully', property: updatedProperty });
        });
    });
});

// Stworzenie rezerwacji
app.post('/reservation/create', (req, res) => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading reservations file:', err);
            return res.status(500).send('Error reading reservations data');
        }

        let reservations = [];
        if (data) {
            try {
                reservations = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing reservations data:', parseError);
                return res.status(500).send('Error parsing reservations data');
            }
        }

        const { propertyId } = req.body;

        if (typeof propertyId !== 'number') {
            return res.status(400).send({ error: 'Specify id of property' });
        }
       
        const existingReservation = reservations.find(r => r.propertyId === propertyId);
        if (existingReservation) {
            return res.status(400).send({ error: 'Property is already reserved' });
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
                clientId: clientIdGenerator().clientId,
                date: {
                    start: new Date().toISOString(),
                    end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString() // 3 days later
                },
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

// Wyświetlanie rezerwacji po ID
app.get('/reservation/:id', (req, res) => {
    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let reservations = []

        try {
            reservations = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing reservations or reservations not found');
            return res.status(500).send('Error parsing reservations or reservations not found');
        }

        const reservation = reservations.find(r => r.id == req.params.id);

        if (reservation) {
            res.json(reservation);
        } else {
            res.status(404).send('Reservation not found');
        }
    });
});

// Przedłużenie rezerwacji
app.patch('/reservation/:id/extend', (req, res) => {
    const { days } = req.body;

    if (typeof days !== 'number' || days <= 0) {
        return res.status(400).send({ error: 'Invalid number of days' });
    }

    fs.readFile('data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        let reservations = [];
        try {
            reservations = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing reservations or reservations not found');
            return res.status(500).send('Error parsing reservations or reservations not found');
        }

        const reservationIndex = reservations.findIndex(r => r.id == req.params.id);

        if (reservationIndex === -1) {
            return res.status(404).send('Reservation not found');
        }

        const reservation = reservations[reservationIndex];
        const endDate = new Date(reservation.date.end);
        endDate.setDate(endDate.getDate() + days);
        reservation.date.end = endDate.toISOString();

        fs.writeFile('data/reservation.json', JSON.stringify(reservations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing reservations data:', writeError);
                return res.status(500).send('Error updating reservation');
            }

            res.status(200).send({ message: 'Reservation extended successfully', reservation });
        });
    });
});

app.listen(8989, () => {
    console.log('Started on 8989');
});