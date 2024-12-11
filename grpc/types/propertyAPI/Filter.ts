// Original file: grpc/proto/property.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';

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
  'eqDate'?: (_google_protobuf_Timestamp | null);
  'neqDate'?: (_google_protobuf_Timestamp | null);
  'gtDate'?: (_google_protobuf_Timestamp | null);
  'ltDate'?: (_google_protobuf_Timestamp | null);
  'gteDate'?: (_google_protobuf_Timestamp | null);
  'lteDate'?: (_google_protobuf_Timestamp | null);
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
  'eqDate': (_google_protobuf_Timestamp__Output | null);
  'neqDate': (_google_protobuf_Timestamp__Output | null);
  'gtDate': (_google_protobuf_Timestamp__Output | null);
  'ltDate': (_google_protobuf_Timestamp__Output | null);
  'gteDate': (_google_protobuf_Timestamp__Output | null);
  'lteDate': (_google_protobuf_Timestamp__Output | null);
}
