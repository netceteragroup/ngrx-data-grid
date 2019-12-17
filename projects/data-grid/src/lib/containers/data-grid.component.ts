import { Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  changePageNumber,
  changePageSize,
  selectAllPages,
  selectCurrentPage,
  toggleAllRowsSelection,
  toggleColumnVisibility,
  toggleRowSelection,
  updateFilters,
  updateSort
} from '../actions/data-grid-actions';
import { GridConfig } from '../config';
import { GridStoreConfig, NgrxGridConfig } from '../config/grid-store-config';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId } from '../models';
import {
  getAllPagesSelected,
  getAllSelected,
  getCurrentPageSelected,
  getGridColumns,
  getGridPagination,
  getGridSelectedRowIndexes,
  getGridViewData,
  getGridViewRowIndexes,
  getHasVisibleGridColumns,
  getTotalNumberOfItems,
  getNumberOfVisibleItems
} from '../store';
import { NgRxGridState } from '../store/data-grid';
import { hasValue } from '../util/type';

@Component({
  selector: 'ngrx-data-grid',
  templateUrl: 'data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit {
  @Input() gridName: string;
  @Input() config: GridConfig;

  gridStore$: Observable<NgRxGridState>;
  viewData$: Observable<object[]>;
  rowDataIndexes$: Observable<number[]>;
  selectedRowIndexes$: Observable<number[]>;

  pagination$: Observable<any>;
  columns$: Observable<DataGridColumnWithId[]>;
  hasVisibleColumns$: Observable<boolean>;
  allSelected$: Observable<boolean>;
  allPagesSelected$: Observable<boolean>;
  currentPageSelected$: Observable<boolean>;
  totalNumberOfItems$: Observable<number>;
  numberOfVisibleItems$: Observable<number>;

  constructor(
    @Inject(GridStoreConfig) private gridStoreConfig: NgrxGridConfig,
    private store: Store<any>
  ) {
    this.gridStore$ = this.store.pipe(select(this.gridStoreConfig.stateKey), filter(hasValue), distinctUntilChanged());
  }

  ngOnInit(): void {
    this.viewData$ = this.gridStore$.pipe(select(getGridViewData, {gridName: this.gridName}));
    this.rowDataIndexes$ = this.gridStore$.pipe(select(getGridViewRowIndexes, {gridName: this.gridName}));
    this.selectedRowIndexes$ = this.gridStore$.pipe(select(getGridSelectedRowIndexes, {gridName: this.gridName}));

    this.pagination$ = this.gridStore$.pipe(select(getGridPagination, {gridName: this.gridName}));
    this.columns$ = this.gridStore$.pipe(select(getGridColumns, {gridName: this.gridName}));
    this.hasVisibleColumns$ = this.gridStore$.pipe(select(getHasVisibleGridColumns, {gridName: this.gridName}));

    this.allSelected$ = this.gridStore$.pipe(select(getAllSelected, {gridName: this.gridName}));
    this.allPagesSelected$ = this.gridStore$.pipe(select(getAllPagesSelected, {gridName: this.gridName}));
    this.currentPageSelected$ = this.gridStore$.pipe(select(getCurrentPageSelected, {gridName: this.gridName}));

    this.totalNumberOfItems$ = this.gridStore$.pipe(select(getTotalNumberOfItems, {gridName: this.gridName}));
    this.numberOfVisibleItems$ = this.gridStore$.pipe(select(getNumberOfVisibleItems, {gridName: this.gridName}));
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

  onFilterGrid(event: ApplyFilterEvent) {
    this.store.dispatch(updateFilters({name: this.gridName, ...event}));
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

  onAllPagesSelected() {
    this.store.dispatch(selectAllPages({name: this.gridName}));
  }

  onCurrentPageSelected() {
    this.store.dispatch(selectCurrentPage({name: this.gridName}));
  }

}
