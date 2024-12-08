import fs from 'fs';
import * as grpc from '@grpc/grpc-js';

const clientsFilePath = 'data/client.json';
const clients = JSON.parse(fs.readFileSync(clientsFilePath, 'utf8'));

const getNextId = (items) => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

const clientService = {
  readClient: (call, callback) => {
    const clientId = call.request.id;
    const client = clients.find(c => c.id === clientId);
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
    const newClientData = { ...data, id: getNextId(clients) };
    clients.push(newClientData);
    fs.writeFileSync(clientsFilePath, JSON.stringify(clients, null, 2));
    return callback(null, newClientData);
  },
  updateClient: (call, callback) => {
    const clientInfo = call.request;
    const clientIndex = clients.findIndex(c => c.id === clientInfo.id);
    if (clientIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a client with the specified ID to update"
      });
    }
    const selectedClient = clients[clientIndex];
    const updatedClient = {
      id: selectedClient.id,
      name: clientInfo.name ?? selectedClient.name,
      email: clientInfo.email ?? selectedClient.email,
      phone: clientInfo.phone ?? selectedClient.phone,
      address: clientInfo.address ?? selectedClient.address,
    };
    clients.splice(clientIndex, 1, updatedClient);
    fs.writeFileSync(clientsFilePath, JSON.stringify(clients, null, 2));
    return callback(null, updatedClient);
  },
  deleteClient: (call, callback) => {
    const clientId = call.request.id;
    const updatedClients = clients.filter(c => c.id !== clientId);
    if (clients.length === updatedClients.length) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a client with the specified ID to delete"
      });
    }
    fs.writeFileSync(clientsFilePath, JSON.stringify(updatedClients, null, 2));
    clients.length = 0;
    clients.push(...updatedClients);
    return callback(null, { deleted: true });
  }
};

export { clientService };