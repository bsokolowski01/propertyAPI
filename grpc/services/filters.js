export const filter = (records, filters) => {
    return records.filter(record => {
      return filters.every(filter => {
        return record[filter.field] === filter.value;
      });
    });
  }
  
export const sort = (records, sorts) => {
    return records.sort((a, b) => {
      for (const sort of sorts) {
        if (a[sort.field] < b[sort.field]) return sort.ascending ? -1 : 1;
        if (a[sort.field] > b[sort.field]) return sort.ascending ? 1 : -1;
      }
      return 0;
    });
  }
  
export const paginate = (records, pagination) => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return records.slice(start, end);
  }