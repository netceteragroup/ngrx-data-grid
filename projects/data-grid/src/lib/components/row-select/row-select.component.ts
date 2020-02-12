import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../../config';
import { isCheckboxSelection, isRadioSelection } from '../../util/selection';

@Component({
  selector: 'ngrx-row-select',
  templateUrl: 'row-select.component.html',
  styleUrls: ['./row-select.component.scss']
})
export class RowSelectComponent {
  @Input() isSelected = false;
  @Input() id: any;
  @Input() type: SelectionType;

  @Output() selected = new EventEmitter();

  get inputId() {
    return `${this.id}-${this.type}`;
  }

  isCheckbox() {
    return isCheckboxSelection(this.type);
  }

  isRadio() {
    return isRadioSelection(this.type);
  }

  select() {
    if (!this.isSelected) {
      this.selected.emit();
    }
  }

}
