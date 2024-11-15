import fs from 'fs';
import { GraphQLScalarType, Kind } from 'graphql';

const clientsFilePath = '../data/client.json';
const propertiesFilePath = '../data/property.json';
const reservationsFilePath = '../data/reservation.json';

const readJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSONFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Custom scalar type for dates',
    parseValue(value: any) {
      return new Date(value);
    },
    serialize(value: any) {
      return value instanceof Date ? value.toISOString() : value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  Query: {
    clients: () => {
      return readJSONFile(clientsFilePath);
    },
    client: ({ id }: { id: number }) => {
      const clients = readJSONFile(clientsFilePath);
      return clients.find((client: any) => client.id === id);
    },
    properties: () => {
      return readJSONFile(propertiesFilePath);
    },
    property: ({ id }: { id: number }) => {
      const properties = readJSONFile(propertiesFilePath);
      return properties.find((property: any) => property.id === id);
    },
    reservations: () => {
      return readJSONFile(reservationsFilePath);
    },
    reservation: ({ id }: { id: number }) => {
      const reservations = readJSONFile(reservationsFilePath);
      return reservations.find((reservation: any) => reservation.id === id);
    },
  },
  Mutation: {
    addClient: ({ name, email, phone, address }: { name: string, email: string, phone: string, address: string }) => {
      const clients = readJSONFile(clientsFilePath);
      const newClient = {
        id: clients.length + 1,
        name,
        email,
        phone,
        address
      };
      clients.push(newClient);
      writeJSONFile(clientsFilePath, clients);
      return newClient;
    },
    updateClient: ({ id, email }: { id: number, email: string }) => {
      const clients = readJSONFile(clientsFilePath);
      const client = clients.find((client: any) => client.id === id);
      if (client) {
        client.email = email;
        writeJSONFile(clientsFilePath, clients);
      }
      return client;
    },
    deleteClient: ({ id }: { id: number }) => {
      let clients = readJSONFile(clientsFilePath);
      const client = clients.find((client: any) => client.id === id);
      if (client) {
        clients = clients.filter((client: any) => client.id !== id);
        writeJSONFile(clientsFilePath, clients);
      }
      return client;
    },
  }
};