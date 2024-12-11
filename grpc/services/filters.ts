import { Filter } from '../types/propertyAPI/Filter';
import { Sort } from '../types/propertyAPI/Sort';
import { Pagination } from '../types/propertyAPI/Pagination';

type FilterFunction<T> = (value: T, filterValue: string) => boolean;

const stringFilters: Record<string, FilterFunction<string>> = {
  eq_string: (value, filterValue) => value === filterValue,
  neq_string: (value, filterValue) => value !== filterValue,
  contains: (value, filterValue) => value.includes(filterValue),
  notContains: (value, filterValue) => !value.includes(filterValue),
};

const numberFilters: Record<string, FilterFunction<number>> = {
  eq_number: (value, filterValue) => value === Number(filterValue),
  neq_number: (value, filterValue) => value !== Number(filterValue),
  gt: (value, filterValue) => value > Number(filterValue),
  lt: (value, filterValue) => value < Number(filterValue),
  gte: (value, filterValue) => value >= Number(filterValue),
  lte: (value, filterValue) => value <= Number(filterValue),
};

const dateFilters: Record<string, FilterFunction<Date>> = {
  eq_date: (value, filterValue) => value.getTime() === new Date(filterValue).getTime(),
  neq_date: (value, filterValue) => value.getTime() !== new Date(filterValue).getTime(),
  gt_date: (value, filterValue) => value.getTime() > new Date(filterValue).getTime(),
  lt_date: (value, filterValue) => value.getTime() < new Date(filterValue).getTime(),
  gte_date: (value, filterValue) => value.getTime() >= new Date(filterValue).getTime(),
  lte_date: (value, filterValue) => value.getTime() <= new Date(filterValue).getTime(),
};

export const filter = <T>(records: T[], filters: Filter[]): T[] => {
  return records.filter(record => {
    return filters.every(filter => {
      const value = record[filter.field as keyof T];
      if (typeof value === 'string') {
        return Object.entries(stringFilters).every(([key, fn]) => !filter[key as keyof Filter] || fn(value, filter[key as keyof Filter] as string));
      } else if (typeof value === 'number') {
        return Object.entries(numberFilters).every(([key, fn]) => !filter[key as keyof Filter] || fn(value, filter[key as keyof Filter] as string));
      } else if (value instanceof Date) {
        return Object.entries(dateFilters).every(([key, fn]) => !filter[key as keyof Filter] || fn(value, filter[key as keyof Filter] as string));
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