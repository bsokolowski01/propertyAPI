import { Filter } from '../types/propertyAPI/Filter';
import { Sort } from '../types/propertyAPI/Sort';
import { Pagination } from '../types/propertyAPI/Pagination';

export const filter = <T>(records: T[], filters: Filter[]): T[] => {
  return records.filter(record => {
    return filters.every(filter => {
      const value = record[filter.field as keyof T];
      if (filter.eq) {
        return value === filter.eq;
      } else if (filter.neq) {
        return value !== filter.neq;
      } else if (filter.contains) {
        return typeof value === 'string' && value.includes(filter.contains);
      } else if (filter.notContains) {
        return typeof value === 'string' && !value.includes(filter.notContains);
      } else {
        return false;
      }
    });
  });
};

export const sort = <T>(records: T[], sorts: Sort[]): T[] => {
  return records.sort((a, b) => {
    for (const sort of sorts) {
      const field = sort.field as keyof T;
      if (a[field] < b[field]) return sort.ascending ? -1 : 1;
      if (a[field] > b[field]) return sort.ascending ? 1 : -1;
    }
    return 0;
  });
};

export const paginate = <T>(records: T[], pagination: Pagination): T[] => {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return records.slice(start, end);
};