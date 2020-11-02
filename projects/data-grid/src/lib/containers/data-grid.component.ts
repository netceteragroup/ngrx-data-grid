import { Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
import {
  changePageNumber,
  changePageSize,
  reorderColumn,
  selectAllPages,
  selectCurrentPage,
  toggleAllRowsSelection,
  toggleColumnVisibility,
  toggleDetailGrid,
  toggleRowSelection,
  updateFilters,
  updateSort,
  resizeColumn
} from '../actions/data-grid-actions';
import { GridConfig } from '../config';
import { GridStoreConfig, NgrxGridConfig } from '../config/grid-store-config';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId, ToggleDetailsGridEvent, ToggleRowSelectionEvent } from '../models';
import {
  getAllPagesSelected,
  getAllSelected,
  getChildren,
  getCurrentPageSelected,
  getGridColumns,
  getGridPagination,
  getGridSelectedRowIndexes,
  getGridViewData,
  getGridViewRowIndexes,
  getHasVisibleGridColumns,
  getNumberOfVisibleItems,
  getTotalNumberOfItems
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

  @Output() openDetails = new EventEmitter<ToggleDetailsGridEvent>();

  gridStore$: Observable<NgRxGridState>;
  viewData$: Observable<object[]>;
  rowDataIndexes$: Observable<number[]>;
  selectedRowIndexes$: Observable<number[]>;
  children$: Observable<string[]>;

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
    this.viewData$ = this.select(getGridViewData);
    this.rowDataIndexes$ = this.select(getGridViewRowIndexes);
    this.selectedRowIndexes$ = this.select(getGridSelectedRowIndexes);
    this.children$ = this.select(getChildren);

    this.pagination$ = this.select(getGridPagination);
    this.columns$ = this.select(getGridColumns);
    this.hasVisibleColumns$ = this.select(getHasVisibleGridColumns);

    this.allSelected$ = this.select(getAllSelected);
    this.allPagesSelected$ = this.select(getAllPagesSelected);
    this.currentPageSelected$ = this.select(getCurrentPageSelected);

    this.totalNumberOfItems$ = this.select(getTotalNumberOfItems);
    this.numberOfVisibleItems$ = this.select(getNumberOfVisibleItems);
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

  onToggleRow(event: ToggleRowSelectionEvent) {
    this.store.dispatch(toggleRowSelection({name: this.gridName, ...event}));
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

  onToggleDetailGrid(event: ToggleDetailsGridEvent) {
    this.store.dispatch(toggleDetailGrid({name: this.gridName, child: event.name, active: event.active}));
    if (!event.active) {
      this.openDetails.emit(event);
    }
  }

  onDropColumn({currentIndex, previousIndex}) {
    this.store.dispatch(reorderColumn({name: this.gridName, currentIndex, previousIndex}));
  }

  onColumnResized({columnId, width}) {
    this.store.dispatch(resizeColumn({name: this.gridName, columnId: columnId, width}));
  }

  private select<T>(selector: MemoizedSelectorWithProps<NgRxGridState, { gridName: string }, T>): Observable<T> {
    return this.gridStore$.pipe(select(selector, {gridName: this.gridName}));
  }

}
