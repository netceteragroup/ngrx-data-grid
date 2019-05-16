import { Observable } from 'rxjs';
import { getColumnsNum, getRowsNum, State } from '@example/reducers';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AddNewColumn, AddNewRow } from '@example/actions/grid-example';

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
  rowsNum$: Observable<number>;
  columnsNum$: Observable<number>;

  constructor(private store: Store<State>) {
    this.rowsNum$ = this.store.pipe(select(getRowsNum));
    this.columnsNum$ = this.store.pipe(select(getColumnsNum));
  }

  onAddNewRow() {
    this.store.dispatch(new AddNewRow());
  }

  onAddNewColumn() {
    this.store.dispatch(new AddNewColumn());
  }
}
