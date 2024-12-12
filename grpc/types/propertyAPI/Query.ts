// Original file: grpc/proto/property.proto

import type { Filter as _propertyAPI_Filter, Filter__Output as _propertyAPI_Filter__Output } from '../propertyAPI/Filter';
import type { Sort as _propertyAPI_Sort, Sort__Output as _propertyAPI_Sort__Output } from '../propertyAPI/Sort';
import type { Pagination as _propertyAPI_Pagination, Pagination__Output as _propertyAPI_Pagination__Output } from '../propertyAPI/Pagination';

export interface Query {
  'filters'?: (_propertyAPI_Filter)[];
  'sorts'?: (_propertyAPI_Sort)[];
  'pagination'?: (_propertyAPI_Pagination | null);
}

export interface Query__Output {
  'filters': (_propertyAPI_Filter__Output)[];
  'sorts': (_propertyAPI_Sort__Output)[];
  'pagination': (_propertyAPI_Pagination__Output | null);
}
