import { GridConfig, PaginationConfig } from '@grid/config/grid-config';
import { GridState } from '@grid/store/grid-reducer';
import { ColumnConfig } from '@grid/config/column-config';
import * as R from 'ramda';

export const mergeIntoGridConfig = (gridConfig: GridConfig, pagination: { pagination: PaginationConfig }): GridConfig => <GridConfig>R.mergeDeepRight(gridConfig, pagination);

export const calculatePaginationPageSize = (pagination: PaginationConfig, paginationPageSize: number): PaginationConfig => {
  return R.mergeDeepRight(pagination, {
    paginationPageSize: paginationPageSize
  });
};

export const calculateCurrentPage = (pagination: PaginationConfig, paginationCurrentPage: number): PaginationConfig => R.mergeDeepRight(pagination, {
  currentPage: paginationCurrentPage
});

export const changePagedData = (state: GridState): GridState => R.mergeDeepRight(state, {
  pagedData: <any>R.slice(
    state.gridConfig.pagination.currentPage * state.gridConfig.pagination.paginationPageSize,
    (state.gridConfig.pagination.currentPage + 1) * state.gridConfig.pagination.paginationPageSize,
    state.gridData)
});

export const calculateNumberOfPages = (state: GridState): GridState => <GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: R.mergeDeepRight(state.gridConfig.pagination, {
      numberOfPages: Math.ceil(state.gridData.length / state.gridConfig.pagination.paginationPageSize)
    })
  })
});

type CalculatePagedDataAndNumberOfPages = (state: GridState) => GridState;
export const calculatePagedDataAndNumberOfPages: CalculatePagedDataAndNumberOfPages = R.compose(
  calculateNumberOfPages,
  changePagedData
);

export const updateColumnConfig = (state: GridState, singleConfig: ColumnConfig): ColumnConfig[] => {
  const columnIndex = R.findIndex((config: ColumnConfig) => config.headerName === singleConfig.headerName, state.columnConfig);
  return R.update(columnIndex, singleConfig, state.columnConfig);
};
