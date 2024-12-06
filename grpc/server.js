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

const clients = readJSONFile(clientsFilePath);

server.addService(proto.propertyAPI.ClientService.service, {
  readClient: (call, callback) => {
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
  readClients: (call, callback) => {
    return callback(null, { clients });
  },
  createClient: (call, callback) => {
    const data = call.request;

    const newClientData = { ...data, id: clients.length + 1 };

    products.push(newClientData);

    return callback(null, newClientData)
  },
  updateClient: (call, callback) => {
    const clientInfo = call.request;

    const clientIndex = clients.findIndex(c => c.id === clientInfo.id);

    if (!clientIndex) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a client to update"
      });
    }

    const selectedClient = clients[clientIndex];

    const updatedClient = {
      id: selectedClient.id,
      name: clientInfo.name ?? selectedClient.name,
      email: clientInfo.email ?? selectedClient.email,
      phone: clientInfo.phone ?? selectedClient.phone,
      address: clientInfo.address ?? selectedClient.address,
    }

    clients.splice(clientIndex, 1, updatedClient);

    return callback(null, updatedClient);
  },
  deleteClient: (call, callback) => {
    const clientId = call.request.id;
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if(!clientIndex){
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a client with the specified ID to delete"
      });
    }
  
    clients.splice(clientIndex, 1);
  
    return callback(null, { deleted: true });
  }
})

server.bindAsync("127.0.0.1:9292", grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server (gRPC) started on port ${port}`);
});