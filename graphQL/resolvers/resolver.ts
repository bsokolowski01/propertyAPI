import fs from 'fs';
import { GraphQLScalarType, Kind } from 'graphql';

const clientsFilePath = './data/client.json';
const propertiesFilePath = './data/property.json';
const reservationsFilePath = './data/reservation.json';

const readJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSONFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const applyStringFilter = (value: string, filter: any) => {
  if (filter.eq && value !== filter.eq) return false;
  if (filter.contains && !value.includes(filter.contains)) return false;
  if (filter.ne && value === filter.ne) return false;
  if (filter.notContains && value.includes(filter.notContains)) return false;
  return true;
};

const applyIntFilter = (value: number, filter: any) => {
  if (filter.eq && value !== filter.eq) return false;
  if (filter.gt && value <= filter.gt) return false;
  if (filter.lt && value >= filter.lt) return false;
  if (filter.gte && value < filter.gte) return false;
  if (filter.lte && value > filter.lte) return false;
  return true;
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
    clients: (_: any, { filter }: { filter: any }) => {
      let clients = readJSONFile(clientsFilePath);
      if (filter) {
        clients = clients.filter((client: any) => {
          return (
            (!filter.name || applyStringFilter(client.name, filter.name)) &&
            (!filter.email || applyStringFilter(client.email, filter.email)) &&
            (!filter.phone || applyStringFilter(client.phone, filter.phone)) &&
            (!filter.address || applyStringFilter(client.address, filter.address))
          );
        });
      }
      return clients;
    },
    client: (_: any, { id }: { id: number }) => {
      const clients = readJSONFile(clientsFilePath);
      return clients.find((client: any) => client.id === id);
    },
    properties: (_: any, { filter }: { filter: any }) => {
      let properties = readJSONFile(propertiesFilePath);
      if (filter) {
        properties = properties.filter((property: any) => {
          return (
            (!filter.address || applyStringFilter(property.address, filter.address)) &&
            (!filter.description || applyStringFilter(property.description, filter.description)) &&
            (!filter.rooms || applyIntFilter(property.rooms, filter.rooms)) &&
            (!filter.surfaceArea || applyStringFilter(property.surfaceArea, filter.surfaceArea)) &&
            (!filter.status || applyStringFilter(property.status, filter.status)) &&
            (!filter.type || applyStringFilter(property.type, filter.type)) &&
            (!filter.rent || applyStringFilter(property.rent, filter.rent)) &&
            (!filter.price || applyStringFilter(property.price, filter.price)) &&
            (!filter.pricePerMeter || applyStringFilter(property.pricePerMeter, filter.pricePerMeter))
          );
        });
      }
      return properties;
    },
    property: (_: any, { id }: { id: number }) => {
      const properties = readJSONFile(propertiesFilePath);
      return properties.find((property: any) => property.id === id);
    },
    reservations: () => {
      return readJSONFile(reservationsFilePath);
    },
    reservation: (_: any, { id }: { id: number }) => {
      const reservations = readJSONFile(reservationsFilePath);
      return reservations.find((reservation: any) => reservation.id === id);
    },
  },
  Mutation: {
    addClient: (_: any, { input }: { input: any }) => {
      const clients = readJSONFile(clientsFilePath);
      const newClient = {
        id: clients.length + 1,
        ...input
      };
      clients.push(newClient);
      writeJSONFile(clientsFilePath, clients);
      return newClient;
    },
    updateClient: (_: any, { id, email }: { id: number, email: string }) => {
      const clients = readJSONFile(clientsFilePath);
      const client = clients.find((client: any) => client.id === id);
      if (client) {
        client.email = email;
        writeJSONFile(clientsFilePath, clients);
      }
      return client;
    },
    deleteClient: (_: any, { id }: { id: number }) => {
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