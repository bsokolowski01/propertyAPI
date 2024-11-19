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

const applyDateFilter = (value: string, filter: any) => {
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const dateValue = formatDate(new Date(value));
  const filterDateEq = filter.eq ? formatDate(new Date(filter.eq)) : null;
  const filterDateGt = filter.gt ? formatDate(new Date(filter.gt)) : null;
  const filterDateLt = filter.lt ? formatDate(new Date(filter.lt)) : null;
  const filterDateGte = filter.gte ? formatDate(new Date(filter.gte)) : null;
  const filterDateLte = filter.lte ? formatDate(new Date(filter.lte)) : null;

  if (filter.eq && dateValue !== filterDateEq) return false;
  if (filter.gt && filterDateGt && dateValue <= filterDateGt) return false;
  if (filter.lt && filterDateLt && dateValue >= filterDateLt) return false;
  if (filter.gte && filterDateGte && dateValue < filterDateGte) return false;
  if (filter.lte && filterDateLte && dateValue > filterDateLte) return false;

  return true;
};



export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Custom scalar type for dates in format yyyy-mm-dd',
    parseValue(value: any) {
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        throw new TypeError(`Invalid date value: ${value}`);
      }
      return parsedDate;
    },
    serialize(value: any) {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        throw new TypeError(`Invalid date value: ${value}`);
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        const parsedDate = new Date(ast.value);
        if (isNaN(parsedDate.getTime())) {
          throw new TypeError(`Invalid date value: ${ast.value}`);
        }
        return parsedDate;
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
          const surfaceArea = property.surfaceArea ? parseInt(property.surfaceArea.replace(' m2', ''), 10) : null;
          const price = property.price ? parseInt(property.price.replace(' zł', ''), 10) : null;
          const pricePerMeter = property.pricePerMeter ? parseInt(property.pricePerMeter.replace(' zł/m2', ''), 10) : null;
          return (
            (!filter.address || applyStringFilter(property.address, filter.address)) &&
            (!filter.description || applyStringFilter(property.description, filter.description)) &&
            (!filter.rooms || applyStringFilter(property.rooms, filter.rooms)) &&
            (!filter.surfaceArea || (surfaceArea !== null && applyIntFilter(surfaceArea, filter.surfaceArea))) &&
            (!filter.status || applyStringFilter(property.status, filter.status)) &&
            (!filter.type || applyStringFilter(property.type, filter.type)) &&
            (!filter.rent || applyStringFilter(property.rent, filter.rent)) &&
            (!filter.price || (price !== null && applyIntFilter(price, filter.price))) &&
            (!filter.pricePerMeter || (pricePerMeter !== null && applyIntFilter(pricePerMeter, filter.pricePerMeter)))
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
            (!filter.date || !filter.date.start || applyDateFilter(reservation.date.start, filter.date.start)) &&
            (!filter.date || !filter.date.end || applyDateFilter(reservation.date.end, filter.date.end))
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
        ...input,
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
      address: string,
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
  },
};
