import { Observable } from 'rxjs';
import { getColumnConfig, getGridData, getGridConfig, State } from '@grid/store';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig, GridConfigBuilder } from '@grid/config/grid-config';

/**
 * Container component.
 * All store-related logic is here.
 */
@Component({
  selector: 'pcs-grid-container',
  templateUrl: 'grid-container.component.html'
})
export class GridContainerComponent {
  columnConfig$: Observable<ColumnConfig[]>;
  data$: Observable<Object[]>;
  config$: Observable<GridConfig>;

  constructor(private store: Store<State>) {
    this.columnConfig$ = this.store.pipe(select(getColumnConfig));
    this.data$ = this.store.pipe(select(getGridData));
    this.config$ = this.store.pipe(select(getGridConfig));
  }

}
