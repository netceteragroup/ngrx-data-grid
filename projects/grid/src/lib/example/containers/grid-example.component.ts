import { Observable } from 'rxjs';
import { getColumnsNum, getRowsNum, State } from '@example/reducers';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AddNewColumn, AddNewRow } from '@example/actions/grid-example';


/**
 * Container component.
 * All store-related logic is here.
 */
@Component({
  selector: 'pcs-grid-example',
  template: `
    <pcs-display-grid-example [rowsNum]="rowsNum$ | async"
                              [columnsNum]="columnsNum$ | async"
                              (newRowAdded)="onAddNewRow()"
                              (newColumnAdded)="onAddNewColumn()">
    </pcs-display-grid-example>`
})
export class GridExampleComponent {
  // all observable properties have a $ at the end by convention
  rowsNum$: Observable<number>;
  columnsNum$: Observable<number>;

  constructor(private store: Store<State>) {
    // fields from store are selected in container components
    this.rowsNum$ = this.store.pipe(select(getRowsNum));
    this.columnsNum$ = this.store.pipe(select(getColumnsNum));
  }

  onAddNewRow() {
    // all actions are dispatched in container components
    this.store.dispatch(new AddNewRow());
  }

  onAddNewColumn() {
    this.store.dispatch(new AddNewColumn());
  }
}
