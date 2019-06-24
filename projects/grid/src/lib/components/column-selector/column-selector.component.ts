import { Component, Input } from '@angular/core';
import * as R from 'ramda';
import { ColumnConfig } from '@grid/config/column-config';
import { select, Store } from '@ngrx/store';
import { State } from '@grid/store';
import { ToggleColumnVisibility } from '@grid/actions/grid-actions';

@Component({
  selector: 'pcs-column-selector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['column-selector.component.scss']
})
export class ColumnSelectorComponent {
  @Input() headers: Array<string>;
  @Input() columnConfig: ColumnConfig;
  expanded = false;

  constructor(private store: Store<State>) {
  }

  get checkboxDisplay() {
    return this.expanded ? 'block' : 'none';
  }

  toggleColumn(index: number) {
    this.store.dispatch(new ToggleColumnVisibility(index));
  }

  toggleColumns() {
    this.expanded = !this.expanded;
  }
}
