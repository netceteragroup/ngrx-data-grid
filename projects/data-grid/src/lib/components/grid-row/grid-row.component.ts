import { Component, ComponentFactory, EventEmitter, Input, Output } from '@angular/core';
import * as R from 'ramda';
import { ColumnConfig, DataAndConfig } from '../../config';

@Component({
  selector: 'ngrx-grid-row',
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
