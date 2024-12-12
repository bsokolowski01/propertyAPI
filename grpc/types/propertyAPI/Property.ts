// Original file: grpc/proto/property.proto


export interface Property {
  'id'?: (number);
  'address'?: (string);
  'description'?: (string);
  'rooms'?: (number);
  'surfaceArea'?: (string);
  'status'?: (string);
  'type'?: (string);
  'rent'?: (string);
  'price'?: (string);
  'pricePerMeter'?: (string);
  '_rent'?: "rent";
  '_price'?: "price";
  '_pricePerMeter'?: "pricePerMeter";
}

export interface Property__Output {
  'id': (number);
  'address': (string);
  'description': (string);
  'rooms': (number);
  'surfaceArea': (string);
  'status': (string);
  'type': (string);
  'rent'?: (string);
  'price'?: (string);
  'pricePerMeter'?: (string);
  '_rent': "rent";
  '_price': "price";
  '_pricePerMeter': "pricePerMeter";
}
