import express from 'express';
import fs from 'fs';

import { clientGenerator, propertyGenerator, reservationGenerator } from './generator.js';
const app = new express();

app.use(express.json());

const clientData = []
const propertyData = []
const reservationData = []


for (let id = 1; id <=10; id++) {
    clientData.push(clientGenerator(id));
    propertyData.push(propertyGenerator(id));
    reservationData.push(reservationGenerator(id));
}

fs.writeFileSync('./data/client.json', JSON.stringify(clientData, null, 2));
fs.writeFileSync('./data/property.json', JSON.stringify(propertyData, null, 2));
fs.writeFileSync('./data/reservation.json', JSON.stringify(reservationData, null, 2));


// Wyświetlanie wszystkich klientów po ich ID
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
  fs.readFile("data/reservation.json", 'utf8', (err, data) => {
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

      const { rooms, date, status } = req.body;

      if (typeof rooms !== 'number' || !date || typeof date.end !== 'string' || typeof status !== 'string') {
          return res.status(400).send({ error: 'Invalid reservation data format' });
      }

      const startDate = new Date();
      const endDate = new Date(date.end);

      if (endDate < startDate) {
          return res.status(400).send({ error: 'End date cannot be earlier and equal than start date' });
      }

      const lastId = reservations.length > 0 ? reservations[reservations.length - 1].id : 0;
      const newId = lastId + 1;

      const newReservation = {
          id: newId,
          rooms,
          date: {
              start: new Date(),
          },
          status
      };

      reservations.push(newReservation);

      fs.writeFile("data/reservation.json", JSON.stringify(reservations, null, 2), (writeError) => {
          if (writeError) {
              console.error('Error writing reservations data:', writeError);
              return res.status(500).send('Error saving reservation');
          }

          res.status(201).send({ message: 'Reservation created successfully', reservation: newReservation });
      });
  });
});




app.listen(8989, () => {
    console.log('Started on 8989');
});