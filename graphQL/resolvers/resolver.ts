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

const parseDate = (value: string) => {
  const [day, month, year] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const applyDateFilter = (value: string, filter: any) => {
  const dateValue = parseDate(value);
  if (filter.eq && dateValue.getTime() !== parseDate(filter.eq).getTime()) return false;
  if (filter.gt && dateValue.getTime() <= parseDate(filter.gt).getTime()) return false;
  if (filter.lt && dateValue.getTime() >= parseDate(filter.lt).getTime()) return false;
  if (filter.gte && dateValue.getTime() < parseDate(filter.gte).getTime()) return false;
  if (filter.lte && dateValue.getTime() > parseDate(filter.lte).getTime()) return false;
  return true;
};

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Custom scalar type for dates in format dd-mm-yyyy',
    parseValue(value: any) {
      return parseDate(value);
    },
    serialize(value: any) {
      return value instanceof Date ? `${value.getDate()}-${value.getMonth() + 1}-${value.getFullYear()}` : value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return parseDate(ast.value);
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
    reservations: (_: any, { filter }: { filter: any }) => {
      let reservations = readJSONFile(reservationsFilePath);
      if (filter) {
        reservations = reservations.filter((reservation: any) => {
          return (
            (!filter.clientId || applyIntFilter(reservation.clientId, filter.clientId)) &&
            (!filter.propertyId || applyIntFilter(reservation.propertyId, filter.propertyId)) &&
            (!filter.date || applyDateFilter(reservation.date.start, filter.date)) &&
            (!filter.date || applyDateFilter(reservation.date.end, filter.date))
          );
        });
      }
      return reservations;
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
    updateClient: (_: any, { id, name, email, phone, address }: {
      id: number,
      name: string,
      email: string,
      phone: string,
      address: string
    }) => {
      const clients = readJSONFile(clientsFilePath);
      const client = clients.find((client: any) => client.id === id);
      if (client) {
        client.name = name;
        client.email = email;
        client.phone = phone;
        client.address = address;
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