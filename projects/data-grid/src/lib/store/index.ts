import { createSelector } from '@ngrx/store';
import * as R from 'ramda';
import * as fromDataGrid from './data-grid';
import { getPagedData } from './pagination-util';
import { hasValue } from '../util/type';
import { getNumberOfVisibleColumns } from '../util/grid-columns';

export const getGridByName = (state: fromDataGrid.NgRxGridState, props: {gridName: string}) => R.prop(props.gridName)(state);

export const getGridDataRowsIndexes = createSelector(
  getGridByName,
  fromDataGrid.getRowDataIndexes
);

export const getGridSelectedRowIndexes = createSelector(
  getGridByName,
  fromDataGrid.getSelectedRowIndexes
);

export const getGridColumns = createSelector(
  getGridByName,
  fromDataGrid.getColumns
);

export const getGridPagination = createSelector(
  getGridByName,
  fromDataGrid.getPagination
);

export const getHasVisibleGridColumns = createSelector(
  getGridColumns,
  (columns) => getNumberOfVisibleColumns(columns) > 0
);

export const getGridData = createSelector(
  getGridByName,
  fromDataGrid.getData
);

export const getSelectedData = createSelector(
  getGridSelectedRowIndexes,
  getGridData,
  (selectedRowIndexes, data) =>
    R.values(R.pickAll(selectedRowIndexes, data))
);

const sortedAndFilteredData: any = R.compose(R.map(fromDataGrid.getDataItem), R.filter(hasValue));

export const getGridViewData = createSelector(
  getGridData,
  getGridDataRowsIndexes,
  getGridPagination,
  (data, rowDataIndexes, {paginationPageSize, currentPage}) => {
    const dataWithIndexes = fromDataGrid.dataItemsWithIndexes(data);

    const viewData = R.map(
      idx => R.find(R.compose(R.equals(idx), fromDataGrid.getDataItemIndex), dataWithIndexes),
      rowDataIndexes
    );

    return getPagedData(sortedAndFilteredData(viewData), currentPage, paginationPageSize);
  }
);
