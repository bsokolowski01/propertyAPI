import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('./grpc/proto/property.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.propertyAPI.ClientService('127.0.0.1:9191', grpc.credentials.createInsecure());
const property = new proto.propertyAPI.PropertyService('127.0.0.1:9191', grpc.credentials.createInsecure());
const reservation = new proto.propertyAPI.ReservationService('127.0.0.1:9191', grpc.credentials.createInsecure());

client.ReadClient({ id: 1 }, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Client:', response);
});

property.ReadProperty({ id: 1 }, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Property:', response);
});

reservation.ReadReservation({ id: 1 }, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Reservation:', response);
});