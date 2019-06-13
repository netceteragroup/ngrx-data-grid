import { Observable } from 'rxjs';
import { getColumnConfig, getGridConfig, getGridData, getPaginationConfig, State } from '@grid/store';
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
  data$: Observable<Object[]>;
  config$: Observable<GridConfig>;
  pagination$: Observable<PaginationConfig>;

  constructor(private store: Store<State>) {
    this.columnConfig$ = this.store.pipe(select(getColumnConfig));
    this.data$ = this.store.pipe(select(getGridData));
    this.config$ = this.store.pipe(select(getGridConfig));
    this.pagination$ = this.store.pipe(select(getPaginationConfig));
  }

  changePageSize(pageSize: number) {
    this.changePageNum(0);
    this.store.dispatch(new ChangePageSize(pageSize));
  }

  changePageNum(pageNum: number) {
    this.store.dispatch(new ChangePageNumber(pageNum));
  }

}
