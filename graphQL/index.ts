import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

const typeDefs = fs.readFileSync('./schemas/schema.graphql', { encoding: 'utf-8' });

import { resolvers } from './resolvers/resolver';

const app = express();

app.use(express.json());

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:8989',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'X-Content-Type-Options', 'Cache-Control'],
  credentials: true,
};

app.use(cors(corsOptions));

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();
app.use('/graphql', cors(corsOptions), express.json(), expressMiddleware(server));

// Write initial data to JSON files
const clientData = JSON.parse(fs.readFileSync('./data/client.json', 'utf8'));
const propertyData = JSON.parse(fs.readFileSync('./data/property.json', 'utf8'));
const reservationData = JSON.parse(fs.readFileSync('./data/reservation.json', 'utf8'));

fs.writeFileSync('./data/client.json', JSON.stringify(clientData, null, 2));
fs.writeFileSync('./data/property.json', JSON.stringify(propertyData, null, 2));
fs.writeFileSync('./data/reservation.json', JSON.stringify(reservationData, null, 2));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Property API',
      version: '1.0.0',
      description: 'API for managing properties and reservations',
    },
    servers: [
      {
        url: 'http://localhost:8989',
      },
    ],
  },
  apis: ['routes/**/*.js', 'routes/**/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
app.listen(8989, () => {
  console.log('Server started on http://localhost:8989');
});