import { Observable } from 'rxjs';
import { Component, Inject, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { GridConfig } from '../config';
import { changePageNumber, changePageSize, toggleAllRowsSelection, toggleColumnVisibility, toggleRowSelection, updateFilters, updateSort } from '../actions/data-grid-actions';
import { getGridColumns, getGridDataRowsIndexes, getGridPagination, getGridSelectedRowIndexes, getGridViewData } from '../store';
import { DataGridColumnWithId, GridDataFilterWithColumnId, GridDataSortWithColumnId } from '../models';
import { NgrxGridConfig, GridStoreConfig } from '../config';
import { distinctUntilChanged } from 'rxjs/operators';
import { NgRxGridState } from '../store/data-grid';

@Component({
  selector: 'ngrx-data-grid',
  templateUrl: 'data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent {
  @Input() gridName = 'grid-1';

  @Input() config: GridConfig;

  gridStore$: Observable<NgRxGridState>;
  viewData$: Observable<object[]>;
  rowDataIndexes$: Observable<number[]>;
  selectedRowIndexes$: Observable<any>;

  pagination$: Observable<any>;
  columns$: Observable<DataGridColumnWithId[]>;

  constructor(
    @Inject(GridStoreConfig) private gridStoreConfig: NgrxGridConfig,
    private store: Store<any>
  ) {
    this.gridStore$ = this.store.pipe(select(this.gridStoreConfig.stateKey), distinctUntilChanged());

    this.viewData$ = this.gridStore$.pipe(select(getGridViewData, {gridName: this.gridName}));
    this.rowDataIndexes$ = this.gridStore$.pipe(select(getGridDataRowsIndexes, {gridName: this.gridName}));
    this.selectedRowIndexes$ = this.gridStore$.pipe(select(getGridSelectedRowIndexes, {gridName: this.gridName}));

    this.pagination$ = this.gridStore$.pipe(select(getGridPagination, {gridName: this.gridName}));
    this.columns$ = this.gridStore$.pipe(select(getGridColumns, {gridName: this.gridName}));
  }

  onChangePageSize(pageSize: number) {
    this.store.dispatch(changePageSize({name: this.gridName, pageSize}));
  }

  onChangePageNumber(pageNumber: number) {
    this.store.dispatch(changePageNumber({name: this.gridName, pageNumber}));
  }

  onSortGrid({sortType, columnId}: GridDataSortWithColumnId) {
    this.store.dispatch(updateSort({name: this.gridName, columnId, sortType}));
  }

  onFilterGrid({condition, columnId}: GridDataFilterWithColumnId) {
    this.store.dispatch(updateFilters({name: this.gridName, columnId, condition}));
  }

  onToggleColumn(columnId: string) {
    this.store.dispatch(toggleColumnVisibility({name: this.gridName, columnId}));
  }

  onToggleRow(dataItem) {
    this.store.dispatch(toggleRowSelection({name: this.gridName, dataItem}));
  }

  onToggleAllRows(selectionStatus: boolean) {
    this.store.dispatch(toggleAllRowsSelection({name: this.gridName, selectionStatus}));
  }

}
