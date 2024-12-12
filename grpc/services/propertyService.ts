import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { filter, paginate, sort } from './filters';
import { Property } from '../types/propertyAPI/Property';
import { PropertyId } from '../types/propertyAPI/PropertyId';
import { Properties } from '../types/propertyAPI/Properties';
import { Query } from '../types/propertyAPI/Query';
import { DeletePropertyResponse } from '../types/propertyAPI/DeletePropertyResponse';

const propertiesFilePath = 'data/property.json';
const properties: Property[] = JSON.parse(fs.readFileSync(propertiesFilePath, 'utf8'));

const getNextId = (items: Property[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id).filter(id => id !== undefined)) + 1 : 1;
};

const propertyService = {
  readProperty: (call: grpc.ServerUnaryCall<PropertyId, Property>, callback: grpc.sendUnaryData<Property>): void => {
    const propertyId = call.request.id;
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      callback(null, property);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Property not found"
      });
    }
  },
  readProperties: (call: grpc.ServerUnaryCall<Query, Properties>, callback: grpc.sendUnaryData<Properties>): void => {
    let result = [...properties];

    if (call.request.filters) {
      result = filter(result, call.request.filters);
    }
    if (call.request.sorts) {
      result = sort(result, call.request.sorts);
    }
    if (call.request.pagination) {
      result = paginate(result, call.request.pagination);
    }
    return callback(null, { properties: result });
  },
  createProperty: (call: grpc.ServerUnaryCall<Property, Property>, callback: grpc.sendUnaryData<Property>): void => {
    const data = call.request;
    const newPropertyData: Property = { ...data, id: getNextId(properties) };
    properties.push(newPropertyData);
    fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 2));
    return callback(null, newPropertyData);
  },
  updateProperty: (call: grpc.ServerUnaryCall<Property, Property>, callback: grpc.sendUnaryData<Property>): void => {
    const propertyInfo = call.request;
    const propertyIndex = properties.findIndex(p => p.id === propertyInfo.id);
    if (propertyIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a property with the specified ID to update"
      });
    }
    const selectedProperty = properties[propertyIndex];
    const updatedProperty: Property = {
      id: selectedProperty.id,
      address: propertyInfo.address ?? selectedProperty.address,
      description: propertyInfo.description ?? selectedProperty.description,
      rooms: propertyInfo.rooms ?? selectedProperty.rooms,
      surfaceArea: propertyInfo.surfaceArea ?? selectedProperty.surfaceArea,
      status: propertyInfo.status ?? selectedProperty.status,
      type: propertyInfo.type ?? selectedProperty.type,
      rent: propertyInfo.rent ?? selectedProperty.rent,
      price: propertyInfo.price ?? selectedProperty.price,
      pricePerMeter: propertyInfo.pricePerMeter ?? selectedProperty.pricePerMeter,
    };
    properties.splice(propertyIndex, 1, updatedProperty);
    fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 2));
    return callback(null, updatedProperty);
  },
  deleteProperty: (call: grpc.ServerUnaryCall<PropertyId, DeletePropertyResponse>, callback: grpc.sendUnaryData<DeletePropertyResponse>): void => {
    const propertyId = call.request.id;
    const propertyIndex = properties.findIndex(p => p.id === propertyId);
    if (propertyIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a property with the specified ID to delete"
      });
    }
    properties.splice(propertyIndex, 1);
    fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 2));
    return callback(null, { deleted: true });
  }
};

export { propertyService };