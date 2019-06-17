import { Observable } from 'rxjs';
import { getColumnConfig, getGridConfig, getGridData, State } from '@grid/store';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SortGrid } from '@grid/actions/grid-actions';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

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

  constructor(private store: Store<State>) {
    this.columnConfig$ = this.store.pipe(select(getColumnConfig));
    this.data$ = this.store.pipe(select(getGridData));
    this.config$ = this.store.pipe(select(getGridConfig));
  }

  onSortGrid(header: any) {
    this.store.dispatch(new SortGrid(header));
  }

}
