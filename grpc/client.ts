import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './types/property';
import { Client } from './types/propertyAPI/Client';
import { Query } from './types/propertyAPI/Query';
import { DeleteClientResponse__Output } from './types/propertyAPI/DeleteClientResponse';
import { Client__Output } from './types/propertyAPI/Client';
import { Clients__Output } from './types/propertyAPI/Clients';

const packageDefinition = protoLoader.loadSync('./proto/property.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.propertyAPI.ClientService('127.0.0.1:9191', grpc.credentials.createInsecure());

const readClient = (id: number) => {
  client.ReadClient({ id }, (error, response?: Client__Output) => {
    if (error) {
      console.error('Error reading client:', error);
      return;
    }
    console.log('Client:', response);
  });
};

const readClients = (query: Query) => {
  client.ReadClients(query, (error, response?: Clients__Output) => {
    if (error) {
      console.error('Error reading clients:', error);
      return;
    }
    if (response) {
      console.log('Clients:', response.clients);
    }
  });
};

const createClient = (newClient: Omit<Client, 'id'>) => {
  client.CreateClient(newClient, (error, response?: Client__Output) => {
    if (error) {
      console.error('Error creating client:', error);
      return;
    }
    console.log('Created Client:', response);
  });
};

const updateClient = (updatedClient: Client) => {
  client.UpdateClient(updatedClient, (error, response?: Client__Output) => {
    if (error) {
      console.error('Error updating client:', error);
      return;
    }
    console.log('Updated Client:', response);
  });
};

const deleteClient = (id: number) => {
  client.DeleteClient({ id }, (error, response?: DeleteClientResponse__Output) => {
    if (error) {
      console.error('Error deleting client:', error);
      return;
    }
    if (response) {
      console.log('Deleted Client:', response.deleted);
    }
  });
};

// Example data
const exampleClientId = 1;
const exampleQuery: Query = {
  sorts: [{ field: 'name', ascending: true }],
  pagination: { page: 1, pageSize: 10 }
};
const exampleNewClient: Omit<Client, 'id'> = {
  name: 'New Client',
  email: 'newclient@example.com',
  phone: '123-456-7890',
  address: '123 Main St'
};
const exampleUpdatedClient: Client = {
  id: 13,
  name: 'Updated Client',
  email: 'updatedclient@example.com',
  phone: '123-456-7890',
  address: '123 Main St'
};

// Parse command line arguments
const [,, method] = process.argv;

switch (parseInt(method, 10)) {
  case 1:
    readClient(exampleClientId);
    break;
  case 2:
    readClients(exampleQuery);
    break;
  case 3:
    createClient(exampleNewClient);
    break;
  case 4:
    updateClient(exampleUpdatedClient);
    break;
  case 5:
    deleteClient(exampleClientId);
    break;
  default:
    console.error('Unknown method:', method);
    break;
}