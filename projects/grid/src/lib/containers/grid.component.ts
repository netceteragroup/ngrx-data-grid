import { Observable } from 'rxjs';
import { getColumnConfig, getNumberOfRows, getPagedData, getPaginationConfig, getSelectionConfig, State } from '@grid/store';
import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig, PaginationConfig, SelectionConfig } from '@grid/config/grid-config';
import { ChangePageNumber, ChangePageSize, FilterGrid, InitGrid, SortGrid, ToggleColumnVisibility, ToggleRowSelection, ToggleSelectAllRows } from '@grid/actions/grid-actions';

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
    this.store.dispatch(new InitGrid({initialData: this.data, columnConfig: this.columnConfig, gridConfig: this.config}));
  }

  changePageSize(pageSize: number) {
    this.store.dispatch(new ChangePageSize(pageSize));
  }

  changePageNum(pageNum: number) {
    this.store.dispatch(new ChangePageNumber(pageNum));
  }

  onSortGrid(configItem: ColumnConfig) {
    this.store.dispatch(new SortGrid(configItem));
  }

  toggleColumn(index: number) {
    this.store.dispatch(new ToggleColumnVisibility(index));
  }

  onToggleRow(index: number) {
    this.store.dispatch(new ToggleRowSelection(index));
  }

  onToggleSelectAllRows() {
    this.store.dispatch(new ToggleSelectAllRows());
  }

  changeFilterInConfig(configItem: ColumnConfig) {
    this.store.dispatch(new FilterGrid(configItem));
  }

}
