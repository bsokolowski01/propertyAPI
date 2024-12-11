// Original file: grpc/proto/property.proto


export interface Filter {
  'field'?: (string);
  'eq'?: (string);
  'neq'?: (string);
  'contains'?: (string);
  'notContains'?: (string);
}

export interface Filter__Output {
  'field': (string);
  'eq': (string);
  'neq': (string);
  'contains': (string);
  'notContains': (string);
}
