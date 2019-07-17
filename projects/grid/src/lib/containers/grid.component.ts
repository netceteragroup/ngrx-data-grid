import { Observable } from 'rxjs';
import { getColumnConfig, getNumberOfRows, getPagedData, getPaginationConfig, getSelectionConfig, State } from '@grid/store';
import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig, PaginationConfig, SelectionConfig } from '@grid/config/grid-config';
import {
  changePageNumber,
  changePageSize,
  filterGrid,
  initGrid,
  sortGrid,
  toggleAllRowsSelection,
  toggleColumnVisibility,
  toggleRowSelection
} from '@grid/actions/grid-actions';

/**
 * Container component.
 * All store-related logic is here.
 */
@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent implements OnInit {
  @Input() data: Array<object>;
  @Input() columnConfig: ColumnConfig[];
  @Input() config: GridConfig;
  columnConfig$: Observable<ColumnConfig[]>;
  selection$: Observable<SelectionConfig>;
  pagination$: Observable<PaginationConfig>;
  pagedData$: Observable<Array<object>>;
  numberOfRows$: Observable<number>;

  constructor(private store: Store<State>) {
    this.columnConfig$ = this.store.pipe(select(getColumnConfig));
    this.selection$ = this.store.pipe(select(getSelectionConfig));
    this.pagination$ = this.store.pipe(select(getPaginationConfig));
    this.pagedData$ = this.store.pipe(select(getPagedData));
    this.numberOfRows$ = this.store.pipe(select(getNumberOfRows));
  }

  ngOnInit(): void {
    this.store.dispatch(initGrid({initialData: this.data, columnConfig: this.columnConfig, gridConfig: this.config}));
  }

  changePageSize(pageSize: number) {
    this.store.dispatch(changePageSize({pageSize}));
  }

  changePageNum(pageNumber: number) {
    this.store.dispatch(changePageNumber({pageNumber}));
  }

  onSortGrid(configItem: ColumnConfig) {
    this.store.dispatch(sortGrid(configItem));
  }

  toggleColumn(columnConfigIndex: number) {
    this.store.dispatch(toggleColumnVisibility({columnConfigIndex}));
  }

  onToggleRow(index: number) {
    this.store.dispatch(toggleRowSelection({rowId: index}));
  }

  onToggleSelectAllRows() {
    this.store.dispatch(toggleAllRowsSelection());
  }

  changeFilterInConfig(configItem: ColumnConfig) {
    this.store.dispatch(filterGrid(configItem));
  }

}
