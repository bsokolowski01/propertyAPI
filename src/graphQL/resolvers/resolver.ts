import fs from 'fs';
import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { Client } from '../../../interfaces/clientInterface';
import { Property } from '../../../interfaces/propertyInterface';
import { Reservation } from '../../../interfaces/reservationInterface';
import {
  StringFilter,
  IntFilter,
  DateFilter,
  SortInput,
  ClientQueryParams,
  PropertyQueryParams,
  ReservationQueryParams
} from '../interfaces/filterInterface';

const clientsFilePath = './data/client.json';
const propertiesFilePath = './data/property.json';
const reservationsFilePath = './data/reservation.json';

const readJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSONFile = <T>(filePath: string, data: T[]) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const applyStringFilter = (value: string, filter: StringFilter) => {
  if (filter.eq && value !== filter.eq) return false;
  if (filter.contains && !value.includes(filter.contains)) return false;
  if (filter.ne && value === filter.ne) return false;
  if (filter.notContains && value.includes(filter.notContains)) return false;
  return true;
};

const applyIntFilter = (value: number, filter: IntFilter) => {
  if (filter.eq && value !== filter.eq) return false;
  if (filter.gt && value <= filter.gt) return false;
  if (filter.lt && value >= filter.lt) return false;
  if (filter.gte && value < filter.gte) return false;
  if (filter.lte && value > filter.lte) return false;
  return true;
};

const applyDateFilter = (value: string, filter: DateFilter) => {
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

const applySort = <T extends Record<string, string | number | Date>>(
  data: T[], 
  sortField: keyof T, 
  sortOrder: 'asc' | 'desc'
): T[] => {
  return data.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

const applyPagination = <T>(data: T[], page: number, pageSize: number): T[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
};

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Custom scalar type for dates in format yyyy-mm-dd',
    parseValue(value: unknown): Date {
      if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
          throw new TypeError(`Invalid date value: ${value}`);
        }
        return parsedDate;
      }
      throw new TypeError(`Cannot create date from value: ${value}`);
    },
    serialize(value: unknown) {
      if (!(typeof value === 'string' || typeof value === 'number' || value instanceof Date)) {
        throw new TypeError(`Cannot create date from value: ${value}`);
      }
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        throw new TypeError(`Invalid date value: ${value}`);
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    parseLiteral(ast: ValueNode): Date | null {
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
    clients: (_: unknown, { filter, sort, page, pageSize }: ClientQueryParams): Client[] => {
      let clients = readJSONFile(clientsFilePath);
      if (filter) {
        clients = clients.filter((client: Client) => {
          return (
            (!filter.name || applyStringFilter(client.name, filter.name)) &&
            (!filter.email || applyStringFilter(client.email, filter.email)) &&
            (!filter.phone || applyStringFilter(client.phone, filter.phone)) &&
            (!filter.address || applyStringFilter(client.address, filter.address))
          );
        });
      }
      if (sort) {
        clients = applySort(clients, sort.field, sort.order);
      }
      if (page && pageSize) {
        clients = applyPagination(clients, page, pageSize);
      }
      return clients;
    },
    client: (_: unknown, { id }: { id: number }) => {
      const clients = readJSONFile(clientsFilePath);
      return clients.find((client: Client) => client.id === id);
    },
    properties: (_: unknown, { filter, sort, page, pageSize }: PropertyQueryParams): Property[] => {
      let properties = readJSONFile(propertiesFilePath);
      if (filter) {
        properties = properties.filter((property: Property) => {
          const surfaceArea = property.surfaceArea ? parseInt(property.surfaceArea.replace(' m2', ''), 10) : null;
          const rent = property.rent ? parseInt(property.rent.replace(' zł', ''), 10) : null;
          const price = property.price ? parseInt(property.price.replace(' zł', ''), 10) : null;
          const pricePerMeter = property.pricePerMeter ? parseInt(property.pricePerMeter.replace(' zł/m2', ''), 10) : null;

          return (
            (!filter.address || applyStringFilter(property.address, filter.address)) &&
            (!filter.description || applyStringFilter(property.description, filter.description)) &&
            (!filter.rooms || applyIntFilter(property.rooms, filter.rooms)) &&
            (!filter.surfaceArea || (surfaceArea !== null && applyIntFilter(surfaceArea, filter.surfaceArea))) &&
            (!filter.status || applyStringFilter(property.status, filter.status)) &&
            (!filter.type || applyStringFilter(property.type, filter.type)) &&
            (!filter.rent || (rent !== null && applyIntFilter(rent, filter.rent))) &&
            (!filter.price || (price !== null && applyIntFilter(price, filter.price))) &&
            (!filter.pricePerMeter || (pricePerMeter !== null && applyIntFilter(pricePerMeter, filter.pricePerMeter)))
          );
        });
      }

      if (sort) {
        properties = applySort(properties, sort.field, sort.order);
      }
      if (page && pageSize) {
        properties = applyPagination(properties, page, pageSize);
      }

      return properties;
    },
    property: (_: unknown, { id }: { id: number }) => {
      const properties = readJSONFile(propertiesFilePath);
      return properties.find((property: Property) => property.id === id);
    },
    reservations: (_: unknown, { filter, sort, page, pageSize }: ReservationQueryParams): Reservation[] => {
      let reservations = readJSONFile(reservationsFilePath);
      if (filter) {
        reservations = reservations.filter((reservation: Reservation) => {
          return (
            (!filter.clientId || applyIntFilter(reservation.clientId, filter.clientId)) &&
            (!filter.propertyId || applyIntFilter(reservation.propertyId, filter.propertyId)) &&
            (!filter.date || !filter.date.start || applyDateFilter(reservation.date.start.toString().split('T')[0], filter.date.start)) &&
            (!filter.date || !filter.date.end || applyDateFilter(reservation.date.end.toString().split('T')[0], filter.date.end))
          );
        });
      }

      if (sort) {
        reservations = applySort(reservations, sort.field, sort.order);
      }
      if (page && pageSize) {
        reservations = applyPagination(reservations, page, pageSize);
      }

      return reservations;
    },
    reservation: (_: unknown, { id }: { id: number }) => {
      const reservations = readJSONFile(reservationsFilePath);
      return reservations.find((reservation: Reservation) => reservation.id === id);
    },
  },
  Mutation: {
    // Clients
    addClient: (_: unknown, { input }: { input: Omit<Client, 'id'> }): Client => {
      const clients = readJSONFile(clientsFilePath);
      const newClient = {
        id: clients.length + 1,
        ...input,
      };
      clients.push(newClient);
      writeJSONFile(clientsFilePath, clients);
      return newClient;
    },
    updateClient: (_: unknown, { id, input }: { id: number, input: Partial<Omit<Client, 'id'>> }): Client => {
      const clients = readJSONFile(clientsFilePath);
      const client = clients.find((client: Client) => client.id === id);
      if (client) {
        Object.assign(client, input)
        writeJSONFile(clientsFilePath, clients);
      }
      return client;
    },
    deleteClient: (_: unknown, { id }: { id: number }) => {
      let clients = readJSONFile(clientsFilePath);
      const client = clients.find((client: Client) => client.id === id);
      if (client) {
        clients = clients.filter((client: Client) => client.id !== id);
        writeJSONFile(clientsFilePath, clients);
      }
      return client;
    },
    // Properties
    addProperty: (_: unknown, { input }: { input: Omit<Property, 'id'> }): Property => {
      const properties = readJSONFile(propertiesFilePath);
      const newProperty = {
        id: properties.length + 1,
        ...input,
      };
      properties.push(newProperty);
      writeJSONFile(propertiesFilePath, properties);
      return newProperty;
    },
    updateProperty: (_: unknown, { id, input }: { id: number, input: Partial<Omit<Property, 'id'>> }): Property | undefined => {
      const properties = readJSONFile(propertiesFilePath);
      const property = properties.find((property: Property) => property.id === id);
      if (property) {
        Object.assign(property, input);
        writeJSONFile(propertiesFilePath, properties);
      }
      return property;
    },
    deleteProperty: (_: unknown, { id }: { id: number }) => {
      let properties = readJSONFile(propertiesFilePath);
      const property = properties.find((property: Property) => property.id === id);
      if (property) {
        properties = properties.filter((property: Property) => property.id !== id);
        writeJSONFile(propertiesFilePath, properties);
      }
      return property;
    },
    // Reservations
    addReservation: (_: unknown, { input }: { input: Omit<Reservation, 'id'> }): Reservation => {
      const reservations = readJSONFile(reservationsFilePath);
      const dateStart = new Date();
      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 3);

      const newReservation = {
        id: reservations.length + 1,
        ...input,
        date: {
          start: dateStart,
          end: dateEnd
        }
      };

      const reservationToSave = {
        ...newReservation,
        date: {
          start: dateStart.toISOString().split('T')[0],
          end: dateEnd.toISOString().split('T')[0]
        }
      };

      reservations.push(reservationToSave);
      writeJSONFile(reservationsFilePath, reservations);
      return newReservation;
    },
    updateReservation: (_: unknown, { id, input }: { id: number, input: Partial<Omit<Reservation, 'id'>> }): Reservation | undefined => {
      const reservations = readJSONFile(reservationsFilePath);
      const reservation = reservations.find((reservation: Reservation) => reservation.id === id);
      if (reservation) {
        Object.assign(reservation, input);
        writeJSONFile(reservationsFilePath, reservations);
      }
      return reservation;
    },
    deleteReservation: (_: unknown, { id }: { id: number }) => {
      let reservations = readJSONFile(reservationsFilePath);
      const reservation = reservations.find((reservation: Reservation) => reservation.id === id);
      if (reservation) {
        reservations = reservations.filter((reservation: Reservation) => reservation.id !== id);
        writeJSONFile(reservationsFilePath, reservations);
      }
      return reservation;
    },
  },
};
