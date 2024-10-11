import express from 'express';
import { faker } from '@faker-js/faker';
import fs from 'fs';

import { generatorData } from './generator.js';
const app = new express();

const data = []

for (let id = 1; id <=10; id++) {
    data.push(generatorData(id));
}

fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

// Wyświetlanie wszystkich klientów po ich ID
app.get('/client/:id', (req, res) => {
    
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading data file');
        return;
      }
  
      const clients = JSON.parse(data);

      const client = clients.find(c => c.client.id == req.params.id);
  
      if (client) {
        res.json(client.client);
      } else {
        res.status(404).send('Client not found');
      }
    });
  });

app.post('/createReservation', (req, res) => {

    
      fs.readFile('data.json', 'utf8', (err, data) => {

        var reservation = JSON.parse(data);

        reservation = req.body;

        if (!reservation) {
            return res.status(400).send({ error: 'Reservation data is required' });
        }
    
        const { id, rooms, date, status } = reservation;
    
        if (typeof id !== 'number' || typeof rooms !== 'number' || typeof status !== 'string' ||
            !date || typeof date.start !== 'string' || typeof date.end !== 'string') {
            return res.status(400).send({ error: 'Invalid reservation data format' });
        }

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
    
        reservations.push(reservation);
    
        fs.writeFile('data.json', JSON.stringify(reservations, null, 2), (writeError) => {
          if (writeError) {
            console.error('Error writing reservations data:', writeError);
            return res.status(500).send('Error saving reservation');
          }
    
          res.status(201).send({ message: 'Reservation created successfully', reservation });
        });
      });

});


app.listen(8989, () => {
    console.log('Started on 8989');
});