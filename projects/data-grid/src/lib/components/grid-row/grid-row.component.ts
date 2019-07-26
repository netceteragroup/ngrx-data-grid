import { Component, ComponentFactory, EventEmitter, Input, Output } from '@angular/core';
import * as R from 'ramda';
import { columnValueResolver, DataGridColumn } from '../../models';

@Component({
  selector: 'ngrx-grid-row',
  templateUrl: 'grid-row.component.html',
  styleUrls: ['./grid-row.component.scss']
})
export class GridRowComponent {
  @Input() data: any;
  @Input() columns: DataGridColumn[];
  @Input() componentFactories: ComponentFactory<any>[];
  @Input() isSelected: boolean;
  @Output() toggleRow = new EventEmitter;

  trackByIndex(_, index) {
    return index;
  }

  getColumnData(column: DataGridColumn) {
    return columnValueResolver(column)(this.data);
  }

  getComponent(config: DataGridColumn) {
    return R.find((cmp: ComponentFactory<any>) => cmp.componentType.name === config.component.name, this.componentFactories);
  }

  toggleRowSelection() {
    this.toggleRow.emit();
  }

}
