import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ColumnConfig, GridConfig } from '../config';
import { changePageNumber, changePageSize, initGrid, toggleAllRowsSelection, toggleColumnVisibility, toggleRowSelection, updateFilters, updateSort } from '../actions/data-grid-actions';
import { getGridColumns, getGridDataRowsIndexes, getGridPagination, getGridSelectedRowIndexes, getGridViewData } from '../store';
import { hasValue, mapIndexed } from '../util/type';
import { DataGridColumn, GridDataFilterWithColumnId, GridDataSortWithColumnId } from '../models';

@Component({
  selector: 'ngrx-data-grid',
  templateUrl: 'data-grid.component.html'
})
export class DataGridComponent implements OnInit {
  @Input() gridName = 'grid-1';

  @Input() data: any[];
  @Input() columnConfig: ColumnConfig[];
  @Input() config: GridConfig;

  // TODO VV: remove it with column config refactoring
  selection = {checkboxSelection: true, selectedRowsIds: []};

  viewData$: Observable<object[]>;
  rowDataIndexes$: Observable<number[]>;
  selectedRowIndexes$: Observable<any>;

  pagination$: Observable<any>;
  columns$: Observable<DataGridColumn[]>;

  constructor(private store: Store<any>) {
    this.viewData$ = this.store.pipe(select(getGridViewData, {gridName: this.gridName}));
    this.rowDataIndexes$ = this.store.pipe(select(getGridDataRowsIndexes, {gridName: this.gridName}));
    this.selectedRowIndexes$ = this.store.pipe(select(getGridSelectedRowIndexes, {gridName: this.gridName}));

    this.pagination$ = this.store.pipe(select(getGridPagination, {gridName: this.gridName}));
    this.columns$ = this.store.pipe(select(getGridColumns, {gridName: this.gridName}));
  }

  ngOnInit(): void {
    // TODO VV: move init action outside of this component
    this.store.dispatch(initGrid({name: 'grid-1', data: this.data, columns: this.prepareGridColumns(), paginationPageSize: 5}));
  }

  changePageSize(pageSize: number) {
    this.store.dispatch(changePageSize({name: this.gridName, pageSize}));
  }

  changePageNum(pageNumber: number) {
    this.store.dispatch(changePageNumber({name: this.gridName, pageNumber}));
  }

  onSortGrid({sortType, columnId}: GridDataSortWithColumnId) {
    this.store.dispatch(updateSort({name: this.gridName, columnId, sortType}));
  }

  onFilterGrid({condition, columnId}: GridDataFilterWithColumnId) {
    this.store.dispatch(updateFilters({name: this.gridName, columnId, condition}));
  }

  toggleColumn(columnId: string) {
    this.store.dispatch(toggleColumnVisibility({name: this.gridName, columnId}));
  }

  onToggleRow(dataItem) {
    this.store.dispatch(toggleRowSelection({name: this.gridName, dataItem}));
  }

  onToggleAllRows(selectionStatus: boolean) {
    this.store.dispatch(toggleAllRowsSelection({name: this.gridName, selectionStatus}));
  }

  prepareGridColumns(): any {
    return mapIndexed((columnConfig: ColumnConfig, idx: number) => {
      const {field, headerName, isVisible: visible, sortable: sortAvailable, filter, valueGetter} = columnConfig;
      const columnId = `${field}-${idx}`;

      return {columnId, headerName, field, visible, sortAvailable, filterAvailable: hasValue(filter), filter: hasValue(filter) ? {filterType: filter.type} : null, valueGetter};
    })(this.columnConfig);
  }

}
