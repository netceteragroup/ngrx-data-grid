import { Observable } from 'rxjs';
import { getColumnConfig, getGridConfig, getPagedData, getPaginationConfig, State } from '@grid/store';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig, PaginationConfig } from '@grid/config/grid-config';
import { ChangePageNumber, ChangePageSize } from '@grid/actions/grid-actions';

/**
 * Container component.
 * All store-related logic is here.
 */
@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent {
  columnConfig$: Observable<ColumnConfig[]>;
  config$: Observable<GridConfig>;
  pagination$: Observable<PaginationConfig>;
  pagedData$: Observable<Array<object>>;

  constructor(private store: Store<State>) {
    this.columnConfig$ = this.store.pipe(select(getColumnConfig));
    this.config$ = this.store.pipe(select(getGridConfig));
    this.pagination$ = this.store.pipe(select(getPaginationConfig));
    this.pagedData$ = this.store.pipe(select(getPagedData));
  }

  changePageSize(pageSize: number) {
    this.store.dispatch(new ChangePageSize(pageSize));
  }

  changePageNum(pageNum: number) {
    this.store.dispatch(new ChangePageNumber(pageNum));
  }

}
