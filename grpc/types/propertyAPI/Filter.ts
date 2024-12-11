// Original file: grpc/proto/property.proto


export interface Filter {
  'field'?: (string);
  'eqString'?: (string);
  'neqString'?: (string);
  'contains'?: (string);
  'notContains'?: (string);
  'eqNumber'?: (number | string);
  'neqNumber'?: (number | string);
  'gt'?: (number | string);
  'lt'?: (number | string);
  'gte'?: (number | string);
  'lte'?: (number | string);
  'eqDate'?: (string);
  'neqDate'?: (string);
  'gtDate'?: (string);
  'ltDate'?: (string);
  'gteDate'?: (string);
  'lteDate'?: (string);
}

export interface Filter__Output {
  'field': (string);
  'eqString': (string);
  'neqString': (string);
  'contains': (string);
  'notContains': (string);
  'eqNumber': (number);
  'neqNumber': (number);
  'gt': (number);
  'lt': (number);
  'gte': (number);
  'lte': (number);
  'eqDate': (string);
  'neqDate': (string);
  'gtDate': (string);
  'ltDate': (string);
  'gteDate': (string);
  'lteDate': (string);
}
