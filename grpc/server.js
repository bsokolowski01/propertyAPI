import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';

const packageDefinition = protoLoader.loadSync('grpc/proto/property.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const clientsFilePath = './data/client.json';
const propertiesFilePath = './data/property.json';
const reservationsFilePath = './data/reservation.json';

const readJSONFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const server = new grpc.Server();

server.addService(proto.propertyAPI.PropertyService.service, {
  GetClient: (call, callback) => {
    const clients = readJSONFile(clientsFilePath);
    const client = clients.find((client) => client.id === call.request.clientId);
    if (client) {
      callback(null, client);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Client not found"
      });
    }
  },
  GetProperty: (call, callback) => {
    const properties = readJSONFile(propertiesFilePath);
    const property = properties.find((property) => property.id === call.request.propertyId);
    if (property) {
      callback(null, property);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Property not found"
      });
    }
  },
  GetReservation: (call, callback) => {
    const reservations = readJSONFile(reservationsFilePath);
    const reservation = reservations.find((reservation) => reservation.id === call.request.reservationId);
    if (reservation) {
      callback(null, reservation);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Reservation not found"
      });
    }
  }
});

server.bindAsync("127.0.0.1:9292", grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server (gRPC) started on port ${port}`);
});