import { Component, ComponentFactory, EventEmitter, Input, Output } from '@angular/core';
import * as R from 'ramda';
import { columnValueResolver, DataGridColumnWithId } from '../../models';

@Component({
  selector: 'ngrx-grid-row',
  templateUrl: 'grid-row.component.html',
  styleUrls: ['./grid-row.component.scss']
})
export class GridRowComponent {
  @Input() data: any;
  @Input() columns: DataGridColumnWithId[];
  @Input() componentFactories: ComponentFactory<any>[];
  @Input() isSelected: boolean;
  @Output() toggleRow = new EventEmitter;

  trackByIndex(_, index) {
    return index;
  }

  getColumnData(column: DataGridColumnWithId) {
    return columnValueResolver(column)(this.data);
  }

  getComponent(config: DataGridColumnWithId) {
    return R.find((cmp: ComponentFactory<any>) => cmp.componentType.name === config.component.name, this.componentFactories);
  }

  toggleRowSelection() {
    this.toggleRow.emit();
  }

}
