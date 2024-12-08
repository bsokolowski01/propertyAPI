import fs from 'fs';
import * as grpc from '@grpc/grpc-js';

const propertiesFilePath = 'data/property.json';
const properties = JSON.parse(fs.readFileSync(propertiesFilePath, 'utf8'));

const getNextId = (items) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  };

const propertyService = {
  readProperty: (call, callback) => {
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
  readProperties: (call, callback) => {
    return callback(null, { properties });
  },
  createProperty: (call, callback) => {
    const data = call.request;
    const newPropertyData = { ...data, id: getNextId(properties) };
    properties.push(newPropertyData);
    fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 2));
    return callback(null, newPropertyData);
  },
  updateProperty: (call, callback) => {
    const propertyInfo = call.request;
    const propertyIndex = properties.findIndex(p => p.id === propertyInfo.id);
    if (propertyIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a property with the specified ID to update"
      });
    }
    const selectedProperty = properties[propertyIndex];
    const updatedProperty = {
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
  deleteProperty: (call, callback) => {
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