import * as R from 'ramda';

export const calculateNumberOfPages = (dataSize: number, paginationPageSize: number): number => Math.ceil(dataSize / paginationPageSize);

export const sizeOfShownData = (dataSize: number, pageSize: number): number => R.max(dataSize, pageSize);

export const getPagedData = <T>(data: T[], currentPage: number, pageSize: number) => {
  const dataSize = data.length;
  const startIndex = currentPage === 0 ? 0 : (currentPage * pageSize);
  const endIndex = R.min(startIndex + pageSize, dataSize);
  return R.slice(startIndex, endIndex)(data);
};
