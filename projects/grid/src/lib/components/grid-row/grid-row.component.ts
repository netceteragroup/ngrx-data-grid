import { Component, ComponentFactory, Input, Output, EventEmitter } from '@angular/core';
import * as R from 'ramda';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';

@Component({
  selector: 'pcs-grid-row',
  templateUrl: 'grid-row.component.html'
})
export class GridRowComponent {
  @Input() dataAndConfig: Array<DataAndConfig>;
  @Input() componentFactories: ComponentFactory<any>[];
  @Input() isSelected: boolean;
  @Output() toggleRow = new EventEmitter;


  getComponent(config: ColumnConfig) {
    return R.find((cmp: ComponentFactory<any>) => cmp.componentType.name === config.component.name, this.componentFactories);
  }

  toggleRowSelection() {
    this.toggleRow.emit();
  }

}
