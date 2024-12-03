import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('./proto/property.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.propertyAPI.PropertyService('127.0.0.1:9292', grpc.credentials.createInsecure());

client.GetClient({ clientId: 1 }, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Client:', response);
});

client.GetProperty({ propertyId: 1 }, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Property:', response);
});

client.GetReservation({ reservationId: 1 }, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Reservation:', response);
});