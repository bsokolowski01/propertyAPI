import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import fs from 'fs';
import cors from 'cors';
import { resolvers } from './resolvers/resolver';

const typeDefs = fs.readFileSync('./src/graphQL/schemas/schema.graphql', { encoding: 'utf-8' });


const app = express();
app.use(express.json());

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:9090',
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

// Start the server
app.listen(9090, () => {
  console.log('Server (GraphQL) started on 9090');
});