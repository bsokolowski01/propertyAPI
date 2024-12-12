import { Filter } from '../types/propertyAPI/Filter';
import { Sort } from '../types/propertyAPI/Sort';
import { Pagination } from '../types/propertyAPI/Pagination';

type FilterFunction<T> = (value: T, filterValue: string) => boolean;

const stringFilters: Record<string, FilterFunction<string>> = {
  eq: (value, filterValue) => value === filterValue,
  neq: (value, filterValue) => value !== filterValue,
  contains: (value, filterValue) => value.includes(filterValue),
  notContains: (value, filterValue) => !value.includes(filterValue),
};

const numberFilters: Record<string, FilterFunction<number>> = {
  eq: (value, filterValue) => value === Number(filterValue),
  neq: (value, filterValue) => value !== Number(filterValue),
  gt: (value, filterValue) => value > Number(filterValue),
  lt: (value, filterValue) => value < Number(filterValue),
  gte: (value, filterValue) => value >= Number(filterValue),
  lte: (value, filterValue) => value <= Number(filterValue),
};

const dateFilters: Record<string, FilterFunction<Date>> = {
  eq: (value, filterValue) => value.getTime() === new Date(filterValue).getTime(),
  neq: (value, filterValue) => value.getTime() !== new Date(filterValue).getTime(),
  gt: (value, filterValue) => value.getTime() > new Date(filterValue).getTime(),
  lt: (value, filterValue) => value.getTime() < new Date(filterValue).getTime(),
  gte: (value, filterValue) => value.getTime() >= new Date(filterValue).getTime(),
  lte: (value, filterValue) => value.getTime() <= new Date(filterValue).getTime(),
};

const getNestedValue = <T>(obj: T, path: string): unknown => {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value && typeof value === 'object' && key in value) {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

export const filter = <T>(records: T[], filters: Filter[]): T[] => {
  return records.filter(record => {
    return filters.every(filter => {
      const value = filter.field ? getNestedValue(record, filter.field) : undefined; // Pobierz zagnieżdżoną wartość
      console.log()
      const operator = filter.operator;
      const filterValue = filter.value;

      if (operator && filterValue !== undefined) {
        if (typeof value === 'string' && stringFilters[operator]) {
          return stringFilters[operator](value, filterValue);
        } else if (typeof value === 'number' && numberFilters[operator]) {
          return numberFilters[operator](value, filterValue);
        } else if (value instanceof Date && dateFilters[operator]) {
          return dateFilters[operator](value, filterValue);
        }
      }

      return false;
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