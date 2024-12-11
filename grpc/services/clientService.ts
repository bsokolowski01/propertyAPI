import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { filter, paginate, sort } from './filters';
import { Client } from '../types/propertyAPI/Client';
import { ClientId } from '../types/propertyAPI/ClientId';
import { Clients } from '../types/propertyAPI/Clients';
import { Query } from '../types/propertyAPI/Query';
import { DeleteClientResponse } from '../types/propertyAPI/DeleteClientResponse';

const clientsFilePath = 'data/client.json';
const clients: Client[] = JSON.parse(fs.readFileSync(clientsFilePath, 'utf8'));

const getNextId = (items: Client[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id).filter(id => id !== undefined)) + 1 : 1;
};

const clientService = {
  readClient: (call: grpc.ServerUnaryCall<ClientId, Client>, callback: grpc.sendUnaryData<Client>): void => {
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
  readClients: (call: grpc.ServerUnaryCall<Query, Clients>, callback: grpc.sendUnaryData<Clients>): void => {
    let result = [...clients];

    if (call.request.filters) {
      result = filter(result, call.request.filters);
    }
    if (call.request.sorts) {
      result = sort(result, call.request.sorts);
    }
    if (call.request.pagination) {
      result = paginate(result, call.request.pagination);
    }

    return callback(null, { clients: result });
  },
  createClient: (call: grpc.ServerUnaryCall<Client, Client>, callback: grpc.sendUnaryData<Client>): void => {
    const data = call.request;
    const newClientData: Client = { ...data, id: getNextId(clients) };
    clients.push(newClientData);
    fs.writeFileSync(clientsFilePath, JSON.stringify(clients, null, 2));
    return callback(null, newClientData);
  },
  updateClient: (call: grpc.ServerUnaryCall<Client, Client>, callback: grpc.sendUnaryData<Client>): void => {
    const clientInfo = call.request;
    const clientIndex = clients.findIndex(c => c.id === clientInfo.id);
    if (clientIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a client with the specified ID to update"
      });
    }
    const selectedClient = clients[clientIndex];
    const updatedClient: Client = {
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
  deleteClient: (call: grpc.ServerUnaryCall<ClientId, DeleteClientResponse>, callback: grpc.sendUnaryData<DeleteClientResponse>): void => {
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